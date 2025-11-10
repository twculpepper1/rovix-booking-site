
# Rovix — Booking Site (Next.js)

A ready-to-deploy booking/quote site for your camper rental business.

## Quick start

```bash
npm i
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel

1. Create a GitHub repo and push this folder.
2. Import the repo in https://vercel.com/new
3. Build settings: default Next.js.
4. Add your custom domain (e.g., rovix.co) in Vercel.

## Hook up payments + forms (fastest path)

- Replace the **Pay Deposit** button in `app/page.tsx` with a Stripe Payment Link URL.
- Replace the `mailto:` in `mailtoHref()` with a link to a form (Tally/Typeform) or a Next.js API route that saves to Google Sheets/Airtable and triggers automations (Zapier/Make).

## Change rates

Edit the `RATES` object in `app/page.tsx` — all math updates automatically.
