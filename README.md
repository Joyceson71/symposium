# TECHNO KINGS 2K26

A premium, highly interactive ECE department symposium website built with Next.js, Framer Motion, and Three.js.

## Quick Setup Checklist
- [ ] Replace `/public/gpay-qr.png` with your GPay QR code
- [ ] Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` in `.env.local`
- [ ] Set `GOOGLE_PRIVATE_KEY` in `.env.local`
- [ ] Set `GOOGLE_SHEET_ID` in `.env.local`
- [ ] Update college name in `app/layout.tsx` metadata and `components/layout/Footer.tsx`
- [ ] Set registration fee in `components/register/Step3Payment.tsx`
- [ ] Update UPI ID string in `components/register/Step3Payment.tsx`
- [ ] Add social media links in `components/layout/Footer.tsx`
- [ ] Add contact email and phone in `components/layout/Footer.tsx`
- [ ] Add sponsor logos to `/public/sponsors/` and update `SponsorsSection.tsx`
- [ ] Update prize distribution amounts in `components/sections/PrizePoolSection.tsx`

## Google Cloud Setup (Step-by-step)
1. Navigate to [console.cloud.google.com](https://console.cloud.google.com) and create a New Project.
2. Go to **APIs & Services** → Enable APIs and Services → search for and enable **Google Sheets API**.
3. Go to **IAM & Admin** → **Service Accounts** → Create Service Account.
4. Go to the newly created service account's Keys tab → Add Key → Create New Key → Download JSON key.
5. Extract `client_email` and `private_key` from the downloaded JSON file and put them into your `.env.local` file:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID="your-sheet-id-here"
   ```
6. Create a new Google Sheet. Copy its ID from the URL bar (the long string between `/d/` and `/edit`).
7. Share the Google Sheet with the `client_email` address you copied earlier, granting it "Editor" role.

## Running the Application
```bash
npm install
npm run dev
```

## Technologies Used
- Next.js 14
- React Three Fiber / Drei / Postprocessing
- Framer Motion
- GSAP
- Lenis (Smooth Scroll)
- Tailwind CSS
- Zod & React Hook Form
