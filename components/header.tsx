"use client"

import { ShoppingCart, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-black p-2 rounded-lg">
              <Shirt className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-black">SengHong Shop</span>
          </div>

          <Button variant="ghost" size="sm" onClick={onCartClick} className="relative">
            <ShoppingCart className="h-5 w-5 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
