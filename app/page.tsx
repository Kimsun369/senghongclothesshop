"use client"

import { useState, useEffect } from "react"
import {
  type Product,
  fetchProducts,
  getProductsByCategory,
  searchProducts,
  getProductsByEvent,
  getEventById,
  getActiveEvents,
} from "@/lib/google-sheets"
import { type CartItem, type CartState, calculateCartTotals } from "@/lib/cart"
import Header from "@/components/header"
import ImageCarousel from "@/components/image-carousel"
import ProductGrid from "@/components/product-grid"
import ProductModal from "@/components/product-modal"
import CartModal from "@/components/cart-modal"
import Footer from "@/components/footer"
import LoadingSpinner from "@/components/loading-spinner"
import ErrorBoundary from "@/components/error-boundary"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("clothes")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartState>({ items: [], totalItems: 0, totalPrice: 0 })
  const [showCart, setShowCart] = useState(false)
  const [viewMode, setViewMode] = useState<"home" | "category" | "event">("home")
  const [categoryToShow, setCategoryToShow] = useState<string>("")
  const [selectedEventId, setSelectedEventId] = useState<string>("")

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (viewMode === "event" && selectedEventId) {
      filtered = getProductsByEvent(products, selectedEventId)
    } else if (selectedCategory) {
      filtered = getProductsByCategory(filtered, selectedCategory)
    }

    if (searchQuery) {
      filtered = searchProducts(filtered, searchQuery)
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery, viewMode, selectedEventId])

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const activeEvents = getActiveEvents()

  const handleShopMore = (category: string) => {
    setCategoryToShow(category)
    setSelectedCategory(category)
    setViewMode("category")
    setSelectedEventId("")
  }

  const handleEventSeeMore = (eventId: string) => {
    const event = getEventById(eventId)
    if (event) {
      setSelectedEventId(eventId)
      setCategoryToShow(`${event.title} - ${event.description}`)
      setViewMode("event")
      setSelectedCategory("")
    }
  }

  const handleBackToHome = () => {
    setViewMode("home")
    setSelectedCategory("clothes")
    setCategoryToShow("")
    setSearchQuery("")
    setSelectedEventId("")
  }

  const getProductsForCategory = (category: string, limit = 4) => {
    return products.filter((p) => p.category === category).slice(0, limit)
  }

  const getProductsForEvent = (eventId: string, limit = 4) => {
    return getProductsByEvent(products, eventId).slice(0, limit)
  }

  const handleAddToCart = (product: Product, options: { color: string; size: string; quantity: number }[]) => {
    const existingItemIndex = cart.items.findIndex((item) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      const updatedItems = [...cart.items]
      const existingItem = updatedItems[existingItemIndex]

      const mergedOptions = [...existingItem.options]
      options.forEach((newOption) => {
        const existingOptionIndex = mergedOptions.findIndex(
          (opt) => opt.color === newOption.color && opt.size === newOption.size,
        )

        if (existingOptionIndex >= 0) {
          mergedOptions[existingOptionIndex].quantity += newOption.quantity
        } else {
          mergedOptions.push(newOption)
        }
      })

      const totalQuantity = mergedOptions.reduce((sum, opt) => sum + opt.quantity, 0)
      const totalPrice = totalQuantity * product.price * (1 - (product.discount || 0) / 100)

      updatedItems[existingItemIndex] = {
        ...existingItem,
        options: mergedOptions,
        totalQuantity,
        totalPrice,
      }

      const cartTotals = calculateCartTotals(updatedItems)
      setCart({ items: updatedItems, ...cartTotals })
    } else {
      const totalQuantity = options.reduce((sum, opt) => sum + opt.quantity, 0)
      const totalPrice = totalQuantity * product.price * (1 - (product.discount || 0) / 100)

      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price * (1 - (product.discount || 0) / 100),
        image: product.image,
        options,
        totalQuantity,
        totalPrice,
      }

      const updatedItems = [...cart.items, newItem]
      const cartTotals = calculateCartTotals(updatedItems)
      setCart({ items: updatedItems, ...cartTotals })
    }

    setSelectedProduct(null)
  }

  const handleCarouselShopNow = (action: { type: "category" | "event"; value: string }) => {
    if (action.type === "category") {
      handleShopMore(action.value)
    } else if (action.type === "event") {
      handleEventSeeMore(action.value)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-muted-foreground">Loading SengHong Store...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header cartCount={cart.totalItems} onCartClick={() => setShowCart(true)} />

        <main>
          {viewMode === "home" && <ImageCarousel onShopNow={handleCarouselShopNow} />}

          <div className="container mx-auto px-4 py-6">
            {(viewMode === "category" || viewMode === "event") && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleBackToHome}
                    className="flex items-center text-gray-600 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <h1 className="text-lg font-semibold capitalize">
                    {categoryToShow} ({filteredProducts.length} Items)
                  </h1>
                  <div></div>
                </div>

                <div className="flex gap-2 mb-4">
                  {["All", "Women", "Men", "Boys", "Girls"].map((filter) => (
                    <button
                      key={filter}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === "All" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                    Sort
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                      />
                    </svg>
                    Filter
                  </button>
                </div>

                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {viewMode === "home" && (
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
                          onClick={() => handleEventSeeMore(event.id)}
                          className="text-sm text-gray-600 hover:text-black transition-all duration-300 font-medium hover:scale-105 transform"
                        >
                          See More
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                          {eventProducts.map((product, index) => (
                            <div
                              key={product.id}
                              onClick={() => setSelectedProduct(product)}
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
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-bounce">
                                  {product.discount}% OFF
                                </div>
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
                                    <div className="flex flex-col gap-1">
                                      <span className="text-sm font-semibold text-red-600 animate-pulse">
                                        ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                                      </span>
                                      <span className="text-xs text-gray-400 line-through">
                                        ${product.price.toFixed(2)}
                                      </span>
                                    </div>
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
                          onClick={() => handleShopMore(category)}
                          className="text-sm text-gray-600 hover:text-black transition-all duration-300 font-medium hover:scale-105 transform"
                        >
                          See More
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                          {categoryProducts.map((product, index) => (
                            <div
                              key={product.id}
                              onClick={() => setSelectedProduct(product)}
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
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {(viewMode === "category" || viewMode === "event") && (
              <ProductGrid products={filteredProducts} onProductClick={setSelectedProduct} />
            )}
          </div>
        </main>

        <Footer />

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}

        {showCart && <CartModal cart={cart} onClose={() => setShowCart(false)} onUpdateCart={setCart} />}
      </div>
    </ErrorBoundary>
  )
}
