"use client"

import type { OrderData, DrinkItem } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StepTwoProps {
  orderData: OrderData
  onUpdate: (updates: Partial<OrderData>) => void
}

const DRINKS = [
  { id: "water", name: "Bottled Water", price: 2.0 },
  { id: "cola", name: "Cola", price: 2.5 },
  { id: "lemonade", name: "Lemonade", price: 2.5 },
  { id: "orange-juice", name: "Orange Juice", price: 3.0 },
  { id: "coffee", name: "Coffee", price: 3.5 },
  { id: "wine", name: "Red Wine", price: 8.0 },
]

const EXTRAS = [
  { id: "butter-packet", name: "Butter Packet", price: 0.5 },
  { id: "jam", name: "Jam", price: 1.0 },
  { id: "cheese-plate", name: "Cheese Plate", price: 4.0 },
  { id: "charcuterie", name: "Charcuterie Board", price: 6.0 },
  { id: "dessert", name: "Pastry Dessert", price: 3.5 },
  { id: "napkins", name: "Extra Napkins", price: 0 },
]

export function StepTwo({ orderData, onUpdate }: StepTwoProps) {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(null)

  const handleAddDrink = (drinkId: string) => {
    const existingDrink = orderData.drinks.find((d) => d.drinkId === drinkId)

    if (existingDrink) {
      // Increase quantity
      const updatedDrinks = orderData.drinks.map((d) =>
        d.drinkId === drinkId ? { ...d, quantity: d.quantity + 1 } : d,
      )
      onUpdate({ drinks: updatedDrinks })
    } else {
      // Add new drink
      const newDrink: DrinkItem = {
        id: `drink-${Date.now()}`,
        drinkId,
        quantity: 1,
      }
      onUpdate({ drinks: [...orderData.drinks, newDrink] })
    }
  }

  const handleRemoveDrink = (drinkId: string) => {
    const updatedDrinks = orderData.drinks
      .map((d) => (d.drinkId === drinkId ? { ...d, quantity: d.quantity - 1 } : d))
      .filter((d) => d.quantity > 0)
    onUpdate({ drinks: updatedDrinks })
  }

  const handleExtraToggle = (extraId: string) => {
    const newExtras = orderData.extras.includes(extraId)
      ? orderData.extras.filter((e) => e !== extraId)
      : [...orderData.extras, extraId]
    onUpdate({ extras: newExtras })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Select Drinks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DRINKS.map((drink) => {
            const drinkInOrder = orderData.drinks.find((d) => d.drinkId === drink.id)
            return (
              <Card
                key={drink.id}
                className={`p-4 border-2 transition-all ${
                  drinkInOrder ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{drink.name}</h3>
                    <p className="text-primary font-bold">£{drink.price.toFixed(2)}</p>
                  </div>
                </div>

                {drinkInOrder ? (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleRemoveDrink(drink.id)} variant="outline" size="sm" className="flex-1">
                      −
                    </Button>
                    <span className="font-bold text-lg text-foreground w-8 text-center">{drinkInOrder.quantity}</span>
                    <Button
                      onClick={() => handleAddDrink(drink.id)}
                      variant="default"
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleAddDrink(drink.id)}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    Add to Order
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Add Extras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXTRAS.map((extra) => (
            <Button
              key={extra.id}
              onClick={() => handleExtraToggle(extra.id)}
              variant={orderData.extras.includes(extra.id) ? "default" : "outline"}
              className={`py-6 justify-start ${
                orderData.extras.includes(extra.id) ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={orderData.extras.includes(extra.id)}
                onChange={() => {}}
                className="mr-3"
              />
              <span className="flex-1 text-left">{extra.name}</span>
              {extra.price > 0 && <span className="text-sm">+£{extra.price.toFixed(2)}</span>}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
