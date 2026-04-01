import fs from "fs";
import path from "path";

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  fuel: string;
  location: string;
  price: number;
  image: string;
  images: string[];
  link: string;
  scrapedAt: string;
 report?: {
    myCarAccident: { count: number; amount: string | null } | null;
    otherCarAccident: { count: number; amount: string | null } | null;
    totalLoss: boolean;
    totalLossAmount?: string | null;
    flood: boolean;
    floodAmount?: string | null;
    ownerChanges: number | null;
    reportUrl: string;
    sketchParts?: number;
    outsidePhotos?: string[];
    insidePhotos?: string[];
  } | null;
}

export function getAllCars(): Car[] {
  const filePath = path.join(process.cwd(), "cars.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Car[];
}

export function getCarById(id: string): Car | null {
  const cars = getAllCars();
  return cars.find((c) => c.id === id) || null;
}

export function getUniqueBrands(): string[] {
  const cars = getAllCars();
  const brands = cars.map((c) => c.brand).filter(Boolean);
  return Array.from(new Set(brands)).sort();
}

export function getUniqueFuels(): string[] {
  const cars = getAllCars();
  const fuels = cars.map((c) => c.fuel).filter(Boolean);
  return Array.from(new Set(fuels)).sort();
}

export function getModelsByBrand(): Record<string, string[]> {
  const cars = getAllCars();
  const map: Record<string, string[]> = {};
  for (const car of cars) {
    if (!car.brand || !car.model) continue;
    if (!map[car.brand]) map[car.brand] = [];
    if (!map[car.brand].includes(car.model)) {
      map[car.brand].push(car.model);
    }
  }
  for (const brand in map) {
    map[brand].sort();
  }
  
  return map;
  
}

