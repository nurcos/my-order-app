"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface HomeScreenProps {
  onStartOrder: () => void
}

export function HomeScreen({ onStartOrder }: HomeScreenProps) {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 shadow-2xl border-1 border-white bg-white text-primary">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Image
                src="/img/logo.png"
                alt="Baguette"
                width={120}
                height={120}
                className="mx-auto"
              />
              <div>
                <p className="text-xl">Traditional Taste</p>
                <p className="text-xl">Delivered to Your Door</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Image
                  src="/img/icons/bolt.png"
                  alt="Fast Delivery"
                  width={60}
                  height={60}
                  className="mx-auto"
                />
                <div>
                  <h3 className="font-semibold">Swift Delivery</h3>
                  <p className="text-sm">30 minutes or less, guaranteed</p>
                </div>
              </div>
              <div className="space-y-2">
                <Image
                  src="/img/icons/palette.png"
                  alt="Fast Delivery"
                  width={60}
                  height={60}
                  className="mx-auto"
                />
                <div>
                  <h3 className="font-semibold">Bespoke Selection</h3>
                  <p className="text-sm">Customise your perfect order</p>
                </div>
              </div>
              <div className="space-y-2">
                <Image
                  src="/img/icons/stars.png"
                  alt="Fast Delivery"
                  width={60}
                  height={60}
                  className="mx-auto"
                />
                <div>
                  <h3 className="font-semibold">Simple checkout</h3>
                  <p className="text-sm">No account required</p>
                </div>
              </div>
            </div>

            <Button
              onClick={onStartOrder}
              className="w-full py-8 text-xl font-bold bg-[#bb2f39] text-white border border-black border-2 rounded-lg transition-all hover:shadow-lg"
            >
              Begin Your Order
            </Button>

            <p className="text-sm">
              No registration required • Secure checkout
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
