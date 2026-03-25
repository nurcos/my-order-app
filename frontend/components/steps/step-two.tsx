"use client"

import type { OrderData, MenuItem, CartItem} from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image";

interface StepTwoProps {
  orderData: OrderData
  menuItems: MenuItem[]
  addToCart: (item: CartItem) => void
  onUpdate: (updates: Partial<OrderData>) => void
}

export function StepTwo({ orderData, menuItems, addToCart, onUpdate }: StepTwoProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    (menuItems || []).forEach((m: MenuItem) => { map[m.id] = 1 });
    return map;
  });
  const [addingToCart, setAddingToCart] = useState(false);

  const setQty = (id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Math.floor(qty)) }));
  };

  const addItemToCart = (item: MenuItem, qty: number) => {
    if(!item) return;

    setAddingToCart(true);

    var cartItem: CartItem | null = null;

    for (let i = 0; i < qty; i++) {
      cartItem = {
        cart_id: Math.random().toString(36).substr(2, 9),
        id: item.id,
        name: item.name,
        variant: item.expand.variants[0],
        options: [],
        quantity: 1,
      };
      addToCart(cartItem);
    }

    // reset qty for item to 1
    setQty(item.id, 1);

    setTimeout(() => {
      setAddingToCart(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Select Drinks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            if (!item || !item.expand?.category || item.expand.category.priority > 0) return null;
            const inCart = orderData.cartItems?.some((d: any) => d.id === item.id) ?? false;
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
                    <p className="text-primary font-bold">£{Number(item.expand.variants?.[0]?.base_price ?? 0).toFixed(2)}</p>
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

                    <div className="flex gap-2 mt-3 relative">
                      {addingToCart && (
                        <Image
                          src={'/img/logo.png'}
                          alt={"logo"}
                          width={100}
                          height={100}
                          className="object-cover rounded-lg absolute left-1/2 transform -translate-x-1/2 opacity-50 animate-ping"
                        />
                      )}
                      <Button onClick={() => addItemToCart(item, qty)} className="bg-[#bb2f39] border-black border-2">
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
