"use client";

import Image from "next/image";
import { useState } from "react";
import type { ShopColor } from "@/lib/shop-colors";
import styles from "./ShopMedia.module.css";

export function ShopMedia({ color }: { color: ShopColor }) {
  const photos = color.photos.map((id, index) => ({ id, alt: `${color.placeholder ? "Placeholder" : color.name} TrueRack product view ${index + 1}` }));
  const [selected, setSelected] = useState(0);
  const photo = photos[selected];

  return (
    <div className={styles.media}>
      <div className={styles.thumbnails} role="group" aria-label="Product views">
        {photos.map((item, index) => <button key={item.id} type="button" onClick={() => setSelected(index)} aria-label={`Show photo: ${item.alt}`} aria-pressed={selected === index} className={styles.thumbnail}>
          <Image src={`/shop/rack-${item.id}.webp`} alt="" fill sizes="80px" className={styles.thumbImage} />
        </button>)}
      </div>
      <div id="shop-product-view" className={styles.viewer} role="region" aria-label="Selected product view">
        <Image src={`/shop/rack-${photo.id}.webp`} alt={photo.alt} width={2000} height={1334} sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw" className={styles.photo} />
      </div>
    </div>
  );
}
