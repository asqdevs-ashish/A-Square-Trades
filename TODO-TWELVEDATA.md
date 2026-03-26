# ✅ COMPLETE: Unified TwelveData API

## Implemented
1. ✅ lib/constants.ts symbols (BTC/USD, RELIANCE.NSE etc.)
2. ✅ .env.example TWELVEDATA_API_KEY
3. ✅ lib/api.ts all fetches: lists (/symbols + /quote), candles (/time_series), WS realtime
4. ✅ Fallback to DEFAULT_*_ASSETS & mocks no key
5. ✅ Generic Asset.symbol works all markets/charts/watchlist/search

## Get key
https://twelvedata.com/ free tier

Copy to .env.local

## Test
`npm run dev`
- Switch markets: Real data or mock
- Charts: time_series data
- Watchlist: Realtime WS updates

Ready!
