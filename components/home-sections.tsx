"use client"

import { type Product } from "@/lib/google-sheets"
import { getActiveEvents, getEventById, getProductsByEvent } from "@/lib/google-sheets"

interface HomepageSectionProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onShopMore: (category: string) => void
  onEventSeeMore: (eventId: string) => void
}

export default function HomepageSection({
  products,
  onProductClick,
  onShopMore,
  onEventSeeMore
}: HomepageSectionProps) {
  const categories = Array.from(new Set(products.map((p) => p.category)))
  const activeEvents = getActiveEvents()

  const getProductsForCategory = (category: string, limit = 4) => {
    return products.filter((p) => p.category === category).slice(0, limit)
  }

  const getProductsForEvent = (eventId: string, limit = 4) => {
    return getProductsByEvent(products, eventId).slice(0, limit)
  }

  return (
    <div className="space-y-8">
      {activeEvents.map((event) => {
        const eventProducts = getProductsForEvent(event.id, 8)
        if (eventProducts.length === 0) return null

        return (
          <div key={event.id} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  {event.discountPercentage}% OFF
                </div>
                <h2 className="text-lg font-semibold">{event.title}</h2>
              </div>
              <button
                onClick={() => onEventSeeMore(event.id)}
                className="text-sm text-gray-600 hover:text-black transition-all duration-300 font-medium hover:scale-105 transform"
              >
                See More
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                {eventProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onClick={() => onProductClick(product)}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {categories.slice(0, 5).map((category) => {
        const categoryProducts = getProductsForCategory(category, 8)
        if (categoryProducts.length === 0) return null

        return (
          <div key={category} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold capitalize">{category} Collection</h2>
              <button
                onClick={() => onShopMore(category)}
                className="text-sm text-gray-600 hover:text-black transition-all duration-300 font-medium hover:scale-105 transform"
              >
                See More
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                {categoryProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onClick={() => onProductClick(product)}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProductCard({ product, index, onClick }: { product: Product; index: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-1 flex-shrink-0 animate-slide-in group"
      style={{
        width: "160px",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-bounce">
            {product.discount}% OFF
          </div>
        )}
        <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-125 transform opacity-0 group-hover:opacity-100">
          <svg
            className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
        <p className="text-xs text-gray-500 mb-1">ID: {product.id}</p>
        <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.discount ? (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-red-600 animate-pulse">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 3).map((color, colorIndex) => (
              <div
                key={colorIndex}
                className="w-3 h-3 rounded-full border border-gray-300 transition-all duration-300 hover:scale-150 hover:shadow-md cursor-pointer"
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}