"use client";

import type { OrderData, MenuItem, CartItem } from "../ordering-wizard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";

interface StepOneProps {
  orderData: OrderData;
  onUpdate: (updates: Partial<OrderData>) => void;
}

export function StepOne({ orderData, onUpdate }: StepOneProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    pb.get("menu_items", "category,variants,option_types,option_types.options")
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data.items || data.records || [];
        setItems(list);
        console.log(list)
      })
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectItem = (item: MenuItem | null) => {
    if (!item) return;
    setCurrentItem(item);
    const hasVariants = item.expand?.variants?.length;
    const hasOptions = item.expand?.option_types;
    if (hasVariants || hasOptions) {
      setModalOpen(true);
      return;
    }
  };

  const selectItemVariant = (variantId: string) => {
    if (!currentItem) return;
    const variant = currentItem.expand?.variants?.find((v: any) => v.id === variantId);
    if (variant) {
      variant.selected = true;
      setCurrentItem({ ...currentItem });
    }
  };

  const selectItemOption = (optionId: string) => {
    if (!currentItem) return;
    const option = currentItem.expand?.option_types?.flatMap((ot: any) => ot.expand?.options || []).find((o: any) => o.id === optionId);
    if (option) {
      option.selected = true;
      setCurrentItem({ ...currentItem });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
  };

  const toggleOption = (e: React.MouseEvent, optId: string) => {
    e.stopPropagation();
    
  };

  const handleAddItem = () => {
    if (!currentItem) return;

    var cartItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      price: currentItem.base_price ?? 0,
      name: currentItem.name,
      variant: undefined,
      options: []
    };

    // Apply variants to cart item
    if (currentItem.expand?.variants) {
      const selectedVariant = currentItem.expand.variants.find((v: any) => v.selected);
      cartItem.variant = selectedVariant;
    }

    if (currentItem.expand?.option_types) {
      let options: any[] = [];
      currentItem.expand.option_types.forEach((optionType: any) => {
        if (optionType.expand?.options) {
          optionType.expand.options.forEach((option: any) => {
            if(option.selected) {
              options.push(option);
            }
          });
        }
      });
      cartItem.options = options;
    }

    // Add to cart
    onUpdate({
      items: [...orderData.items, cartItem],
    });

    closeModal();
  };

  return (
    <div className="space-y-8">
      <div>
        {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {/* Group items by category */}
        {(() => {
          const categories: Record<string, MenuItem[]> = {};
          items.forEach((item) => {
            const cat = item.expand?.category?.name || "Uncategorised";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(item);
          });

          return (
            <div className="mb-8">
              {Object.entries(categories).map(([catName, catItems]) => {
                const catObj = catItems[0]?.expand?.category;
                if (catObj?.priority === 0) return null;
                return (
                  <div key={catName} className="mb-6">
                    <h3 className="text-lg font-bold mb-4">{catName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {catItems.map((item) => {
                        return (
                          <Card
                            key={item.id}
                            onClick={() => selectItem(item)}
                            className={`p-4 cursor-pointer transition-all border-2 border-border hover:border-primary/50 ${item.id === currentItem?.id ? "border-primary" : ""}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-lg text-foreground">{item.name}</h4>
                                {typeof item.base_price === "number" && item.base_price > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    £{Number(item.base_price).toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Modal */}
      {modalOpen && currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{currentItem.name}</h3>
              </div>
              <button aria-label="Close" onClick={closeModal} className="text-lg">
                ✕
              </button>
            </div>

            {/* variants (single select) */}
            {currentItem.expand?.variants?.length > 0 && (
              <div className="mb-4">
                <div className="space-y-2">
                  {currentItem.expand.variants.map((variant: any) => (
                    <label
                      key={variant.id}
                      onClick={() => selectItemVariant(variant.id)}
                    >
                      <div>
                        <div className="font-medium">{variant.display_name ?? variant.name}</div>
                        <div className="text-xs text-muted-foreground">£{Number(variant.base_price ?? 0).toFixed(2)}</div>
                      </div>
                      <input type="radio" checked={variant.selected} readOnly />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentItem.expand?.option_types?.length > 0 && (
              <div className="mb-4 space-y-4">
                {currentItem.expand.option_types.map((optionType: any) => (
                  <div key={optionType.id}>
                    <div className="font-semibold mb-2">{optionType.display_name ?? optionType.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {optionType.expand?.options?.map((option: any) => (
                        <label
                          key={option.id}
                          className={`flex items-center gap-2 px-3 py-2 border rounded cursor-pointer`}
                          onClick={e => selectItemOption(option.id)}
                        >
                          <input type="checkbox" checked={option.selected} readOnly />
                          <span>{option.display_name ?? option.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Button
                onClick={() => handleAddItem()}
                className="w-full bg-[#bb2f39] border-black border-2 hover:bg-primary/90 text-primary-foreground py-4"
              >
                Add to cart
              </Button>
            </div>

          </div> 
        </div>
      )}

      {/* small persistent checkout card */}
      <div className="bg-[#bb2f39]/5 p-4 rounded-lg border border-secondary">
        {currentItem && (
          <p className="text-3xl font-bold text-primary mb-4">
            £
            {currentItem.base_price?.toFixed(2) || "0.00"}
          </p>
          )}
        <Button
          onClick={() => {}}
          className="w-full bg-[#bb2f39] border-black border-2 hover:bg-primary/90 text-primary-foreground py-4"
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
