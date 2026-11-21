# Security

Sol Swap is a portfolio project and a demo, not a production service.
This document explains what I protected against, what I tested, and what I
know is not covered.

## Threat model

| Threat | Mitigation |
| --- | --- |
| Someone calls the API directly with crafted input (huge amounts, unknown tokens, high slippage) | Server-side validation with zod: token allowlist, slippage cap (max 3%), amount cap (about $2) |
| Bots use my Jupiter API key and quota | Rate limiting per IP (Upstash) and an origin check against my own domain |
| The swap transaction is changed on the way, or does something unexpected | The server checks the fee payer and that every instruction uses an allowed program, before the wallet is asked to sign |
| API keys leak to the browser | Jupiter key is used server-side only; the Helius RPC URL is public but restricted to my domain |
| Error messages reveal how the system works | Generic error messages are returned to the client |

On a blockchain there is no undo, so every check happens before the user signs.

## What is tested

- Unit tests (Vitest) for the transaction check: a wrong fee payer and an
  unknown program are rejected.
- Manual requests (browser and curl) for invalid input (400), rate limiting
  (429), origin check (403) and the amount cap.

## Known limitations

- **Not independently audited.** All measures are my own and tested only by me.
  Do not use with real funds beyond the demo cap.
- **IP-based rate limiting can be bypassed** with rotating IPs, and users
  behind a shared IP share one limit. The demo cap limits the worst case.
- **The origin check only stops other websites in a browser.** Tools like
  curl can set any Origin header, so it is not a defence on its own.
- **The RPC URL is public** because it ships in the browser bundle. It is
  restricted to my domain in Helius.
- **Free Jupiter plan** (1 request per second), so many simultaneous visitors
  can hit the limit.

## Out of scope

Transaction history, user accounts and storing wallet data.

## Data

The app has no accounts and does not store wallet addresses or transaction
history. For rate limiting, the visitor's IP address is used as a key in
Upstash Redis and expires after the rate limit window (one minute).
