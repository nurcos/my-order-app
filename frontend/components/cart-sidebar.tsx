"use client"

import type { OrderData, CartItem } from "./ordering-wizard"
import { Card } from "@/components/ui/card"

interface CartSidebarProps {
  orderData: OrderData
  removeItemFromOrder: (itemIndex: number) => void
}

function calculateCartItemPrice(item: CartItem): number {
  let price = 0
  price += item.price as number;
  // item.options.forEach((option: any) => {
  //   price += option.price as number;
  // });
  return price
}

export function CartSidebar({ removeItemFromOrder, orderData }: CartSidebarProps) {
  const calculateTotal = () => {
    let total = 0

    // Items
    orderData.cartItems.forEach((item) => {
      total += calculateCartItemPrice(item)
    })

    // Delivery fee (only if there are items)
    // if (orderData.cartItems.length > 0) {
    //   total += 2.0
    // }

    return total
  }

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
                    <div key={`${item.id}-${index}`} className="text-xs bg-white/50 p-2 rounded border border-primary/20 relative">
                      <p className="font-medium text-foreground">#{index + 1}</p>
                      <p>{item.name}</p>
                      {item.options && item.options.length > 0 && (
                        <>
                        {item.options.map((option: any) => (
                          <p className="text-muted-foreground" key={option.id}>
                            {option.name}:
                              <span className="text-muted-foreground ml-1" key={index}>
                                {option.name}
                              </span>
                            {/* { option.data.length === 0 && <span className="text-muted-foreground ml-1">None</span> } */}
                          </p>
                        ))}
                        </>
                      )}
                      <p className="font-semibold text-primary mt-1">£{calculateCartItemPrice(item).toFixed(2)}</p>
                        <button
                          className="absolute top-0 right-2 text-xl text-red-500 hover:underline"
                          onClick={() => {
                            removeItemFromOrder(index)
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
                <span className="text-2xl font-bold text-primary">£{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
