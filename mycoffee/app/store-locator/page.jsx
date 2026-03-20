import { Suspense } from "react";
import "./storelocator.css";
import StoreLocator from "./storelocator";

export const metadata = {
  title: "Find a Store | Starbucks",
};

export default function Page() {
  return (
    <Suspense>
      <StoreLocator />
    </Suspense>
  );
}