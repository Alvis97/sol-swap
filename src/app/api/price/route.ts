import { NextResponse } from 'next/server'
import React from 'react'

export async function GET() {
//     const response = await fetch(
//         'https://price.jup.ag/v6/price?ids=SOL'
//     )
//     const data = await response.json()
//   return NextResponse.json({solana: { usd: data.data.SOL.price } })
  return NextResponse.json({solana: { usd: 150 }})
}
