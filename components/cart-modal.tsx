"use client"
import { X, Plus, Minus, ShoppingBag, MessageCircle, Truck, MapPin } from "lucide-react"
import { type CartState, calculateCartTotals, generateTelegramUrl } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface CartModalProps {
  cart: CartState
  onClose: () => void
  onUpdateCart: (cart: CartState) => void
}

export default function CartModal({ cart, onClose, onUpdateCart }: CartModalProps) {
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery")
  const [deliveryTime, setDeliveryTime] = useState("")

  const updateItemQuantity = (itemIndex: number, optionIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemOption(itemIndex, optionIndex)
      return
    }

    const updatedItems = [...cart.items]
    const item = updatedItems[itemIndex]

    // Update the specific option quantity
    item.options[optionIndex].quantity = newQuantity

    // Recalculate item totals
    item.totalQuantity = item.options.reduce((sum, opt) => sum + opt.quantity, 0)
    item.totalPrice = item.totalQuantity * item.price

    // Recalculate cart totals
    const cartTotals = calculateCartTotals(updatedItems)
    onUpdateCart({ items: updatedItems, ...cartTotals })
  }

  const removeItemOption = (itemIndex: number, optionIndex: number) => {
    const updatedItems = [...cart.items]
    const item = updatedItems[itemIndex]

    // Remove the specific option
    item.options.splice(optionIndex, 1)

    // If no options left, remove the entire item
    if (item.options.length === 0) {
      updatedItems.splice(itemIndex, 1)
    } else {
      // Recalculate item totals
      item.totalQuantity = item.options.reduce((sum, opt) => sum + opt.quantity, 0)
      item.totalPrice = item.totalQuantity * item.price
    }

    // Recalculate cart totals
    const cartTotals = calculateCartTotals(updatedItems)
    onUpdateCart({ items: updatedItems, ...cartTotals })
  }

  const removeEntireItem = (itemIndex: number) => {
    const updatedItems = cart.items.filter((_, index) => index !== itemIndex)
    const cartTotals = calculateCartTotals(updatedItems)
    onUpdateCart({ items: updatedItems, ...cartTotals })
  }

  const handleTelegramCheckout = () => {
    if (deliveryOption === "delivery" && !deliveryTime.trim()) {
      alert("Please specify your preferred delivery time before proceeding.")
      return
    }

    const telegramUrl = generateTelegramUrl(cart.items, deliveryOption, deliveryTime)

    const confirmed = window.confirm(
      `You will be redirected to Telegram to complete your order with ${deliveryOption} option. Make sure you have Telegram installed or access to Telegram Web. Continue?`,
    )

    if (confirmed) {
      window.open(telegramUrl, "_blank")

      setTimeout(() => {
        alert("Order sent to Telegram! Please check your Telegram app to complete the order.")
        onClose()
      }, 1000)
    }
  }

  if (cart.items.length === 0) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Your Cart</span>
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-8">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Your Cart</span>
              <Badge variant="secondary">{cart.totalItems} items</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {cart.items.map((item, itemIndex) => (
            <div key={`${item.productId}-${itemIndex}`} className="border border-border rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-balance">{item.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntireItem(itemIndex)}
                      className="text-destructive hover:text-destructive flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">${item.price.toFixed(2)} each</p>

                  {/* Options */}
                  <div className="space-y-3">
                    {item.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4 text-sm">
                            <span>
                              <strong>Color:</strong> {option.color}
                            </span>
                            <span>
                              <strong>Size:</strong> {option.size}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemOption(itemIndex, optionIndex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(itemIndex, optionIndex, option.quantity - 1)}
                              disabled={option.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{option.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(itemIndex, optionIndex, option.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <span className="text-sm font-medium">${(option.quantity * item.price).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Item Total:</span>
                      <span className="font-bold">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Cart Summary */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Total Items:</span>
            <span className="font-bold">{cart.totalItems}</span>
          </div>

          <div className="flex justify-between items-center text-xl">
            <span className="font-semibold">Total Price:</span>
            <span className="font-bold text-primary">${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Delivery Options *</h3>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={deliveryOption === "delivery" ? "default" : "outline"}
              onClick={() => setDeliveryOption("delivery")}
              className="flex items-center space-x-2 h-auto p-4"
            >
              <Truck className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Delivery</div>
                <div className="text-xs opacity-75">To your address</div>
              </div>
            </Button>

            <Button
              variant={deliveryOption === "pickup" ? "default" : "outline"}
              onClick={() => setDeliveryOption("pickup")}
              className="flex items-center space-x-2 h-auto p-4"
            >
              <MapPin className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Pickup</div>
                <div className="text-xs opacity-75">From store</div>
              </div>
            </Button>
          </div>

          {deliveryOption === "delivery" && (
            <div className="space-y-2">
              <label htmlFor="delivery-time" className="text-sm font-medium">
                Preferred Delivery Time *
              </label>
              <input
                id="delivery-time"
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="e.g., Tomorrow 2-4 PM, Weekend morning, etc."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Checkout Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleTelegramCheckout}
            className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Buy via Telegram
          </Button>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>📱 Click "Buy via Telegram" to send your order</p>
            <p>💬 Complete your purchase by chatting with @Shong09111</p>
            <p>🚚 We'll confirm details and arrange {deliveryOption}</p>
            <p className="font-medium">
              Selected:{" "}
              {deliveryOption === "delivery" ? `Delivery${deliveryTime ? ` (${deliveryTime})` : ""}` : "Store Pickup"}
            </p>
          </div>

          <Button onClick={onClose} variant="outline" className="w-full bg-transparent" size="lg">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
