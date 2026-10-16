"use client";

import ProductSpinCanvas from "./ProductSpinCanvas";

type ExplodedCanvasProps = {
  autoRotate: boolean;
};

export default function ExplodedCanvas({ autoRotate }: ExplodedCanvasProps) {
  return <ProductSpinCanvas autoRotate={autoRotate} />;
}
