import { NextResponse } from 'next/server'
import React from 'react'

const API_KEY = process.env.JUPITER_API_KEY;

export async function GET(request: Request) {
   try {
 const { searchParams } = new URL(request.url)
 const inputMint = searchParams.get('inputMint')
 const outputMint = searchParams.get('outputMint')
 const amount = searchParams.get('amount')
 const slippageBps = searchParams.get('slippageBps')

  if (!inputMint || !outputMint || !amount || !slippageBps) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const params = new URLSearchParams({ inputMint, outputMint, amount, slippageBps })

 const response = await fetch(
      `https://api.jup.ag/swap/v1/quote?${params}`,
 { headers: {
   'x-api-key' : API_KEY!,
 }

 }
    )

 if (!response.ok) {
   const errText = await response.text()
   console.error("Jupiter API error:", response.status, errText)
   return Response.json({ error: errText }, { status: response.status })
 }

 const data = await response.json()
 return Response.json(data)
} catch (err) {
   console.error("Route handle error:", err)
   return Response.json({ error: String(err) }, { status: 500 })
}
}


