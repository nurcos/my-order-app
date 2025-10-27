"use client"

import type { OrderData, FoodItem } from "./ordering-wizard"
import { Card } from "@/components/ui/card"

interface CartSidebarProps {
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

function calculateFoodItemPrice(item: FoodItem): number {
  let price = 0
  return price
}

export function CartSidebar({ orderData }: CartSidebarProps) {
  const calculateTotal = () => {
    let total = 0

    // Baguettes
    orderData.items.forEach((item) => {
      total += calculateFoodItemPrice(item)
    })

    // Drinks
    orderData.drinks.forEach((drink) => {
      const drinkInfo = DRINKS[drink.drinkId]
      if (drinkInfo) total += drinkInfo.price * drink.quantity
    })

    // Extras
    // orderData.extras.forEach((id) => {
    //   const extra = EXTRAS[id]
    //   if (extra) total += extra.price
    // })

    // Delivery fee (only if there are items)
    if (orderData.items.length > 0) {
      total += 2.0
    }

    return total
  }

  const isEmpty = orderData.items.length === 0 && orderData.drinks.length === 0 && orderData.extras.length === 0

  return (
    <div className="sticky top-8">
      <Card className="p-6 bg-primary/5 border-2 border-primary">
        <h3 className="text-xl font-bold text-foreground mb-4">Your Cart</h3>

        {isEmpty ? (
          <p className="text-muted-foreground text-sm">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {/* Items */}
            {orderData.items.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-sm text-foreground">Items ({orderData.items.length})</p>
                {orderData.items.map((item, index) => (
                  <div key={item.id} className="text-xs bg-white/50 p-2 rounded border border-primary/20">
                    <p className="font-medium text-foreground">#{index + 1}</p>
                    <p className="text-muted-foreground">{item.id}</p>
                    {/* {item.filling && item.filling.length > 0 && (
                      <p className="text-muted-foreground text-xs">
                        +{(item as any).filling.map((f: string) => FILLINGS[f]?.name).join(", ")}
                      </p>
                    )} */}
                    <p className="font-semibold text-primary mt-1">£{calculateFoodItemPrice(item).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Drinks */}
            {orderData.drinks.length > 0 && (
              <div className="space-y-2 border-t border-primary/20 pt-2">
                <p className="font-semibold text-sm text-foreground">Drinks</p>
                {orderData.drinks.map((drink) => (
                  <div key={drink.id} className="text-xs flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {DRINKS[drink.drinkId]?.name} x{drink.quantity}
                    </span>
                    <span className="font-semibold text-primary">
                      £{((DRINKS[drink.drinkId]?.price || 0) * drink.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Extras */}
            {orderData.extras.length > 0 && (
              <div className="space-y-2 border-t border-primary/20 pt-2">
                <p className="font-semibold text-sm text-foreground">Extras</p>

              </div>
            )}

            {/* Delivery Fee */}
            {orderData.items.length > 0 && (
              <div className="border-t border-primary/20 pt-2 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-semibold text-primary">£2.00</span>
              </div>
            )}

            {/* Total */}
            <div className="border-t-2 border-primary pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">£{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
