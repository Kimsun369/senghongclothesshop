"use client"

import type { Product } from "@/lib/google-sheets"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onProductClick: (product: Product) => void
}

function ProductCard({ product, onProductClick }: ProductCardProps) {
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <div
      onClick={() => onProductClick(product)}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            {product.discount}% OFF
          </div>
        )}
        {product.badge && (
          <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-medium">
            {product.badge}
          </div>
        )}
        <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <p className="text-sm text-gray-500 mb-1">ID: {product.id}</p>
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.discount ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-red-600">${discountedPrice.toFixed(2)}</span>
                <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
