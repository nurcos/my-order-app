"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Restaurant {
  id: string
  name: string
  location: string
  rating: number
  deliveryTime: string
  minOrder: number
}

interface RestaurantSelectionProps {
  onSelectRestaurant: (restaurantId: string) => void
  onBack: () => void
}

const RESTAURANTS: Restaurant[] = [
  {
    id: "watton-hot-baguette",
    name: "The Watton Hot Baguette",
    location: "Watton, Norfolk",
    rating: 5,
    deliveryTime: "25-35 mins",
    minOrder: 8,
  },
]

export function RestaurantSelection({ onSelectRestaurant, onBack }: RestaurantSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/img/logo.png"
            alt="MyOrder App"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <p className="text-muted-foreground text-lg">Select Your Local Restaurant</p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {RESTAURANTS.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary"
              onClick={() => onSelectRestaurant(restaurant.id)}
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.location}</p>
                  </div>
                  <Image
                    src="/img/restaurants/twhb-logo.png"
                    alt={restaurant.name}
                    width={80}
                    height={80}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <span className="font-semibold text-primary">{restaurant.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>⏱️ {restaurant.deliveryTime}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-muted">
                  <p className="text-xs text-muted-foreground">Min. order: £{restaurant.minOrder}</p>
                </div>

                <Button
                  onClick={() => onSelectRestaurant(restaurant.id)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Order from Here
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button onClick={onBack} variant="outline" className="px-8 bg-transparent">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
