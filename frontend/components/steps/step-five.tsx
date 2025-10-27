"use client"

import type { OrderData } from "../ordering-wizard"
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

  const calculateTotal = () => {
    let total = 0
    const BAGUETTE_TYPES: Record<string, number> = {
      classic: 4.99,
      "whole-wheat": 5.49,
      sourdough: 5.99,
    }
    const CRUSTS: Record<string, number> = {
      crispy: 0,
      soft: 0,
      "extra-crispy": 0.5,
    }
    const FILLINGS: Record<string, number> = {
      butter: 0.5,
      cheese: 1.0,
      ham: 1.5,
      salami: 1.5,
      vegetables: 1.0,
      pesto: 1.25,
    }
    const DRINKS: Record<string, number> = {
      water: 2.0,
      cola: 2.5,
      lemonade: 2.5,
      "orange-juice": 3.0,
      coffee: 3.5,
      wine: 8.0,
    }
    const EXTRAS: Record<string, number> = {
      "butter-packet": 0.5,
      jam: 1.0,
      "cheese-plate": 4.0,
      charcuterie: 6.0,
      dessert: 3.5,
      napkins: 0,
    }

    total += BAGUETTE_TYPES[orderData.baguetteType] || 0
    total += CRUSTS[orderData.crust] || 0
    orderData.filling.forEach((id) => (total += FILLINGS[id] || 0))
    orderData.drinks.forEach((id) => (total += DRINKS[id] || 0))
    orderData.extras.forEach((id) => (total += EXTRAS[id] || 0))
    total += 2.0

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

      <Button
        className="w-full py-6 text-lg bg-primary hover:bg-accent text-primary-foreground font-bold"
        disabled={!cardNumber || !expiryDate || !cvv || !cardName}
      >
        Complete Payment
      </Button>
    </div>
  )
}
