"use client"

import { useState } from "react"
import { X, Plus, Minus } from "lucide-react"
import type { Product } from "@/lib/google-sheets"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductOption {
  color: string
  size: string
  quantity: number
}

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, options: ProductOption[]) => void
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [options, setOptions] = useState<ProductOption[]>([
    { color: product.colors[0] || "", size: product.sizes[0] || "", quantity: 1 },
  ])

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  const addNewOption = () => {
    setOptions([...options, { color: product.colors[0] || "", size: product.sizes[0] || "", quantity: 1 }])
  }

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, field: keyof ProductOption, value: string | number) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const updateQuantity = (index: number, increment: boolean) => {
    const newOptions = [...options]
    const currentQuantity = newOptions[index].quantity
    if (increment) {
      newOptions[index].quantity = currentQuantity + 1
    } else if (currentQuantity > 1) {
      newOptions[index].quantity = currentQuantity - 1
    }
    setOptions(newOptions)
  }

  const totalQuantity = options.reduce((sum, option) => sum + option.quantity, 0)
  const totalPrice = totalQuantity * discountedPrice

  const handleAddToCart = () => {
    onAddToCart(product, options)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-balance">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
            {product.discount && (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                -{product.discount}%
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-pretty">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              {product.discount ? (
                <>
                  <span className="text-2xl font-bold text-foreground">${discountedPrice.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-foreground">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Select Options</h3>

              {options.map((option, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Option {index + 1}</span>
                    {options.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Color Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <Select value={option.color} onValueChange={(value) => updateOption(index, "color", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Size Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Size</label>
                      <Select value={option.size} onValueChange={(value) => updateOption(index, "size", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, false)}
                        disabled={option.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-medium w-8 text-center">{option.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(index, true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Another Option Button */}
              <Button variant="outline" onClick={addNewOption} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Option
              </Button>
            </div>

            {/* Total Summary */}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Quantity:</span>
                <span className="font-bold">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total Price:</span>
                <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
