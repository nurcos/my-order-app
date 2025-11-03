"use client"

import type { FoodItem, OrderData } from "../ordering-wizard"
import { Card } from "@/components/ui/card"

interface StepFourProps {
  orderData: OrderData
}

export function StepFour({ orderData }: StepFourProps) {
  function calculateFoodItemPrice(item: FoodItem): number {
    let price = 0
    price += item.price as number;
    item.options.forEach((option: any) => {
      option.data.forEach((data: { price: number }) => {
        price += data.price;
      });
    });
    return price
  }

  const calculateTotal = () => {
    let total = 0

    // Food Items
    orderData.items.forEach((item) => {
      total += calculateFoodItemPrice(item)
    })

    // Drinks
    orderData.drinks.forEach((drink) => {
      const drinkInfo = orderData.drinks.find(d => d.id === drink.id)
      if (drinkInfo && drinkInfo.price) total += drinkInfo.price * drink.quantity
    })

    // Extras
    orderData.extras.forEach((extra) => {
      const extraInfo = orderData.extras.find(e => e.id === extra.id)
      if (extraInfo && extraInfo.price) total += extraInfo.price * extra.quantity
    })

    if (orderData.items.length > 0) {
      total += 2.0
    }

    return total
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Order Review</h2>

      {/* Food Section */}
      {orderData.items.length > 0 && (
        <Card className="p-4 bg-secondary/20 border border-secondary">
          <h3 className="font-bold text-lg text-foreground mb-3">Your Items ({orderData.items.length})</h3>
          <div className="space-y-3">
            {orderData.items.map((item, index) => (
              <div key={item.id} className="border-b border-border pb-3 last:border-b-0">
                <p className="font-semibold text-foreground mb-2">#{index + 1}</p>
                <div className="space-y-1 text-sm ml-2">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                  </div>
                    {item.options && item.options.length > 0 && (
                      <>
                      {item.options.map((option: any) => (
                        <p className="text-muted-foreground" key={option.id}>
                          {option.name}:
                          {option.data.map((data: any, index: number) => (
                          <span className="text-muted-foreground ml-1" key={index}>
                            {data.name}
                            {index < option.data.length - 1 && ","}
                          </span>
                          ))}
                          { option.data.length === 0 && <span className="text-muted-foreground ml-1">None</span> }
                        </p>
                      ))}
                      </>
                    )}
                  <div className="flex justify-between font-bold text-primary pt-1 border-t border-border mt-1">
                    <span>Subtotal</span>
                    <span>£{item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Drinks Section */}
      {(orderData.drinks.length > 0) && (
        <Card className="p-4 bg-secondary/20 border border-secondary">
          <h3 className="font-bold text-lg text-foreground mb-3">Drinks</h3>
          <div className="space-y-2 text-sm">
            {orderData.drinks.map((drink) => (
              <div key={drink.id} className="flex justify-between">
                <span>
                  {drink.name} x {drink.quantity}
                </span>
                <span className="font-semibold">
                  £{((drink?.price || 0) * drink.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Extras Section */}
      {(orderData.extras.length > 0) && (
        <Card className="p-4 bg-secondary/20 border border-secondary">
          <h3 className="font-bold text-lg text-foreground mb-3">Extras</h3>
          <div className="space-y-2 text-sm">
            {orderData.extras.map((extra) => (
              <div key={extra.id} className="flex justify-between">
                <span>
                  {extra.name} x {extra.quantity}
                </span>
                <span className="font-semibold">
                  £{((extra?.price || 0) * extra.quantity).toFixed(2)}
                </span>
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
