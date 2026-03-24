"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import type { Restaurant } from "./ordering-wizard"
import { useEffect, useRef, useState } from "react"
import { pb } from "../lib/pb"
import { getClosingTime, getOpeningTime, isOpen } from "../lib/utils"

interface RestaurantSelectionProps {
  onSelectRestaurant: (restaurant: Restaurant) => void
  onBack: () => void
}

export function RestaurantSelection({ onSelectRestaurant, onBack }: RestaurantSelectionProps) {

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const didFetch = useRef(false)

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true

    setLoading(true)
    pb.get("stores", "", "open_hours_via_store")
      .then((data:any) => {
        setRestaurants(data)
      })
      .catch((err:any) => setError(err.message))
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/img/new-logo.png"
            alt="MyOrder App"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <p className="text-white text-lg">Select Your Local Restaurant</p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {loading && (
            <div className="flex justify-center items-center py-8 col-span-full">
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
          )}
          
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary"
            >
              <div className="space-y-4">
                <div className="flex gap-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.location}</p>
                  </div>
                  <Image
                    src="/img/restaurants/twhb-logo.png"
                    alt={restaurant.name}
                    width={60}
                    height={60}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <span className="font-semibold text-primary">{restaurant.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>⏱️ {restaurant.delivery_time}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between  border-t border-muted">
                  <div>
                    <p className="text-xs text-muted-foreground">Min. order: £{restaurant.min_order}</p>
                  </div>
                  <div>
                    {isOpen(restaurant) ? (
                      <p className="text-xs text-muted-foreground">Open. Closes at {getClosingTime(restaurant).getHours()}:{String(getClosingTime(restaurant).getMinutes()).padStart(2, "0")}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Closed. Opens at {getOpeningTime(restaurant).getHours()}:{String(getOpeningTime(restaurant).getMinutes()).padStart(2, "0")}</p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => onSelectRestaurant(restaurant)}
                  disabled={!isOpen(restaurant)}
                  className="w-full bg-[#bb2f39] hover:bg-primary/90 text-primary-foreground border border-2 border-black font-semibold"
                >
                  Order from Here
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button onClick={onBack} variant="outline" className="px-8 bg-transparent text-white">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
