"use client"

import type { OrderData, DrinkItem, ExtraItem } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { se } from "date-fns/locale"
import { set } from "date-fns"

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
]

const EXTRAS = [
  { id: "jam", name: "Jam", price: 1.0, quantity: 0},
  { id: "dessert", name: "Pastry Dessert", price: 3.5, quantity: 0},
]

export function StepTwo({ orderData, onUpdate }: StepTwoProps) {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<Array<ExtraItem>>([])

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

  const handleAddExtra = (extraId: string) => {
    const existingExtra = orderData.extras.find((e) => e.extraId === extraId)

    if (existingExtra) {
      // Increase quantity
      const updatedExtras = orderData.extras.map((e) =>
        e.extraId === extraId ? { ...e, quantity: e.quantity + 1 } : e,
      )
      onUpdate({ extras: updatedExtras })
    } else {
      // Add new extra
      const newExtra: ExtraItem = {
        id: `extra-${Date.now()}`,
        extraId,
        quantity: 1,
      }
      onUpdate({ extras: [...orderData.extras, newExtra] })
    }
  }

  const handleRemoveExtra = (extraId: string) => {
    const updatedExtras = orderData.extras
      .map((e) => (e.extraId === extraId ? { ...e, quantity: e.quantity - 1 } : e))
      .filter((e) => e.quantity > 0)
    onUpdate({ extras: updatedExtras })
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
            {EXTRAS.map((extra) => {
              const extraInOrder = orderData.extras.find((e) => e.extraId === extra.id)
              return (
                <Card
                  key={extra.id}
                  className={`p-4 border-2 transition-all ${
                    extraInOrder ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{extra.name}</h3>
                      <p className="text-primary font-bold">£{extra.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {extraInOrder ? (
                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleRemoveExtra(extra.id)} variant="outline" size="sm" className="flex-1">
                        −
                      </Button>
                      <span className="font-bold text-lg text-foreground w-8 text-center">{extraInOrder.quantity}</span>
                      <Button
                        onClick={() => handleAddExtra(extra.id)}
                        variant="default"
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddExtra(extra.id)}
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
    </div>
  )
}
