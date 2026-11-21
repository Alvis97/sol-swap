# Sol Swap

A SOL ↔ USDC swap app on Solana mainnet, built with Next.js and TypeScript
using Jupiter's API. A portfolio project with a focus on securing the backend.

**Live demo:** https://sol-swap-beige.vercel.app
**Demo limit:** swaps are capped at about $2.

<img width="300" alt="SwapGif" src="https://github.com/user-attachments/assets/df1f461e-2243-46b1-976c-05c55a4ed720" />

## Features
- Connect a Solana wallet (Phantom)
- See quotes with or without a connected wallet
- Manual slippage, fee and estimated amount
- Loading, error and success states
- Link to the finished transaction on Solscan

## How a swap works
1. **Quote:** fetch the best price and route from Jupiter
2. **Build:** Jupiter turns the quote into a transaction (server-side, so the API key stays private)
3. **Verify:** check the fee payer and every program before anything is signed
4. **Sign:** the user approves in their wallet, the app never sees the private key
5. **Send:** broadcast the signed transaction through an RPC node
6. **Confirm:** wait for the network and check that it didn't fail on-chain

## Security
- Server-side validation with zod (token allowlist, slippage and amount caps)
- Rate limiting (Upstash) and origin check
- Transaction check before signing (fee payer and allowed programs), with tests
- API key stays on the server, generic error messages

Details and known limitations: see [SECURITY.md](./SECURITY.md).

## Tech stack
Next.js, TypeScript, Tailwind, Solana wallet adapter, Jupiter API,
Helius RPC, Upstash Redis, Vercel, Vitest

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your own values
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000


## Environment variables
| Name | What it is |
| --- | --- |
| NEXT_PUBLIC_HELIUS_RPC_URL | RPC endpoint (public, restrict it to your domain) |
| APP_ORIGIN | Allowed origin for API requests |
| JUPITER_API_KEY | Jupiter API key (server only) |
| UPSTASH_REDIS_REST_URL | Upstash Redis URL (rate limiting) |
| UPSTASH_REDIS_REST_TOKEN | Upstash Redis token |

## Tests
npm test

## Disclaimer
Not affiliated with the Solana Foundation, Circle or Jupiter. Demo only,
not audited, do not use with real funds beyond the demo limit.
