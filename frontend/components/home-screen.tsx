"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface HomeScreenProps {
  onStartOrder: () => void
}

export function HomeScreen({ onStartOrder }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="p-12 shadow-2xl border-0">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Image
                src="/img/logo.png"
                alt="Baguette"
                width={200}
                height={200}
                className="mx-auto"
              />
              <p className="text-xl text-primary/70">Authentic French Baguettes, Delivered to Your Door</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-3xl">⚡</div>
                <h3 className="font-semibold text-primary">Swift Delivery</h3>
                <p className="text-sm text-primary/70">30 minutes or less, guaranteed</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">🎨</div>
                <h3 className="font-semibold text-primary">Bespoke Selection</h3>
                <p className="text-sm text-primary/70">Customise your perfect baguette</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">✨</div>
                <h3 className="font-semibold text-primary">Simple checkout</h3>
                <p className="text-sm text-primary/70">No account required</p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={onStartOrder}
              className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all hover:shadow-lg"
            >
              Begin Your Order
            </Button>

            <p className="text-sm text-primary/60">
              No registration required • Secure checkout
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
