"use client"
import { useState } from "react"
import { OrderingWizard } from "@/components/ordering-wizard"
import { HomeScreen } from "@/components/home-screen"
import { RestaurantSelection } from "@/components/restaurant-selection"
import type { Restaurant } from "@/components/ordering-wizard"

export default function Home() {
  const [screen, setScreen] = useState<"home" | "restaurants" | "ordering">("home")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const handleStartOrder = () => {
    setScreen("restaurants")
  }

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setScreen("ordering")
  }

  const handleBackToHome = () => {
    setScreen("home")
    setSelectedRestaurant(null)
  }

  const handleBackToRestaurants = () => {
    setScreen("restaurants")
  }

  if (screen === "home") {
    return <HomeScreen onStartOrder={handleStartOrder} />
  }

  if (screen === "restaurants") {
    return <RestaurantSelection onSelectRestaurant={handleSelectRestaurant} onBack={handleBackToHome} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      <OrderingWizard handleBack={handleBackToRestaurants} selectedRestaurant={selectedRestaurant} />
    </main>
  )
}
