"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import custom from "./pool rack with fishers cues.png";
import original from "./original-red.webp";
import personalized from "./Maverick on a green folding pool rack.png";
import styles from "./GallerySection.module.css";

const photos = [
  { image: custom, label: "Custom Branding - Fish’s Cues", alt: "Black folded TrueRack with a custom Fish’s Cues logo on blue pool table felt" },
  { image: original, label: "Original Branding / Red", alt: "Red BuiltTrue rack holding a full set of billiard balls on a blue pool table" },
  { image: personalized, label: "Personalized / Maverick", alt: "Green folding TrueRack personalized with the name Maverick" },
];

export function GallerySection() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);

  function openPhoto(index: number) {
    setSelected(index);
    dialog.current?.showModal();
  }

  return (
    <section id="gallery" aria-labelledby="gallery-title" className={styles.section}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <p className="kicker">The Built True Gallery</p>
          <h2 id="gallery-title" className="display">Built To Stand <span className={styles.accent}>Out.</span></h2>
          <p className={styles.subtitle}>From our signature branding to your own logo or name—find your inspiration.</p>
        </header>

        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <button key={photo.label} type="button" onClick={() => openPhoto(index)} className={`${styles.card} ${index === 0 ? styles.featured : ""}`} aria-label={`Enlarge photo: ${photo.label}`} aria-haspopup="dialog">
              <div className={styles.imageFrame}>
                <Image src={photo.image} alt={photo.alt} fill sizes={index === 0 ? "(min-width: 1280px) 720px, (min-width: 768px) 57vw, 100vw" : "(min-width: 1280px) 480px, (min-width: 768px) 38vw, 100vw"} className={`${styles.image} ${index === 2 ? styles.maverick : ""}`} />
              </div>
              <span className={styles.caption}>{photo.label}<span className={styles.arrow} aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>

        <div className={styles.customize}>
          <h3>Make It <span className={styles.accent}>Yours</span></h3>
          <p>Your colors. Your logo. Your True<span>Rack.</span></p>
          <Link href="/#shop-customize" onClick={() => window.dispatchEvent(new Event("select-truerack-custom"))} className={styles.cta}><span className={styles.ctaLabel}>Customize True<span className={styles.ctaRack}>Rack</span></span></Link>
        </div>
      </div>

      <dialog ref={dialog} className={styles.dialog} aria-label={photos[selected].label} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className={styles.dialogContent}>
          <button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label="Close enlarged photo" autoFocus>Close ×</button>
          <Image src={photos[selected].image} alt={photos[selected].alt} sizes="90vw" className={styles.enlarged} />
          <p>{photos[selected].label}</p>
        </div>
      </dialog>
    </section>
  );
}
