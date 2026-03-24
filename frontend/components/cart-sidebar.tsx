"use client"

import type { OrderData, CartItem } from "./ordering-wizard"
import { getCartTotal } from "./ordering-wizard"

import { Card } from "@/components/ui/card"

interface CartSidebarProps {
  orderData: OrderData
  removeItemFromOrder: (item: CartItem, index: number) => void
}

export function CartSidebar({ removeItemFromOrder, orderData }: CartSidebarProps) {
  const isEmpty = orderData.cartItems.length === 0

  return (
    <div className="sticky top-8">
      <Card className="p-6 bg-primary/5 border-2 border-black bg-white">
        <h3 className="text-xl font-bold text-black mb-4">Your Cart</h3>

        {isEmpty ? (
          <p className="text-primary text-sm">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {/* Items */}
            {orderData.cartItems.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-sm text-foreground">Items ({orderData.cartItems.length})</p>
                {orderData.cartItems.map((item, index) => (
                    <div key={`${item.cart_id}-${index}`} className="text-xs bg-white/50 p-2 rounded border border-primary/20 relative">
                      <p>{item.name}</p>
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
                      <p className="font-semibold text-primary mt-1">£{item.variant.base_price.toFixed(2)}</p>
                        <button
                          className="absolute top-0 right-2 text-xl text-red-500 hover:underline"
                          onClick={() => {
                            removeItemFromOrder(item, index)
                          }}
                        >
                          ×
                        </button>
                    </div>
                ))}
              </div>
            )}

            {/* Delivery Fee */}
            {/* {orderData.items.length > 0 && (
              <div className="border-t border-primary/20 pt-2 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-semibold text-primary">£2.00</span>
              </div>
            )} */}

            {/* Total */}
            <div className="border-t-2 border-primary pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Subtotal</span>
                <span className="text-2xl font-bold text-primary">£{getCartTotal(orderData.cartItems).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
