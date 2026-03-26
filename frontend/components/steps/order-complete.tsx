"use client"

import { getCartTotal, type OrderData } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { get } from "http"

interface StepSixProps {
  orderData: OrderData
  handleNext: () => void
}

export function OrderComplete({ orderData, handleNext }: StepSixProps) {
  useEffect(() => {
    localStorage.removeItem("order");
  }, [orderData]);

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Order Confirmed</h2>
        <p className="text-lg text-muted-foreground">Thank you for your order, {orderData.delivery_info?.firstName}!</p>
      </div>

      <Card className="p-6 bg-[#bb2f39]/5 border-[#bb2f39] text-left">
        <h3 className="font-bold text-lg text-foreground mb-4">Order ID: <span className="uppercase">{orderData.id}</span></h3>
        <p className="font-semibold text-foreground">Items ({orderData.cartItems.length})</p>
        <ul className="text-muted-foreground space-y-1">
            {orderData.cartItems.length > 0 && (
              <li className="space-y-2">
                {orderData.cartItems.map((item, index) => (
                    <div key={`${item.cart_id}-${index}`} className="flex items-center justify-between gap-4 text-sm bg-white/50 p-2 rounded border border-primary/20 relative">
                      <div className="flex gap-4 items-center">
                        <p>{item.name}</p>
                        <div>
                          {item.options && item.options.length > 0 && (
                            <>
                            {item.options.map((optionType: any) => (
                              <p className="text-muted-foreground" key={optionType.id}>
                                {optionType.name}:
                                {optionType.options.map((option: any, dataIndex: number) => (
                                  <span className="text-muted-foreground ml-1" key={dataIndex}>
                                    {option ? option.name : "None"}
                                  </span>
                                ))}
                              </p>
                            ))}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="font-bold">£{item.variant.base_price.toFixed(2)}</div>
                    </div>
                ))}
              </li>
            )}
        </ul>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold">£{getCartTotal(orderData.cartItems).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery:</span>
            <span className="font-semibold">£{orderData.deliveryCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total:</span>
            <span className="font-bold">£{(getCartTotal(orderData.cartItems) + orderData.deliveryCost).toFixed(2)}</span>
          </div>
        </div>

        <hr className="my-4 border-t border-primary/10" />
        
        <p className="font-semibold text-foreground">Your Delivery Info:</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-semibold">{orderData.delivery_info?.firstName} {orderData.delivery_info?.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Address:</span>
            <span className="font-semibold">
              {orderData.delivery_info?.address}, {orderData.delivery_info?.postCode}
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
            <span className="font-semibold">{orderData.delivery_info?.phone}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          📧 A confirmation email has been sent to <span className="font-semibold">{orderData.delivery_info?.email}.</span>
        </p>
        <p className="text-sm text-blue-900"><a className="font-semibold underline" href={`mailto:${orderData.delivery_info?.email}`}>Let us know</a> if you don't receive it within the next few minutes!</p>
      </Card>

      <div className="space-y-3">
        <p className="text-muted-foreground">Your order is being prepared and will be delivered soon!</p>
        <Button
          onClick={() => handleNext()}
          className="w-full py-6 text-lg bg-[#bb2f39] text-white border-black border-2 font-bold"
        >
          Place Another Order
        </Button>
      </div>
    </div>
  )
}
