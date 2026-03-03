"use client"

import type { OrderData, CartItem } from "../ordering-wizard"
import { Card } from "@/components/ui/card"

interface StepFourProps {
  orderData: OrderData
}

export function StepFour({ orderData }: StepFourProps) {

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Order Review</h2>

      {/* Food Section */}
      {orderData.cartItems.length > 0 && (
        <Card className="p-4 bg-[#bb2f39]/5 border border-secondary">
          <h3 className="font-bold text-lg text-foreground mb-3">Your Items ({orderData.cartItems.length})</h3>
          <div className="space-y-3">
            {orderData.cartItems.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center border-b border-border py-2 last:border-b-0">
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
                  <div className="font-bold text-primary pt-1 mt-1 text-right text-right">
                    £{item.price.toFixed(2)}
                  </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Delivery Info */}
      <Card className="p-4 bg-[#bb2f39]/5 border border-secondary">
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
      <Card className="gap-0 p-6 bg-primary/10 border-2 border-[#bb2f39]">
        <div className="flex justify-between items-center mb-2">
          <span>Subtotal</span>
          <span>£{orderData.subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex justify-between items-center border-b border-border">
          <span>Delivery Fee</span>
          <span>{orderData.deliveryCost ? `£${orderData.deliveryCost.toFixed(2)}` : "Free"}</span>
        </div>
        <div className="text-sm text-muted-foreground pb-4">
          Calculated from {Math.ceil(orderData.deliveryDistanceMiles)} mile(s)
        </div>
        <div className="flex justify-between items-center border-t-2 border-black pt-4">
          <span className="text-xl font-bold text-black">Total</span>
          <span className="text-3xl font-bold text-black">£{(orderData.subtotal + (orderData.deliveryCost || 0)).toFixed(2)}</span>
        </div>
      </Card>
    </div>
  )
}
