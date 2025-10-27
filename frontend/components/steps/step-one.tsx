"use client"

import type { OrderData, FoodItem } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StepOneProps {
  orderData: OrderData
  onUpdate: (updates: Partial<OrderData>) => void
}

const ITEMS = [
  {
    id: "classic",
    name: "Classic",
    price: 4.99,
    description: "Traditional French style",
    options: [
      {
        id: 'fillings',
        name: 'Fillings',
        data: [
          { id: "butter", name: "Butter", price: 0.5 },
          { id: "cheese", name: "Cheese", price: 1.0 },
          { id: "ham", name: "Ham", price: 1.5 },
          { id: "salami", name: "Salami", price: 1.5 },
          { id: "vegetables", name: "Vegetables", price: 1.0 },
          { id: "pesto", name: "Pesto", price: 1.25 },
        ]
      },
      {
        id: 'sauces',
        name: 'Sauces',
        data: [
          { id: "ketchup", name: "Ketchup", price: 0.2 },
          { id: "mustard", name: "Mustard", price: 0.2 },
          { id: "mayo", name: "Mayonnaise", price: 0.3 },
        ]
      }
    ],
  },
  {
    id: "whole-wheat",
    name: "Whole Wheat",
    price: 5.49,
    description: "Healthy whole wheat baguette",
    options: [
      {
        id: 'fillings',
        name: 'Fillings',
        data: [
          { id: "butter", name: "Butter", price: 0.5 },
          { id: "cheese", name: "Cheese", price: 1.0 },
          { id: "ham", name: "Ham", price: 1.5 },
          { id: "salami", name: "Salami", price: 1.5 },
          { id: "vegetables", name: "Vegetables", price: 1.0 },
          { id: "pesto", name: "Pesto", price: 1.25 },
        ]
      },
      {
        id: 'sauces',
        name: 'Sauces',
        data: [
          { id: "ketchup", name: "Ketchup", price: 0.2 },
          { id: "mustard", name: "Mustard", price: 0.2 },
          { id: "mayo", name: "Mayonnaise", price: 0.3 },
        ]
      }
    ],
  },
  {
    id: "sourdough",
    name: "Sourdough",
    price: 5.99,
    description: "Tangy sourdough flavor",
    options: [
      {
        id: 'fillings',
        name: 'Fillings',
        data: [
          { id: "butter", name: "Butter", price: 0.5 },
          { id: "cheese", name: "Cheese", price: 1.0 },
          { id: "ham", name: "Ham", price: 1.5 },
          { id: "salami", name: "Salami", price: 1.5 },
          { id: "vegetables", name: "Vegetables", price: 1.0 },
          { id: "pesto", name: "Pesto", price: 1.25 },
        ]
      },
      {
        id: 'sauces',
        name: 'Sauces',
        data: [
          { id: "ketchup", name: "Ketchup", price: 0.2 },
          { id: "mustard", name: "Mustard", price: 0.2 },
          { id: "mayo", name: "Mayonnaise", price: 0.3 },
        ]
      }
    ],
  },
]


export function StepOne({ orderData, onUpdate }: StepOneProps) {
  // track the currently selected item locally so calling handleSelectItem
  // programmatically will also update the UI
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null)

  const handleSelectItem = (itemId: string) => {
    const newItem: FoodItem = ITEMS.find((item) => item.id === itemId) as FoodItem
    // update local selection so UI reflects the change
    setCurrentItem(newItem)
    // also update parent order data if needed (this adds the item to items array)
    // onUpdate({ items: [...orderData.items, newItem] })
  }

  const handleAddItem = () => {
    if (currentItem) {
      onUpdate({ items: [...orderData.items, currentItem] })
    }
    // Reset the current selection after adding the item
    setCurrentItem(null)
  }

  const calculatePrice = () => {
    let price = 0

    return price.toFixed(2)
  }

  return (
    <div className="space-y-8">

      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Select Your Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ITEMS.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleSelectItem(item.id)}
              className={`p-4 cursor-pointer transition-all border-2 ${
              currentItem && currentItem.id === item.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
              }`}
            >
              <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              <p className="text-primary font-bold">£{item.price.toFixed(2)}</p>
            </Card>
          ))}
        </div>
      </div>

      {currentItem && currentItem.options.map((option: any) => (
        <div key={option.id}>
          <h3 className="text-xl font-bold text-foreground mb-4">{option.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {option.data.map((option: any) => (
              <Button
                key={option.id}
                // onClick={() => handleFillingToggle(option.id)}
                // variant={c.data.includes(option.id) ? "default" : "outline"}
                // className={`py-6 justify-start ${
                //   currentItem.options.filling.includes(option.id) ? "bg-accent text-accent-foreground" : ""
                // }`}
              >
                <input
                  type="checkbox"
                  // checked={currentItem.filling.includes(option.id)}
                  onChange={() => {}}
                  className="mr-3"
                />
                <span className="flex-1 text-left">{option.name}</span>
                {/* <span className="text-sm">+£{option.price.toFixed(2)}</span> */}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-secondary/30 p-4 rounded-lg border border-secondary">
        <p className="text-sm text-muted-foreground">Subtotal for this baguette:</p>
        <p className="text-3xl font-bold text-primary mb-4">£{calculatePrice()}</p>
        <Button
          onClick={handleAddItem}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
        >
          Add To Order
        </Button>
      </div>
    </div>
  )
}
