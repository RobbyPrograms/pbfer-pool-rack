-- PBFER catalog, orders, waitlist
-- RLS on every public table. Public can read active products only.
-- waitlist + orders are written by the service role from Next.js API routes.

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  price_cents int not null check (price_cents > 0),
  stripe_price_id text not null,
  description text,
  specs jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text unique not null,
  email text not null,
  product_id uuid references public.products(id),
  quantity int not null default 1 check (quantity > 0),
  amount_total_cents int not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'refunded')),
  shipping_address jsonb,
  created_at timestamptz default now()
);

create index orders_product_id_idx on public.orders (product_id);
create index orders_created_at_idx on public.orders (created_at desc);

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  spot_number int unique,
  created_at timestamptz default now()
);

create index waitlist_created_at_idx on public.waitlist (created_at desc);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.waitlist enable row level security;

create policy "Active products are readable"
  on public.products
  for select
  to anon, authenticated
  using (active = true);

revoke insert, update, delete on public.products from anon, authenticated;
revoke all on public.orders from anon, authenticated;
revoke all on public.waitlist from anon, authenticated;

insert into public.products (
  name,
  slug,
  price_cents,
  stripe_price_id,
  description,
  specs,
  active
) values (
  'The Rack',
  'the-rack',
  18900,
  'price_replace_me',
  'Machined 6061-T6 triangular pool rack. 0.2 mm corner tolerance.',
  '{"tolerance":"0.2mm","alloy":"6061-T6","weight":"312g","bevel":"15deg"}'::jsonb,
  true
);
