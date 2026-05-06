import { NextResponse } from 'next/server'
import React from 'react'

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url)
 const inputMint = searchParams.get('inputMint')
 const outputMint = searchParams.get('outputMint')
 const amount = searchParams.get('amount')
 const slippageBps = searchParams.get('slippageBps')

 const response = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
 )
 const text = await response.text()
 console.log("Jupiter svarade:", text)
 return NextResponse.json(JSON.parse(text))
}

