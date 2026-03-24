"use client"

import type { MenuItem, OrderData } from "../ordering-wizard"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api, pb } from "@/lib/pb"
import { useEffect, useRef } from "react"
import { toast } from 'react-toastify';


export function StepThree({ orderData, onUpdate, menuItems }: { orderData: OrderData; menuItems: MenuItem[]; onUpdate: (updates: Partial<OrderData>) => void; }) {

  const fetchedOrderRef = useRef(false);

  useEffect(() => {
    if (!orderData.id || fetchedOrderRef.current) return;
    fetchedOrderRef.current = true;
    pb.get("orders", orderData.id)
      .then((res) => {
        if (res && res[0]) {
          onUpdate({
            delivery_info: res[0].delivery_info,
          });
          console.log(res[0])
          checkPostCode(res[0].delivery_info.zipCode);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch order", err);
      });
  }, [orderData.id, onUpdate]);

  // call /api/distance with both postcodes (customer + restaurant) and update orderData
  async function checkPostCode(postCode: string): Promise<void> {
    onUpdate({ deliveryDistanceMiles: 0, deliveryCost: 0 });

    const postcodeRegex = /^(GIR0AA|[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2})$/i;

    // normalize customer postcode and validate
    let cleanedCustomer = postCode.trim().toUpperCase().replace(/\s+/g, "");
    if (!cleanedCustomer) return;
    if (!postcodeRegex.test(cleanedCustomer)) {
      console.warn("Invalid UK customer postcode:", postCode);
      return;
    }
    // format as "OUT IN"
    postCode = cleanedCustomer.slice(0, -3) + " " + cleanedCustomer.slice(-3);

    // if restaurant postcode exists, validate it too
    const restaurantRaw = (orderData?.restaurant?.postcode ?? "").trim();
    if (restaurantRaw) {
      const cleanedRestaurant = restaurantRaw.toUpperCase().replace(/\s+/g, "");
      if (!postcodeRegex.test(cleanedRestaurant)) {
        console.warn("Invalid UK restaurant postcode:", restaurantRaw);
        return;
      }
    }

    const customerPc = postCode.trim();
    const restaurantPc = (orderData?.restaurant?.postcode ?? "").trim();

    if (!customerPc || !restaurantPc) return;
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerPostcode: customerPc, restaurantPostcode: restaurantPc }),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error("There was an error fetching your delivery location. Please contact us!");
        return;
      }

      if (json.distanceMiles > 30) {
        toast.error("Sorry, we don't deliver to your area.");
        return;
      }

      // update orderData with distance and delivery cost
      onUpdate({
        deliveryDistanceMiles: json.distanceMiles,
        deliveryCost: json.deliveryCost,
      });
      try {
        if(!orderData.id) return;
        const res = await pb.update("orders", orderData.id, {
          delivery_price: json.deliveryCost,
        });
      } catch (e) {
        toast.error("There was an error updating your order. Please contact us!");
      }
    } catch (e) {
      toast.error("There was an error fetching your delivery location. Please contact us!");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
            <Input
              type="text"
              value={orderData.delivery_info.firstName}
              onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, firstName: e.target.value } })}
              placeholder="John"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
            <Input
              type="text"
              value={orderData.delivery_info.lastName}
              onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, lastName: e.target.value } })}
              placeholder="Doe"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
            <Input
              type="email"
              value={orderData.delivery_info.email}
              onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, email: e.target.value } })}
              placeholder="john@example.com"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
            <Input
              type="tel"
              value={orderData.delivery_info.phone}
              onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, phone: e.target.value } })}
              placeholder="+44 7123 456789"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Address Line 1 *</label>
            <Input
              type="text"
              value={orderData.delivery_info.address}
              onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, address: e.target.value } })}
              placeholder="123 Main Street"
              className="w-full"
            />
          </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address Line 2 *</label>
              <Input
                type="text"
                value={orderData.delivery_info.address2}
                onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, address2: e.target.value } })}
                placeholder="Building, floor, etc."
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address Line 3</label>
              <Input
                type="text"
                value={orderData.delivery_info.address3}
                onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, address3: e.target.value } })}
                placeholder=""
                className="w-full"
              />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City *</label>
              <Input
                type="text"
                value={orderData.delivery_info.city}
                onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, city: e.target.value } })}
                placeholder="Diss"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Post Code *</label>
              <Input
              type="text"
              value={orderData.delivery_info.zipCode}
              onChange={(e) => onUpdate({ delivery_info: { ...orderData.delivery_info, zipCode: e.target.value } })}
              onBlur={(e) => checkPostCode(e.target.value)}
              placeholder="IP25 1AA"
              className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Delivery Time *</label>
              <select
                value={orderData.deliveryTime}
                onChange={(e) => onUpdate({ deliveryTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="first">
                    {(() => {
                      const now = new Date();
                      now.setMinutes(now.getMinutes() + 45); // Add minimum 40 minutes
                      const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15; // Round up to the nearest 15 minutes
                      now.setMinutes(roundedMinutes, 0, 0); // Set the rounded minutes and reset seconds/milliseconds
                      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    })()}
                  </option>
                <option value="second">
                    {(() => {
                      const now = new Date();
                      now.setMinutes(now.getMinutes() + 45); // Add minimum 40 minutes
                      const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 30; // Round up to the nearest 30 minutes
                      now.setMinutes(roundedMinutes, 0, 0); // Set the rounded minutes and reset seconds/milliseconds
                      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    })()}
                  </option>
                <option value="third">
                    {(() => {
                      const now = new Date();
                      now.setMinutes(now.getMinutes() + 45); // Add minimum 40 minutes
                      const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 45; // Round up to the nearest 45 minutes
                      now.setMinutes(roundedMinutes, 0, 0); // Set the rounded minutes and reset seconds/milliseconds
                      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    })()}
                  </option>
                <option value="fourth">
                    {(() => {
                      const now = new Date();
                      now.setMinutes(now.getMinutes() + 45); // Add minimum 40 minutes
                      const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 60; // Round up to the nearest 60 minutes
                      now.setMinutes(roundedMinutes, 0, 0); // Set the rounded minutes and reset seconds/milliseconds
                      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    })()}
                  </option>
                
              </select>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-blue-50 p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          ℹ️ Your information is secure and will only be used for delivery purposes.
        </p>
      </Card>
    </div>
  )
}
