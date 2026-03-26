"use client";

import { getCartTotal, type OrderData } from "../ordering-wizard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { pb } from "@/lib/pb";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// inner form — must be inside <Elements>
function PaymentForm({ orderData, onUpdate, handleNext }: { orderData: OrderData; onUpdate: (updates: Partial<OrderData>) => void; handleNext: () => void; }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "google/apple">("card");

  const total = getCartTotal(orderData.cartItems) + Number(orderData.deliveryCost ?? 0);

  const handleCompleteOrder = async () => {
    if (!orderData.id) return;

    if (!stripe || !elements) {
      toast.error("Stripe not ready. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found.");
      return;
    }

    setLoading(true);
    try {
      // 1) call server complete route — validates store hours, computes prices, creates PaymentIntent
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderData.id,
          restaurant_id: orderData.restaurant.id,
          cart_items: orderData.cartItems,
          currency: "gbp",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? "Failed to create order. Please try again.");
        return;
      }

      // update orderData with server-computed totals
      onUpdate({
        paymentIntentId: data.paymentIntentId,
      });

      // 2) confirm card payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: orderData.delivery_info?.firstName + ' ' + orderData.delivery_info?.lastName,
              email: orderData.delivery_info?.email ?? undefined,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message ?? "Payment failed. Please try again.");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        onUpdate({ is_confirmed: true, paymentIntentId: paymentIntent.id });

        pb.update("orders", orderData.id, {
          is_confirmed: true,
        });

        handleNext();
      } else {
        toast.error("Payment not completed. Please try again.");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred: " + (err?.message ?? "unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Payment Information</h2>

        <Card className="p-6 bg-primary/10 border-2 border-[#bb2f39]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-black">Subtotal</span>
            <span className="font-semibold text-black">£{getCartTotal(orderData.cartItems).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-black">Delivery</span>
            <span className="font-semibold text-black">£{Number(orderData.deliveryCost ?? 0).toFixed(2)}</span>
          </div>
          <div className="border-t border-[#bb2f39] my-2" />
          <div className="flex justify-between items-center">
            <span className="text-black font-bold">Total</span>
            <span className="text-3xl font-bold text-black">£{(getCartTotal(orderData.cartItems) + Number(orderData.deliveryCost ?? 0)).toFixed(2)}</span>
          </div>
        </Card>

        <div className="flex justify-center space-x-4 mb-6 mt-6">
          <Button
            onClick={() => setPaymentMethod("card")}
            className={`px-4 py-2 font-bold ${
              paymentMethod === "card"
                ? "bg-primary text-primary-foreground border-2 border-[#bb2f39]"
                : "bg-primary text-primary-foreground"
            }`}
          >
            Card Payment
          </Button>
          <Button
            onClick={() => setPaymentMethod("google/apple")}
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
          <div className="space-y-6">
            <div className="border border-border rounded-md p-4 bg-white">
              <label className="block text-sm font-medium text-foreground mb-3">Card Details *</label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#bb2f39" },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>

            <Button
              onClick={handleCompleteOrder}
              disabled={loading || !stripe}
              className="w-full py-6 text-lg bg-[#bb2f39] border-black border-2 hover:bg-primary/90 text-primary-foreground font-bold"
            >
              {loading ? "Processing…" : `Pay £${total.toFixed(2)}`}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button
              className="bg-gray-200 text-white px-4 py-6 rounded-md border border-gray-900"
              onClick={handleCompleteOrder}
              disabled={loading}
            >
              <span className="sr-only">Pay with Google Pay</span>
              <img src="/img/google-pay-logo.png" alt="Google Pay" className="h-8" />
            </Button>
            <Button
              className="bg-gray-200 text-white px-4 py-6 rounded-md border border-gray-900"
              onClick={handleCompleteOrder}
              disabled={loading}
            >
              <span className="sr-only">Pay with Apple Pay</span>
              <img src="/img/apple-pay-logo.png" alt="Apple Pay" className="h-8" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// outer wrapper provides Stripe context
export function StepFive({ orderData, onUpdate, handleNext }: { orderData: OrderData; onUpdate: (updates: Partial<OrderData>) => void; handleNext: () => void; }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm orderData={orderData} onUpdate={onUpdate} handleNext={handleNext} />
    </Elements>
  );
}
