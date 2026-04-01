import { getUniqueBrands, getUniqueFuels, getModelsByBrand, getAllCars } from "@/lib/cars";
import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  const brands = getUniqueBrands();
  const fuels = getUniqueFuels();
  const modelsByBrand = getModelsByBrand();
  const totalCars = getAllCars().length;
  return <HomeClient brands={brands} fuels={fuels} modelsByBrand={modelsByBrand} totalCars={totalCars} />;
}