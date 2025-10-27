"use client"

import type { OrderData } from "../ordering-wizard"
import { Card } from "@/components/ui/card"

interface StepFourProps {
  orderData: OrderData
}

const BAGUETTE_TYPES: Record<string, { name: string; price: number }> = {
  classic: { name: "Classic Baguette", price: 4.99 },
  "whole-wheat": { name: "Wholemeal", price: 5.49 },
  sourdough: { name: "Sourdough", price: 5.99 },
}

const FILLINGS: Record<string, { name: string; price: number }> = {
  butter: { name: "Butter", price: 0.5 },
  cheese: { name: "Cheese", price: 1.0 },
  ham: { name: "Ham", price: 1.5 },
  salami: { name: "Salami", price: 1.5 },
  vegetables: { name: "Vegetables", price: 1.0 },
  pesto: { name: "Pesto", price: 1.25 },
}

const DRINKS: Record<string, { name: string; price: number }> = {
  water: { name: "Bottled Water", price: 2.0 },
  cola: { name: "Cola", price: 2.5 },
  lemonade: { name: "Lemonade", price: 2.5 },
  "orange-juice": { name: "Orange Juice", price: 3.0 },
  coffee: { name: "Coffee", price: 3.5 },
  wine: { name: "Red Wine", price: 8.0 },
}

const EXTRAS: Record<string, { name: string; price: number }> = {
  "butter-packet": { name: "Butter Packet", price: 0.5 },
  jam: { name: "Jam", price: 1.0 },
  "cheese-plate": { name: "Cheese Plate", price: 4.0 },
  charcuterie: { name: "Charcuterie Board", price: 6.0 },
  dessert: { name: "Pastry Dessert", price: 3.5 },
  napkins: { name: "Extra Napkins", price: 0 },
}

export function StepFour({ orderData }: StepFourProps) {
  const calculateBaguettePrice = (baguetteIndex: number) => {
    const baguette = orderData.baguettes[baguetteIndex]
    if (!baguette) return 0

    let price = 0
    const baguetteType = BAGUETTE_TYPES[baguette.baguetteType]
    if (baguetteType) price += baguetteType.price

    baguette.filling.forEach((id) => {
      const filling = FILLINGS[id]
      if (filling) price += filling.price
    })

    return price
  }

  const calculateTotal = () => {
    let total = 0

    // Baguettes
    orderData.baguettes.forEach((_, index) => {
      total += calculateBaguettePrice(index)
    })

    // Drinks
    orderData.drinks.forEach((drink) => {
      const drinkInfo = DRINKS[drink.drinkId]
      if (drinkInfo) total += drinkInfo.price * drink.quantity
    })

    // Extras
    orderData.extras.forEach((id) => {
      const extra = EXTRAS[id]
      if (extra) total += extra.price
    })

    // Delivery fee
    total += 2.0

    return total
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Order Review</h2>

      {/* Baguettes Section */}
      {orderData.baguettes.length > 0 && (
        <Card className="p-4 bg-secondary/20 border border-secondary">
          <h3 className="font-bold text-lg text-foreground mb-3">Your Baguettes ({orderData.baguettes.length})</h3>
          <div className="space-y-3">
            {orderData.baguettes.map((baguette, index) => (
              <div key={baguette.id} className="border-b border-border pb-3 last:border-b-0">
                <p className="font-semibold text-foreground mb-2">Baguette #{index + 1}</p>
                <div className="space-y-1 text-sm ml-2">
                  <div className="flex justify-between">
                    <span>{BAGUETTE_TYPES[baguette.baguetteType]?.name}</span>
                    <span className="font-semibold">£{BAGUETTE_TYPES[baguette.baguetteType]?.price.toFixed(2)}</span>
                  </div>
                  {baguette.filling.length > 0 && (
                    <div className="border-t border-border pt-1 mt-1">
                      <p className="font-semibold mb-1">Fillings:</p>
                      {baguette.filling.map((id) => (
                        <div key={id} className="flex justify-between ml-2">
                          <span>{FILLINGS[id]?.name}</span>
                          <span>£{FILLINGS[id]?.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-primary pt-1 border-t border-border mt-1">
                    <span>Subtotal</span>
                    <span>£{calculateBaguettePrice(index).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Drinks & Extras Section */}
      {(orderData.drinks.length > 0 || orderData.extras.length > 0) && (
        <Card className="p-4 bg-secondary/20 border border-secondary">
          <h3 className="font-bold text-lg text-foreground mb-3">Drinks & Extras</h3>
          <div className="space-y-2 text-sm">
            {orderData.drinks.map((drink) => (
              <div key={drink.id} className="flex justify-between">
                <span>
                  {DRINKS[drink.drinkId]?.name} x{drink.quantity}
                </span>
                <span className="font-semibold">
                  £{((DRINKS[drink.drinkId]?.price || 0) * drink.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            {orderData.extras.map((id) => (
              <div key={id} className="flex justify-between">
                <span>{EXTRAS[id]?.name}</span>
                <span className="font-semibold">£{EXTRAS[id]?.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Delivery Info */}
      <Card className="p-4 bg-secondary/20 border border-secondary">
        <h3 className="font-bold text-lg text-foreground mb-3">Delivery Details</h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-semibold">
              {orderData.firstName} {orderData.lastName}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-semibold">
              {orderData.address}, {orderData.city} {orderData.zipCode}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact</p>
            <p className="font-semibold">
              {orderData.email} • {orderData.phone}
            </p>
          </div>
        </div>
      </Card>

      {/* Total */}
      <Card className="p-6 bg-primary/10 border-2 border-primary">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Subtotal</span>
          <span>£{(calculateTotal() - 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span>£2.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-foreground">Total</span>
          <span className="text-3xl font-bold text-primary">£{calculateTotal().toFixed(2)}</span>
        </div>
      </Card>
    </div>
  )
}
