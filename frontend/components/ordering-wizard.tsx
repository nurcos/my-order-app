"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StepOne } from "./steps/step-one"
import { StepTwo } from "./steps/step-two"
import { StepThree } from "./steps/step-three"
import { StepFour } from "./steps/step-four"
import { StepFive } from "./steps/step-five"
import { StepSix } from "./steps/step-six"
import { CartSidebar } from "./cart-sidebar"
import Image from "next/image"

export interface FoodItem {
  id: string
  name: string
  options: Record<string, any>
  price: number
}

export interface DrinkItem {
  id: string
  drinkId: string
  quantity: number
}

export interface ExtraItem {
  id: string
  name?: string
  extraId: string
  quantity: number
  price?: number
}

export interface OrderData {
  // Step 1: Multiple items
  items: FoodItem[]

  // Step 2: Drinks & Extras with quantities
  drinks: DrinkItem[]
  extras: ExtraItem[]

  // Step 3: Customer & Delivery info
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  deliveryTime: string

  // Pricing
  total: number
}

const STEPS = [
  { number: 1, title: "Food" },
  { number: 2, title: "Drinks" },
  { number: 3, title: "Details" },
  { number: 4, title: "Review" },
  { number: 5, title: "Payment" },
]

interface OrderingWizardProps {
  selectedRestaurant?: string | null
}

export function OrderingWizard({ selectedRestaurant }: OrderingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState<OrderData>({
    items: [],
    drinks: [],
    extras: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryTime: "asap",
    total: 0,
  })

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleUpdateOrder = (updates: Partial<OrderData>) => {
    setOrderData((prev) => ({ ...prev, ...updates }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne orderData={orderData} onUpdate={handleUpdateOrder} />
      case 2:
        return <StepTwo orderData={orderData} onUpdate={handleUpdateOrder} />
      case 3:
        return <StepThree orderData={orderData} onUpdate={handleUpdateOrder} />
      case 4:
        return <StepFour orderData={orderData} />
      case 5:
        return <StepFive orderData={orderData} />
      case 6:
        return <StepSix orderData={orderData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="text-center mb-12">
              <Image
                src="/img/logo.png"
                alt="MyOrder App"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
              {selectedRestaurant && (
                <p className="text-muted-foreground text-lg">
                  Ordering from: <span className="font-semibold text-primary">{selectedRestaurant}</span>
                </p>
              )}
              <p className="text-muted-foreground text-lg">Strapline here</p>
            </div>

            {/* Progress Steps */}
            {currentStep !== 6 && (
              <div className="mb-12">
                <div className="flex justify-between items-center">
                  {STEPS.map((step) => (
                    <div key={step.number} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          step.number <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.number}
                      </div>
                      <p className="text-xs sm:text-sm text-center mt-2 text-muted-foreground">{step.title}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step Content */}
            <Card className="p-8 mb-8 shadow-lg">{renderStep()}</Card>

            {/* Navigation Buttons */}
            {currentStep !== 6 && (
              <div className="flex justify-between gap-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="px-8 bg-transparent"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 5}
                  className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Next →
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <CartSidebar orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  )
}
