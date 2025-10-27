"use client"

import type { OrderData } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface StepThreeProps {
  orderData: OrderData
  onUpdate: (updates: Partial<OrderData>) => void
}

export function StepThree({ orderData, onUpdate }: StepThreeProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
            <Input
              type="text"
              value={orderData.firstName}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              placeholder="John"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
            <Input
              type="text"
              value={orderData.lastName}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
              placeholder="Doe"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
            <Input
              type="email"
              value={orderData.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="john@example.com"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
            <Input
              type="tel"
              value={orderData.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Street Address *</label>
            <Input
              type="text"
              value={orderData.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="123 Main Street"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City *</label>
              <Input
                type="text"
                value={orderData.city}
                onChange={(e) => onUpdate({ city: e.target.value })}
                placeholder="Paris"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Zip Code *</label>
              <Input
                type="text"
                value={orderData.zipCode}
                onChange={(e) => onUpdate({ zipCode: e.target.value })}
                placeholder="75001"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Delivery Time *</label>
              <select
                value={orderData.deliveryTime}
                onChange={(e) => onUpdate({ deliveryTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="asap">ASAP (30 min)</option>
                <option value="1hour">1 Hour</option>
                <option value="2hours">2 Hours</option>
                <option value="3hours">3 Hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-blue-50 p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          ℹ️ Your information is secure and will only be used for delivery purposes.
        </p>
      </Card>
    </div>
  )
}
