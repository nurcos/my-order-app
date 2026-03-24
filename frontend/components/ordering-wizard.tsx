"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepOne } from "./steps/step-one";
import { StepTwo } from "./steps/step-two";
import { StepThree } from "./steps/step-three";
import { StepFour } from "./steps/step-four";
import { StepFive } from "./steps/step-five";
import { CartSidebar } from "./cart-sidebar";
import Image from "next/image";
import { OrderComplete } from "./steps/order-complete";
import { pb } from "@/lib/pb";
import { toast } from 'react-toastify';
import { sub } from "date-fns";

export interface Restaurant {
  id: string;
  name: string;
  strapline?: string;
  postcode: string;
  location: string;
  rating: number;
  delivery_time: string;
  min_order: number;
}

export interface CartItem {
  cart_id: string;
  id: string;
  name: string;
  variant?: any;
  options?: Record<string, any>;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  image?: string;
  options: Record<string, any>;
  type: number;
  base_price: number;
  expand: any;
  quantity?: number;
  variants: Array<any>;
}

export interface OrderData {
  id?: string;
  restaurant: Restaurant;

  // Step 1 & 2: Multiple items
  cartItems: CartItem[];

  // Step 3: Customer & Delivery info
  delivery_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    address2: string;
    address3: string;
    city: string;
    zipCode: string;
  };
  subtotal: number;
  deliveryTime: string;
  deliveryDistanceMiles: number;
  deliveryCost: number;
}

const STEPS = [
  { number: 1, title: "Food" },
  { number: 2, title: "Drinks" },
  { number: 3, title: "Details" },
  { number: 4, title: "Review" },
  { number: 5, title: "Payment" },
];

interface OrderingWizardProps {
  selectedRestaurant?: Restaurant | null;
  handleBack: () => void;
}

export function OrderingWizard({
  handleBack,
  selectedRestaurant,
}: OrderingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const [orderData, setOrderData] = useState<OrderData>({
    restaurant: selectedRestaurant ? selectedRestaurant : (null as any),
    cartItems: [],
    delivery_info: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      address2: "",
      address3: "",
      city: "",
      zipCode: "",
    },
    subtotal: 0,
    deliveryTime: "asap",
    deliveryDistanceMiles: 0,
    deliveryCost: 0,
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderInitialised = useRef(false);

  useEffect(() => {
    if (orderInitialised.current) return;
    orderInitialised.current = true;

    if (typeof window === "undefined") return;

    const order = localStorage.getItem("order");
    if (order) {
      try {
        const parsedOrder = JSON.parse(order);
        setOrderData((prev) => ({ ...prev, id: parsedOrder.id, cartItems: parsedOrder.cartItems ?? [], subtotal: parsedOrder.subtotal ?? 0 }));
      } catch (e) {
        localStorage.removeItem("order");
      }
      return;
    }

    // create a new order record with no data (empty object is fine)
    pb.post("orders", {})
      .then((res) => {
        localStorage.setItem("order", JSON.stringify({ id: res.id, cartItems: [], subtotal: 0 }));
        setOrderData((prev) => ({ ...prev, id: res.id }));
      })
      .catch((err) => {
        console.error("Error creating order:", err);
        toast.error("Error creating order");
      });
  }, []);

  useEffect(() => {
    pb.get("menu_items", "", "category,variants,option_types,option_types.options")
      .then((data: any) => {
        const list = Array.isArray(data)
          ? data
          : data.items || data.records || [];
        setMenuItems((prev) => [...prev, ...list]);
      })
      .catch((err: any) => setError(err.message))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addToCart = (item: CartItem) => { 
    if(!item || !orderData.id) return;

    const order_ids = [...(orderData?.cartItems || []).map((ci) => ci.variant.id), item.variant.id];

    pb.update("orders", orderData.id, {
      item_ids: JSON.stringify(order_ids),
    } ).then((res) => {
      setOrderData((prev) => ({
        ...prev,
        cartItems: [...prev.cartItems, item],
        subtotal: res.subtotal || 0
      }));
      localStorage.setItem("order", JSON.stringify({ id: orderData.id, cartItems: [...(orderData.cartItems || []), item], subtotal: res.subtotal || 0 }));
    }).catch((error) => {
      console.error("Error adding item to order:", error);
    });
  };

  const removeItemFromOrder = (item: CartItem, index: number) => {
    if(!item || !orderData.id) return;

    const order_ids = [...(orderData?.cartItems || []).map((ci) => ci.variant.id)];
    order_ids.splice(index, 1);

    pb.update("orders", orderData.id, {
      item_ids: JSON.stringify(order_ids),
    } ).then((res) => {
      setOrderData((prev) => ({
        ...prev,
        cartItems: prev.cartItems.filter((_, i) => i !== index),
        subtotal: res.subtotal || 0
      }));
      localStorage.setItem("order", JSON.stringify({ id: orderData.id, cartItems: orderData.cartItems.filter((_, i) => i !== index) }));
    }).catch((error) => {
      console.error("Error removing item from order:", error);
    });
  };

  const resetOrderData = () => {
    setOrderData((prev) => ({
      ...prev,
      items: [],
      total: 0,
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (currentStep === 3 ) {
      if(!orderData.id) return;
      pb.update("orders", orderData.id, {
        delivery_info: JSON.stringify(orderData.delivery_info),
      }).catch((error) => {
        console.error("Error adding item to order:", error);
      });
    }

    if (currentStep === 4) {
      console.log('now we update order delivery fee')
    }

    if (currentStep === 6) {
      // Finalize order here if needed
      resetOrderData();
      setCurrentStep(1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUpdateOrder = (updates: Partial<OrderData>) => {
    setOrderData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne orderData={orderData} menuItems={menuItems} addToCart={addToCart} onUpdate={handleUpdateOrder} />;
      case 2:
        return <StepTwo orderData={orderData} menuItems={menuItems} addToCart={addToCart} onUpdate={handleUpdateOrder} />;
      case 3:
        return <StepThree orderData={orderData} menuItems={menuItems} onUpdate={handleUpdateOrder} />;
      case 4:
        return <StepFour orderData={orderData} menuItems={menuItems} />;
      case 5:
        return <StepFive handleNext={handleNext} orderData={orderData} />;
      case 6:
        return <OrderComplete orderData={orderData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="text-center mb-12">
              <Image
                src="/img/new-logo.png"
                alt="MyOrder App"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              {selectedRestaurant && (
                <p className="text-white text-lg">
                  Ordering from:{" "}
                  <span className="font-semibold text-white">
                    {selectedRestaurant.name}
                  </span>
                </p>
              )}
              <p className="text-white text-lg">
                {selectedRestaurant?.strapline}
              </p>
            </div>

            {/* Progress Steps */}
            {currentStep !== 6 && (
              <div className="mb-12">
                <div className="flex justify-between items-center">
                  {STEPS.map((step) => (
                    <div
                      key={step.number}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          step.number <= currentStep
                            ? "bg-[#bb2f39] text-white"
                            : "bg-white text-muted-foreground"
                        }`}
                      >
                        {step.number}
                      </div>
                      <p className="text-xs sm:text-sm text-center mt-2 text-white">
                        {step.title}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#bb2f39] transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step Content */}
            <Card className="p-8 mb-8 shadow-lg">{renderStep()}</Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {currentStep !== 6 && (
                <Button
                  onClick={currentStep === 1 ? handleBack : handlePrevious}
                  disabled={currentStep === 1 && !handleBack}
                  variant="outline"
                  className="px-8 bg-transparent text-white"
                >
                  ← Back
                </Button>
              )}
              {currentStep < 5 && (
                <Button
                  onClick={handleNext}
                  disabled={
                    currentStep === 3 && orderData.deliveryDistanceMiles <= 0
                  }
                  className={`px-8 bg-white text-primary
                    ${
                      currentStep === 3 &&
                      orderData.delivery_info.firstName &&
                      orderData.delivery_info.lastName &&
                      orderData.delivery_info.email &&
                      orderData.delivery_info.phone &&
                      orderData.delivery_info.address &&
                      orderData.delivery_info.address2 &&
                      orderData.delivery_info.city &&
                      orderData.deliveryTime &&
                      orderData.deliveryDistanceMiles <= 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#bb2f39]/90"
                    }`}
                >
                  Next →
                </Button>
              )}
            </div>
          </div>

          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <CartSidebar
                removeItemFromOrder={removeItemFromOrder}
                orderData={orderData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
