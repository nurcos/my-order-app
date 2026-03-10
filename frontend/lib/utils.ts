import { Restaurant } from '@/components/ordering-wizard'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClosingTime(restaurant: Restaurant) {
  const currentDay = new Date().getDay()
  const openHours = (restaurant as any)?.expand?.open_hours_via_store

  if (!openHours || openHours.length === 0) {
    return new Date();
  }

  const currentActiveHours = openHours.find((item: any) => item.day === currentDay)

  if (!currentActiveHours) {
    return new Date();
  }

  const closingTime = new Date(currentActiveHours.end)

  return closingTime;
}

export function getOpeningTime(restaurant: Restaurant) {
  const now = new Date()
  const openHours = (restaurant as any)?.expand?.open_hours_via_store

  if (!openHours || openHours.length === 0) {
    return new Date();
  }

  var currentActiveHours = openHours.find((item: any) => item.day === now.getDay())

  while (!currentActiveHours) {
    now.setDate(now.getDate() + 1);
    currentActiveHours = openHours.find((item: any) => item.day === now.getDay());
  }

  //we need to get the next day if current hours are after closing
  if (now.getHours() >= currentActiveHours.end) {
    now.setDate(now.getDate() + 1);
    currentActiveHours = openHours.find((item: any) => item.day === now.getDay());
    while (!currentActiveHours) {
      now.setDate(now.getDate() + 1);
      currentActiveHours = openHours.find((item: any) => item.day === now.getDay());
    }
  }

  const openingTime = new Date(currentActiveHours.start)

  return openingTime;
}

export function isOpen(restaurant: Restaurant) {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const open = getOpeningTime(restaurant)
  const close = getClosingTime(restaurant)
  const openMinutes = open.getHours() * 60 + open.getMinutes()
  const closeMinutes = close.getHours() * 60 + close.getMinutes()

  // if closing is after opening on the same day
  if (openMinutes < closeMinutes) {
    if (nowMinutes > openMinutes && nowMinutes < closeMinutes) {
      return true
    }
  } else {
    // spans midnight (closing is on the next day)
    if (nowMinutes > openMinutes || nowMinutes < closeMinutes) {
      return true
    }
  }

  return false;
}