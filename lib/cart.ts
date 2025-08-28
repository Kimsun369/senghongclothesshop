export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  options: {
    color: string
    size: string
    quantity: number
  }[]
  totalQuantity: number
  totalPrice: number
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Helper function to calculate cart totals
export function calculateCartTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.totalQuantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0)
  return { totalItems, totalPrice }
}

// Helper function to format cart for Telegram
export function formatCartForTelegram(
  items: CartItem[],
  deliveryOption: "delivery" | "pickup",
  deliveryTime?: string,
): string {
  const now = new Date()
  const orderTime = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  let message = `Order Time: ${orderTime}\n\n`

  items.forEach((item, index) => {
    item.options.forEach((option, optionIndex) => {
      const itemNumber = index === 0 && optionIndex === 0 ? 1 : index + 1 + optionIndex
      message += `Item ${itemNumber}: ${item.name}\n`
      message += `   Amount: ${option.quantity}\n`
      message += `   Size: ${option.size}\n`
      message += `   Color: ${option.color}\n\n`
    })
  })

  if (deliveryOption === "delivery" && deliveryTime) {
    message += `Preferred Delivery Time: ${deliveryTime}\n\n`
  } else if (deliveryOption === "pickup") {
    message += `Pickup Option Selected\n\n`
  }

  message += "Thank you!"

  return message
}

// Helper function to generate Telegram URL
export function generateTelegramUrl(
  cartItems: CartItem[],
  deliveryOption: "delivery" | "pickup",
  deliveryTime?: string,
): string {
  const message = formatCartForTelegram(cartItems, deliveryOption, deliveryTime)
  return `https://t.me/Shong09111?text=${encodeURIComponent(message)}`
}
