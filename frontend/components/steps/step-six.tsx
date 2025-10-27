"use client"

import type { OrderData } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StepSixProps {
  orderData: OrderData
}

export function StepSix({ orderData }: StepSixProps) {
  return (
    <div className="text-center space-y-8">
      <div className="text-6xl mb-4">✅</div>

      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h2>
        <p className="text-lg text-muted-foreground">Thank you for your order, {orderData.firstName}!</p>
      </div>

      <Card className="p-6 bg-secondary/20 border border-secondary text-left">
        <h3 className="font-bold text-lg text-foreground mb-4">Order Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Number:</span>
            <span className="font-mono font-bold">#BAG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Address:</span>
            <span className="font-semibold">
              {orderData.address}, {orderData.city}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Delivery:</span>
            <span className="font-semibold">
              {orderData.deliveryTime === "asap" ? "30 minutes" : orderData.deliveryTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contact:</span>
            <span className="font-semibold">{orderData.phone}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          📧 A confirmation email has been sent to <span className="font-semibold">{orderData.email}</span>
        </p>
      </Card>

      <div className="space-y-3">
        <p className="text-muted-foreground">Your fresh baguette is being prepared and will be delivered soon!</p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full py-6 text-lg bg-primary hover:bg-accent text-primary-foreground font-bold"
        >
          Place Another Order
        </Button>
      </div>
    </div>
  )
}
