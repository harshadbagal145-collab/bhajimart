# SabziMate™ — Project Status & Antigravity Handoff Guide

> **For Antigravity / Next Developer Session:** Read this file first when opening this workspace. It contains the full project goal, business rules, what is already completed, what remains to be built, and how to continue seamlessly.

---

## 1. Project Goal
Build a modern, interactive customer website and lightweight operations backend for **SabziMate™** (*by Guruprasad Enterprises*), a hyperlocal **fresh, washed, peeled, and pre-cut vegetable service** in **Navi Mumbai**.

### Verified Business Details (Extracted from `@sabzimate` Instagram Posters)
- **Brand:** SabziMate™ by Guruprasad Enterprises
- **Tagline:** *Fresh. Pre-Cut. Ready to Cook.* (Marathi: *ताज्या भाज्या... आनंदी आयुष्य!*)
- **Location / Pickup Point:** Near Seawoods Railway Station East Entry, Nerul, Navi Mumbai
- **Timings:** Home Delivery `4:00 PM – 5:00 PM` | Self-Pickup `5:00 PM – 9:00 PM`
- **Ordering Rule:** **Order 1 Day Prior** (Vegetables are bought fresh every morning at 5:00 AM, then washed, cut, and delivered by evening).
- **WhatsApp Order Number:** `9653608300` (`+91 9653608300`)
- **Instagram:** `@sabzimate` (`https://www.instagram.com/sabzimate`)
- **Delivery Zone Rules:**
  - **Nerul & Seawoods:** Free delivery on orders above `₹199` (`₹30` fee below `₹199`)
  - **CBD Belapur & Ulwe:** Free delivery on orders above `₹299` (`₹40` fee below `₹299`)
  - **Other Navi Mumbai Areas:** Minimum order `₹399` + `₹50` delivery charge
  - **Self-Pickup (Seawoods Station East):** `₹0` delivery fee, no minimum order

---

## 2. Current Status: What Is Completed ✅

The **Phase 1 Interactive Frontend Prototype + Owner Admin Demo** is 100% built, **mobile-responsive across all phone viewports (320px+)**, verified with `npm run build` (`0` errors), `npm run lint` (`0` warnings/errors), and visually tested in a live browser.

### Completed Files & Features
| Area | File Path | What It Does |
| :--- | :--- | :--- |
| **App Shell & State** | `src/App.jsx` | Cart state, bilingual `EN / मराठी` toggle, live price updates from Owner Demo, `localStorage` demo order persistence |
| **31-Item Catalog** | `src/data/catalog.js` | All 31 exact items (#01 Beans to #31 Salad Mix) with exact weights, INR prices, Marathi names, prep styles, and cut options |
| **Delivery Rules** | `src/data/deliveryZones.js` | Navi Mumbai zone calculator (`calculateDeliverySummary`), 1-day-prior min date helper (`getTomorrowDateISO`) |
| **Bilingual Copy** | `src/data/translations.js` | English & Marathi UI copy, 4 value pillars, 3-step freshness story, and business contact constants |
| **Navigation** | `src/components/Navbar.jsx` | Sticky header, announcement bar, `EN / मराठी` switch, `Owner Demo` button, live Basket counter |
| **Hero & Pillars** | `src/components/HeroSection.jsx` | Editorial split hero, tomorrow-batch badge, 4 freshness pillars, uses `public/images/hero-sabzimate.jpg` |
| **Delivery Bar** | `src/components/DeliveryZoneBar.jsx` | Interactive area selector with live free-delivery progress bar |
| **Ready Mixes** | `src/components/CombosShowcase.jsx` | Highlights #28 Pulav, #29 Sambar, #30 Chinese, #31 Salad Mixes with one-click "Add All 4 Mixes (₹220)" |
| **Menu Grid** | `src/components/CatalogSection.jsx` | Category tabs, instant search (EN/MR/#), quick filters (`Bestsellers`, `₹35 & Under`), cut-style dropdown, `+ Add` / stepper |
| **How It Works & Contact** | `src/components/HowItWorksSection.jsx` | 3-step morning harvest story, Seawoods Station East location & timings, direct WhatsApp/Call/Instagram links |
| **Cart & Checkout** | `src/components/CartDrawer.jsx` | Slide-over basket, area/slot/date picker, customer form, order confirmation receipt, and pre-filled WhatsApp checkout (`wa.me/919653608300`) |
| **Owner Admin Demo** | `src/components/AdminDemoPanel.jsx` | Demo modal showing Incoming Orders, auto-aggregated **5 AM Mandi Purchase List**, and **Live Daily Price Editor** |
| **Generated Assets** | `public/images/` | `hero-sabzimate.jpg` and `combos-prep.jpg` |
| **Architecture Plan** | `PLAN_DATABASE_DEPLOYMENT_COSTING.md` | Summary of Supabase DB, deployment, and INR costing |

---

## 3. What Needs to Be Completed Next (Roadmap) 🚧

### Phase 2: Real Database & Owner Admin (Recommended Next Step)
1. **Connect Supabase (PostgreSQL — Mumbai `ap-south-1` region):**
   - Create Supabase project and add `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   - Run the PostgreSQL schema (see Section 5 below) to create `products`, `delivery_zones`, `customers`, `harvest_batches`, `orders`, `order_items`, and `price_history`.
   - Seed the 31 products from `src/data/catalog.js` into the `products` table.
2. **Replace Local Demo State with Live Supabase Queries:**
   - Fetch `catalog` from `products` table in `src/App.jsx`.
   - Save new orders from `CartDrawer.jsx` into `orders` + `order_items` (and upsert `customers` by phone).
   - Protect `AdminDemoPanel` behind **Supabase Auth** (email/password login for Guruprasad Enterprises) with Row-Level Security (RLS) so only authenticated admins can edit prices or view all customer orders.
   - Add a `harvest_batches` cutoff check (e.g., lock tomorrow's batch after 10:00 PM).

### Phase 3: Production Deployment & Growth Features
3. **Deploy Frontend:**
   - Push to GitHub and deploy on **Vercel** or **Cloudflare Pages** (₹0/month starter tier).
   - Connect custom domain (e.g., `sabzimate.in`).
4. **Optional Enhancements:**
   - **UPI / Razorpay Checkout** (or static UPI QR code in confirmation modal).
   - **Automated WhatsApp Confirmations** via Meta WhatsApp Cloud API / Interakt / AiSensy.
   - **Weekly Subscription Packs** (e.g., Mon–Fri daily veggie box).

---

## 4. How to Run After Unzipping at Home

```bash
# 1. Open terminal in the extracted sabzimate folder
npm install

# 2. Start local development server
npm run dev

# 3. Verify production build & lint
npm run build
npm run lint
```

---

## 5. Production Database Schema (Supabase PostgreSQL)

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  sr_no int not null unique,
  slug text not null unique,
  name_en text not null,
  name_mr text not null,
  subtitle_en text,
  subtitle_mr text,
  category text not null check (category in ('daily', 'leafy', 'prep', 'mixes')),
  pack_size text not null,
  current_price_inr int not null check (current_price_inr > 0),
  prep_style text,
  cut_options jsonb not null default '[]'::jsonb,
  is_available boolean not null default true,
  updated_at timestamptz not null default now()
);

create table delivery_zones (
  id text primary key,
  name_en text not null,
  name_mr text not null,
  min_order_inr int not null default 0,
  free_delivery_above_inr int,
  base_fee_inr int not null default 0
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null unique,
  default_zone_id text references delivery_zones(id),
  default_address text,
  created_at timestamptz not null default now()
);

create table harvest_batches (
  batch_date date primary key,
  cutoff_at timestamptz not null,
  status text not null default 'open'
    check (status in ('open', 'locked_for_mandi', 'cutting', 'completed'))
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_id uuid references customers(id),
  zone_id text not null references delivery_zones(id),
  batch_date date not null references harvest_batches(batch_date),
  delivery_slot text not null,
  delivery_address text not null,
  prep_note text,
  subtotal_inr int not null,
  delivery_fee_inr int not null,
  total_inr int not null,
  payment_mode text not null default 'UPI_ON_DELIVERY',
  payment_status text not null default 'pending',
  fulfillment_status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  product_name_snapshot text not null,
  pack_size_snapshot text not null,
  unit_price_snapshot_inr int not null,
  selected_cut_style text,
  quantity int not null check (quantity > 0)
);
```
