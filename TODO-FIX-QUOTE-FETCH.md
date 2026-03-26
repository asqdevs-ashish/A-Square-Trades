# TODO: Fix TwelveData Quote Fetching

**Status**: Complete ✅

Updated lib/api.ts:
- Added `fetchQuotesBatch` (batches of 8, error handling, Record output)
- Fixed `fetchSymbolSearch` (target snippet): batch quotes, slice 15, full log, type safe
- Fixed all list functions: consistent slice 15, batch quotes, log, type safe
- Fallbacks preserved

**Test**: `npm run dev`, search symbols, switch markets - check console for [QUOTE-BATCH], no 400 errors, prices load.

