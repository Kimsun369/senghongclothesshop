"use client"

import { useState } from "react"
import { type Product } from "@/lib/google-sheets"
import { type CartState } from "@/lib/cart"

interface MenuSectionProps {
  viewMode: "home" | "category" | "event"
  categoryToShow: string
  filteredProducts: Product[]
  searchQuery: string
  cart: CartState
  onBackToHome: () => void
  onSearchChange: (query: string) => void
  onCartClick: () => void
}

export default function MenuSection({
  viewMode,
  categoryToShow,
  filteredProducts,
  searchQuery,
  cart,
  onBackToHome,
  onSearchChange,
  onCartClick
}: MenuSectionProps) {
  const [showFilters, setShowFilters] = useState(false)

  if (viewMode === "home") return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToHome}
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
        <button 
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm"
          onClick={() => setShowFilters(!showFilters)}
        >
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
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
  )
}