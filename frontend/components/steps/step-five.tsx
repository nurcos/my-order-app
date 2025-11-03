"use client"

import type { FoodItem, OrderData } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StepFiveProps {
  orderData: OrderData
}

export function StepFive({ orderData }: StepFiveProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")

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
    // Delivery fee (only if there are items)
    // if (orderData.items.length > 0) {
    //   total += 2.0
    // }

    return total
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Payment Information</h2>
        <div className="space-y-4">
          <div>
          <label className="block text-sm font-medium text-foreground mb-2">Cardholder Name *</label>
          <Input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Doe"
            className="w-full"
          />
            </div>
            <div>
          <label className="block text-sm font-medium text-foreground mb-2">Card Number *</label>
          <Input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, "").slice(0, 16))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full font-mono"
          />
            </div>
            <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Expiry Date *</label>
            <Input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value.slice(0, 5))}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">CVV *</label>
            <Input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.slice(0, 3))}
              placeholder="123"
              maxLength={3}
              className="w-full font-mono"
            />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Alternative Payment Methods</h3>
          <div className="text-sm text-muted-foreground mb-2">
            You can also choose to pay using Google Pay or Apple Pay.
          </div>
        </div>
          <div className="flex items-center justify-center space-x-4 mt-6">
        <Button className="bg-gray-200 text-white px-4 py-2 rounded-md border border-gray-900">
          <span className="sr-only">Pay with Google Pay</span>
          <img src="/img/google-pay-logo.png" alt="Google Pay" className="h-6" />
        </Button>
        <Button className="bg-gray-200 text-white px-4 py-2 rounded-md border border-gray-900">
          <span className="sr-only">Pay with Apple Pay</span>
          <img src="/img/apple-pay-logo.png" alt="Apple Pay" className="h-6" />
        </Button>
          </div>
        </div>
      </div>

      <Card className="p-6 bg-primary/10 border-2 border-primary">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Order Total</span>
          <span className="text-3xl font-bold text-primary">£{calculateTotal().toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          By clicking "Complete Payment", you agree to our terms and conditions.
        </p>
      </Card>
    </div>
  )
}
