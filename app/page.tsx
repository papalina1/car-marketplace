import { getUniqueBrands, getUniqueFuels, getModelsByBrand } from "@/lib/cars";
import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  const brands = getUniqueBrands();
  const fuels = getUniqueFuels();
  const modelsByBrand = getModelsByBrand();
  return <HomeClient brands={brands} fuels={fuels} modelsByBrand={modelsByBrand} />;
}