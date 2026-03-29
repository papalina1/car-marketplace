import { Suspense } from "react";
import { getAllCars } from "@/lib/cars";
import StockClient from "@/components/StockClient";

export default function StockPage() {
  const cars = getAllCars();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockClient allCars={cars} />
    </Suspense>
  );
}