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
import MenuSection from "@/components/menu"
import HomepageSection from "@/components/home-sections"

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
            <MenuSection
              viewMode={viewMode}
              categoryToShow={categoryToShow}
              filteredProducts={filteredProducts}
              searchQuery={searchQuery}
              cart={cart}
              onBackToHome={handleBackToHome}
              onSearchChange={setSearchQuery}
              onCartClick={() => setShowCart(true)}
            />

            {viewMode === "home" && (
              <HomepageSection
                products={products}
                onProductClick={setSelectedProduct}
                onShopMore={handleShopMore}
                onEventSeeMore={handleEventSeeMore}
              />
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