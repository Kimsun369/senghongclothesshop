"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 50% off on all shirts",
    image: "/summer-sale-banner.png",
    color: "from-blue-500 to-purple-600",
    action: { type: "category", value: "shirts" },
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh styles for the season",
    image: "/new-arrivals-banner.png",
    color: "from-green-500 to-teal-600",
    action: { type: "event", value: "new-arrivals-2025" },
  },
  {
    id: 3,
    title: "Premium Denim",
    subtitle: "Quality jeans at great prices",
    image: "/denim-collection-banner.png",
    color: "from-indigo-500 to-blue-600",
    action: { type: "category", value: "jeans" },
  },
  {
    id: 4,
    title: "Free Shipping",
    subtitle: "On orders over $75",
    image: "/free-shipping-banner.png",
    color: "from-orange-500 to-red-600",
    action: { type: "category", value: "clothes" },
  },
]

interface ImageCarouselProps {
  onShopNow?: (action: { type: "category" | "event"; value: string }) => void
}

export default function ImageCarousel({ onShopNow }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleShopNow = () => {
    const currentBanner = banners[currentSlide]
    if (onShopNow && currentBanner.action) {
      onShopNow(currentBanner.action)
    }
  }

  return (
    <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${banner.color} flex items-center justify-center relative`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            {/* Content */}
            <div className="text-center text-white z-10 px-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-balance">{banner.title}</h2>
              <p className="text-lg md:text-xl opacity-90 text-pretty">{banner.subtitle}</p>
              <Button
                className="mt-6 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
                size="lg"
                onClick={handleShopNow}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
