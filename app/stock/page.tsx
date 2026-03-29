import { getAllCars } from "@/lib/cars";
import StockClient from "@/components/StockClient";

export default function StockPage() {
  const cars = getAllCars();
  return <StockClient allCars={cars} />;
}