/**
 * Creates a one-time Stripe Product + Price for The Rack.
 * Usage: node --env-file=.env.local scripts/seed-stripe.mjs
 */
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Missing STRIPE_SECRET_KEY");
  process.exit(1);
}

const stripe = new Stripe(key);
const product = await stripe.products.create({
  name: "The Rack",
  description:
    "Machined 6061-T6 triangular pool rack. 0.2 mm corner tolerance. Lifetime against warp.",
});
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 18900,
  currency: "usd",
});

console.log("Product:", product.id);
console.log("Price:  ", price.id);
console.log("\nAdd this to .env.local:\nSTRIPE_PRICE_ID=" + price.id);
