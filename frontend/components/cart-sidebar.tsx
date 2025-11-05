"use client"

import type { OrderData, FoodItem } from "./ordering-wizard"
import { Card } from "@/components/ui/card"

interface CartSidebarProps {
  orderData: OrderData
  removeItemFromOrder: (itemIndex: number) => void
}

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

export function CartSidebar({ removeItemFromOrder, orderData }: CartSidebarProps) {
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

  const isEmpty = orderData.items.length === 0 && orderData.drinks.length === 0 && orderData.extras.length === 0

  return (
    <div className="sticky top-8">
      <Card className="p-6 bg-primary/5 border-2 border-black bg-white">
        <h3 className="text-xl font-bold text-black mb-4">Your Cart</h3>

        {isEmpty ? (
          <p className="text-primary text-sm">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {/* Items */}
            {orderData.items.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-sm text-foreground">Items ({orderData.items.length})</p>
                {orderData.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="text-xs bg-white/50 p-2 rounded border border-primary/20 relative">
                      <p className="font-medium text-foreground">#{index + 1}</p>
                      <p>{item.name}</p>
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
                      <p className="font-semibold text-primary mt-1">£{calculateFoodItemPrice(item).toFixed(2)}</p>
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

            {/* Drinks */}
            {orderData.drinks.length > 0 && (
              <div className="space-y-2 border-t border-primary/20 pt-2">
                <p className="font-semibold text-sm text-foreground">Drinks</p>
                {orderData.drinks.map((drink) => (
                  <div key={drink.id} className="text-xs flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {drink.name} x{drink.quantity}
                    </span>
                    <span className="font-semibold text-primary">
                      £{((drink.price || 0) * drink.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Extras */}
            {orderData.extras.length > 0 && (
              <div className="space-y-2 border-t border-primary/20 pt-2">
                <p className="font-semibold text-sm text-foreground">Extras</p>
                {orderData.extras.map((extra) => (
                  <div key={extra.id} className="text-xs flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {extra.name} x{extra.quantity}
                    </span>
                    <span className="font-semibold text-primary">
                      £{((extra.price || 0) * extra.quantity).toFixed(2)}
                    </span>
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
