# King of the Court – Tournament App

A React + TypeScript web app to run a **King-of-the-Court style pickleball tournament** with up to **10 courts**.

## Features
- Add 12–40 players with DUPR ratings (4 per court × 10 courts)
- Automatic DUPR rating lookup by player name
- Courts seeded by rating
- Set entry fee (default $30)
- Automatic payout calculations with customizable % split
- Winner-up / loser-down rotation logic
- Avoids repeat partners as much as possible
- Standings tracked (points scored, points against, Ct1 finishes)
- CSV export of standings

## Getting Started
```bash
# install dependencies
npm install

# start dev server
npm run dev

# build for production
npm run build
```

Open http://localhost:5173 to use the app.
