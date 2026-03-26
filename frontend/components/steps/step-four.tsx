"use client"

import { getCartTotal, type MenuItem, type OrderData } from "../ordering-wizard"
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
              <div key={item.cart_id} className="flex justify-between items-center border-b border-border py-2 last:border-b-0">
                <div className="flex justify-between items-center gap-4">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground ml-2">
                    {item.quantity && item.quantity > 1 && <span className="mr-2">x{item.quantity}</span>}
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
                  </span>
                </div>
                  <div className="font-bold text-primary pt-1 mt-1 text-right text-right">
                    £{item.variant.base_price.toFixed(2)}
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
              {orderData.delivery_info.firstName} {orderData.delivery_info.lastName}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-semibold">
              {orderData.delivery_info.address}, {orderData.delivery_info.address2}, {orderData.delivery_info.address3}, {orderData.delivery_info.city} {orderData.delivery_info.postCode}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact</p>
            <p className="font-semibold">
              {orderData.delivery_info.email} • {orderData.delivery_info.phone}
            </p>
          </div>
        </div>
      </Card>

      {/* Total */}
      <Card className="gap-0 p-6 bg-primary/10 border-2 border-[#bb2f39]">
        <div className="flex justify-between items-center mb-2">
          <span>Subtotal</span>
          <span>£{getCartTotal(orderData.cartItems).toFixed(2)}</span>
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
          <span className="text-3xl font-bold text-black">£{(getCartTotal(orderData.cartItems) + (orderData.deliveryCost || 0)).toFixed(2)}</span>
        </div>
      </Card>
    </div>
  )
}
