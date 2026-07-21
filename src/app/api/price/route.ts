import { NextResponse } from 'next/server'
import React from 'react'

export async function GET() {
    const response = await fetch(
        'https://api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    {
      headers: {
        'x-api-key': process.env.JUPITER_API_KEY!,
      },
    }
    )
    const data = await response.json()
    const solPrice = data["So11111111111111111111111111111111111111112"]?.usdPrice
  return NextResponse.json({solana: { usd: solPrice } })
}


