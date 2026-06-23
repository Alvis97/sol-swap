import { NextResponse } from 'next/server'
import React from 'react'

export async function GET() {
    const response = await fetch(
        'https://api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112,JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    {
      headers: {
        'x-api-key': process.env.JUPITER_API_KEY!,
      },
    }
    )
    const data = await response.json()
    console.log(JSON.stringify(data, null, 2));
    const solPrice = data["So11111111111111111111111111111111111111112"]?.usdPrice
     console.log("SOL PRICE:", solPrice) // 
  return NextResponse.json({solana: { usd: solPrice } })
}


