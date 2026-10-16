"use client";

import ProductSpinCanvas from "./ProductSpinCanvas";

type HeroCanvasProps = {
  allowDrag: boolean;
  autoRotate: boolean;
};

export default function HeroCanvas({ autoRotate }: HeroCanvasProps) {
  return <ProductSpinCanvas interactive autoRotate={autoRotate} />;
}
