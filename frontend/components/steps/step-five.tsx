"use client";

import type { OrderData, CartItem } from "../ordering-wizard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StepFiveProps {
  orderData: OrderData;
  handleNext: () => void;
}

export function StepFive({ handleNext, orderData }: StepFiveProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "google/apple">(
    "card"
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Payment Information
        </h2>

        <Card className="p-6 bg-primary/10 border-2 border-[#bb2f39]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-black">Order Total</span>
            <span className="text-3xl font-bold text-black">
              £{(orderData.subtotal + (orderData.deliveryCost || 0)).toFixed(2)}
            </span>
          </div>
        </Card>

        <div className="flex justify-center space-x-4 mb-6 mt-6">
            <Button
            onClick={() => {
              setPaymentMethod("card");
            }}
            className={`px-4 py-2 font-bold ${
              paymentMethod === "card"
              ? "bg-primary text-primary-foreground border-2 border-[#bb2f39]"
              : "bg-primary text-primary-foreground"
            }`}
            >
            Card Payment
            </Button>
          <Button
            onClick={() => {
              setPaymentMethod("google/apple");
            }}
            className={`px-4 py-2 font-bold ${
              paymentMethod === "google/apple"
              ? "bg-primary text-primary-foreground border-2 border-[#bb2f39]"
              : "bg-primary text-primary-foreground"
            }`}
          >
            Google/Apple Pay
          </Button>
        </div>

        {paymentMethod === "card" ? (
          <div className="space-y-4">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Cardholder Name *
              </label>
              <Input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Number *
              </label>
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\s/g, "").slice(0, 16))
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expiry Date *
                </label>
                <Input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value.slice(0, 5))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  CVV *
                </label>
                <Input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                  placeholder="123"
                  maxLength={3}
                  className="w-full font-mono"
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              className="w-full py-6 text-lg bg-primary hover:bg-accent text-primary-foreground font-bold mt-4"
            >
              Complete Payment
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Button className="bg-gray-200 text-white px-4 py-6 rounded-md border border-gray-900" onClick={handleNext}>
                <span className="sr-only">Pay with Google Pay</span>
                <img
                  src="/img/google-pay-logo.png"
                  alt="Google Pay"
                  className="h-8"
                />
              </Button>
              <Button className="bg-gray-200 text-white px-4 py-6 rounded-md border border-gray-900" onClick={handleNext}>
                <span className="sr-only">Pay with Apple Pay</span>
                <img
                  src="/img/apple-pay-logo.png"
                  alt="Apple Pay"
                  className="h-8"
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
