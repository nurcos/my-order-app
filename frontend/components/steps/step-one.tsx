"use client";

import type { OrderData, MenuItem, CartItem } from "../ordering-wizard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";


export function StepOne({ orderData, menuItems, addToCart, onUpdate }: { orderData: OrderData; menuItems: MenuItem[]; addToCart: (items: Array<CartItem>) => void; onUpdate: (updates: Partial<OrderData>) => void; }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const selectItem = (item: MenuItem | null) => {
    if (!item) return;
    setCurrentItem(item);
    const hasVariants = item.expand?.variants?.length;
    const hasOptions = item.expand?.option_types;
    if (hasVariants || hasOptions) {
      if (hasOptions) {
        const optionsArray = item.expand.option_types.map(
          (optionType: any) => ({
            id: optionType.id,
            name: optionType.name,
            options: [],
          }),
        );
        setSelectedOptions(optionsArray);
      }

      if(item.expand?.variants?.length === 1) {
        setCurrentItem(item);
        setSelectedVariant(item.expand.variants[0]);
        return;
      }
      setModalOpen(true);
      return;
    }
  };

  const selectItemVariant = (variantId: string) => {
    if (!currentItem) return;
    const variant = currentItem.expand?.variants?.find(
      (v: any) => v.id === variantId,
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const selectItemOption = (optionType: any, option: any) => {
    var newOption = {
      id: option.id,
      name: option.name,
      price: option.price,
    };

    var currentOptionType = selectedOptions.find((o) => o.id === optionType.id);

    var hasOption = currentOptionType?.options.find(
      (o: any) => o.id === option.id,
    );

    if (!hasOption) {
      currentOptionType.options.push(newOption);
    } else {
      currentOptionType.options = currentOptionType.options.filter(
        (o: any) => o.id !== option.id,
      );
    }

    setSelectedOptions(
      selectedOptions.map((o) =>
        o.id === optionType.id ? currentOptionType : o,
      ),
    );
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
    setSelectedVariant(null);
    setSelectedOptions([]);
  };

  const handleAddItem = () => {
    if (!currentItem) return;

    setAddingToCart(true);

    var cartItem: CartItem = {
      cart_id: Math.random().toString(36).substr(2, 9),
      id: currentItem.id,
      name: currentItem.name,
      variant: selectedVariant,
      options: [],
      quantity: 1,
    };

    // Apply variants to cart item
    if (currentItem.expand?.variants) {
      cartItem.variant.price = selectedVariant?.base_price ?? 0;
      cartItem.variant = selectedVariant;
    }

    cartItem.options = selectedOptions;

    addToCart([cartItem]);
    closeModal();
    setTimeout(() => {
      setAddingToCart(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div>
        {loading && (
          <div className="text-sm text-muted-foreground">Loading…</div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {/* Group items by category */}
        {(() => {
          const categories: Record<string, MenuItem[]> = {};
          menuItems.forEach((item) => {
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
                            className={`p-0 cursor-pointer transition-all border-2 border-border hover:border-primary/50 ${
                              item.id === currentItem?.id
                                ? "border-primary"
                                : ""
                            }`}
                          >
                            <div className="flex flex-col justify-between items-start">
                              <Image
                                className="opacity-50 h-36 w-full object-cover"
                                src={item.image || "/img/food_ph.png"}
                                alt={item.name}
                                width={100}
                                height={100}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.png";
                                }}
                              />
                              <div className="p-4">
                                <h4 className="font-bold text-lg text-foreground">
                                  {item.name}
                                </h4>
                                {typeof item.base_price === "number" &&
                                  item.base_price > 0 && (
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
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{currentItem.name}</h3>
              </div>
              <button
                aria-label="Close"
                onClick={closeModal}
                className="text-lg"
              >
                ✕
              </button>
            </div>

            {/* variants (single select) */}
            {currentItem.expand?.variants?.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-4">
                  {currentItem.expand.variants.map((variant: any) => (
                    <label
                      key={variant.id}
                      className={`p-2 px-6 rounded-xl shadow-lg border border-muted text-center ${
                        selectedVariant?.id === variant.id
                          ? "border-2 border-primary"
                          : ""
                      }`}
                      onChange={() => selectItemVariant(variant.id)}
                    >
                      <div>
                        <div className="font-medium">
                          {variant.display_name ?? variant.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          £{Number(variant.base_price ?? 0).toFixed(2)}
                        </div>
                      </div>
                      <input
                        type="radio"
                        hidden
                        checked={selectedVariant?.id === variant.id}
                        readOnly
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentItem.expand?.option_types?.length > 0 && (
              <div className="mb-4 space-y-4">
                {currentItem.expand.option_types.map((optionType: any) => (
                  <div key={optionType.id}>
                    <div className="font-semibold mb-2">
                      {optionType.display_name ?? optionType.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {optionType.expand?.options?.map((option: any) => (
                        <label
                          key={option.id}
                          className={`px-3 py-2 flex items-center gap-2 border rounded-xl cursor-pointer ${
                            selectedOptions
                              .find((ot) => ot.id === optionType.id)
                              ?.options.some((o: any) => o.id === option.id)
                              ? "border-2 border-primary"
                              : ""
                          }`}
                          onChange={() => selectItemOption(optionType, option)}
                        >
                          <input
                            type="checkbox"
                            hidden
                            checked={selectedOptions
                              .find((ot) => ot.id === optionType.id)
                              ?.options.some((o: any) => o.id === option.id)}
                            readOnly
                          />
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
                disabled={
                  (currentItem.expand?.variants?.length > 0 &&
                    !selectedVariant) ||
                  (currentItem.expand?.option_types?.length > 0 &&
                    selectedOptions.every(
                      (ot) => !ot.options || ot.options.length === 0,
                    ))
                }
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#bb2f39]/5 p-4 rounded-lg border border-secondary relative">
        {addingToCart && (
          <Image
            src={'/img/logo.png'}
            alt={"logo"}
            width={100}
            height={100}
            className="object-cover rounded-lg absolute left-1/2 transform -translate-x-1/2 opacity-50 animate-ping"
          />
        )}
        {currentItem && (
          <p className="text-3xl font-bold text-primary mb-4">
            £{currentItem.expand.variants?.[0]?.base_price?.toFixed(2) || "0.00"}
          </p>
        )}
        <Button
          onClick={() => handleAddItem()}
          className="w-full bg-[#bb2f39] border-black border-2 hover:bg-primary/90 text-primary-foreground py-4"
          disabled={!currentItem}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
