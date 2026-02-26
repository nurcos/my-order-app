"use client"

import type { OrderData, MenuItem, CartItem } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StepTwoProps {
  orderData: OrderData
  onUpdate: (updates: Partial<OrderData>) => void
}

export function StepTwo({ orderData, onUpdate }: StepTwoProps) {
  const menuItems = orderData.menuItems;
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);

  // NEW: quantity map for each item (default 1)
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    (menuItems || []).forEach((m: MenuItem) => { map[m.id] = 1 });
    return map;
  });

  const setQty = (id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(qty)) }));
  };

  const addItemToCart = (item: MenuItem, qty?: number) => {
    const quantity = qty ?? quantities[item.id] ?? 1;
    const unit_price = Number(item.base_price ?? 0);
    const line_total = unit_price * quantity;

    var cartItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      price: item.base_price ?? 0,
      name: item.name,
      variant: undefined,
      options: [],
      quantity: 1,
    };

    const current = Array.isArray(orderData.cartItems) ? [...orderData.cartItems] : [];

    // merge with existing same item (menu_item_id + no variant + no selections)
    const idx = current.findIndex(
      (ci: any) =>
        ci.menu_item_id === item.id &&
        (ci.variant_id === null || ci.variant_id === undefined) &&
        (!ci.selections || (Array.isArray(ci.selections) && ci.selections.length === 0))
    );


    current.push(cartItem);


    onUpdate({ cartItems: current });
    // reset qty for item to 1
    setQty(item.id, 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Select Drinks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            if (!item || !item.expand?.category || item.expand.category.priority > 0) return null;
            const inCart = orderData.cartItems?.some((d: any) => d.menu_item_id === item.id) ?? false;
            const qty = quantities[item.id] ?? 1;

            return (
              <Card
                key={item.id}
                className={`p-4 border-2 transition-all ${
                  inCart ? "border-[#bb2f39] bg-[#bb2f39]/5" : "border-border"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                    <p className="text-primary font-bold">£{Number(item.base_price ?? 0).toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQty(item.id, qty - 1)}
                        className="px-2 py-1 border rounded"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <input
                        value={qty}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setQty(item.id, Number.isNaN(v) ? 1 : v);
                        }}
                        className="w-12 text-center border rounded px-1 py-1"
                      />
                      <button
                        onClick={() => setQty(item.id, qty + 1)}
                        className="px-2 py-1 border rounded"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button onClick={() => addItemToCart(item)} className="bg-[#bb2f39] border-black border-2">
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
