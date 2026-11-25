# SabziMate™ (by Guruprasad Enterprises) — Website, Database, Deployment & Costing Plan

Refer to the interactive storefront in `src/` and this plan for complete production architecture, Supabase PostgreSQL SQL schema, deployment instructions, and INR costing breakdown.

## Quick Start (Local Preview)
```bash
npm install
npm run dev
```

## Database Tables (Supabase PostgreSQL - Mumbai `ap-south-1`)
1. `products` (31 pre-cut vegetables & ready mixes, Marathi + English names, `cut_options`, daily `current_price_inr`)
2. `delivery_zones` (`nerul`, `belapur-ulwe`, `other-navi-mumbai`, `pickup`)
3. `customers` (Name, 10-digit WhatsApp phone, saved address)
4. `harvest_batches` (Controls 1-day-prior cutoff before 5:00 AM mandi procurement)
5. `orders` & `order_items` (Stores snapshot pricing at order time + cut preferences)

## Monthly Cost Summary
- **Starter Launch**: **₹0/month hosting & DB** (Cloudflare Pages/Vercel + Supabase Free Tier) + ~₹650/yr `.in` domain + ₹0 Click-to-WhatsApp ordering.
- **Growth Phase**: ₹2,500–₹5,500/month when adding automated WhatsApp Cloud API notifications and scaling database usage.
