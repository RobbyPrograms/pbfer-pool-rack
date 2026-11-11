import Image from "next/image";
import Link from "next/link";
import workshop from "@/components/about/Asset 64.png";
import mountains from "@/components/about/Asset 62.png";
import rack from "@/components/about/BuiltTrue black pool rack studio portrait.png";
import styles from "./AboutSection.module.css";

const story = [
  "I've always believed that if something is worth doing, it's worth doing right.",
  "Throughout my career as a designer, I've taken pride in the precision and quality of my work. I've never been comfortable cutting corners or settling for something I knew could be better.",
  "That mindset eventually cost me my job. I stood up for the standards I believed in, even when it would have been easier to stay quiet and do things differently.",
  "Rather than compromise those principles, I decided to build something of my own.",
  "That's how Built True began. A company built around a simple belief: quality shouldn't be something you compromise on.",
  "I'm starting small, designing and manufacturing products myself, but the standard remains the same. If I'm going to put my name on something, I'm going to do everything I can to make sure it's done right.",
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className={styles.page}>
      <div className={styles.content}>
        <section className={styles.introduction} aria-labelledby="about-title">
          <div className={styles.purpose}>
            <h2 id="about-title" className={styles.title}>Designing With Purpose</h2>
            <p className={styles.wordmark}>Built<span>True</span></p>
            <div className={styles.rule} />
            <p className={styles.tagline}>Products that solve real problems.<br />Nothing unnecessary.</p>
            <Image src={workshop} alt="The BuiltTrue founder designing TrueRack in his workshop" sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw" className={styles.workshop} />
          </div>
          <div className={styles.story}>
            <h2>The Story</h2>
            <div>{story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
        </section>

        <section className={styles.product} aria-labelledby="product-title">
          <div className={styles.productCopy}>
            <p className={styles.eyebrow}>Our first product</p>
            <h2 id="product-title">Meet True<span>Rack.</span></h2>
            <p>A precision-engineered foldable pool rack that makes racking easier, faster, and more consistent.</p>
            <p>Tested, refined, and built to perform.</p>
            <Link href="/#features" className={styles.button}><span className={styles.buttonLabel}>Explore True<span className={styles.buttonRack}>Rack</span></span></Link>
          </div>
          <Image src={rack} alt="Black BuiltTrue folding pool rack in a studio portrait" sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw" className={styles.rack} />
        </section>

        <section className={styles.road} aria-labelledby="road-title">
          <Image src={mountains} alt="" fill sizes="100vw" className={styles.mountains} />
          <div className={styles.roadCopy}>
            <p className={styles.eyebrow}>The road ahead</p>
            <h2 id="road-title">We&apos;re Just<br />Getting Started.</h2>
            <p>TrueRack is the beginning. Built True is about continuing to design products that solve everyday problems through precision and purposeful engineering.</p>
            <p>Same approach. New ideas. More to come.</p>
          </div>
          <footer className={styles.copyright}>© {new Date().getFullYear()} Built True.<br />All rights reserved.</footer>
        </section>
      </div>
    </section>
  );
}
