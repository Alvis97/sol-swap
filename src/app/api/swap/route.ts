import { NextResponse } from 'next/server'
import React from 'react'

const API_KEY = process.env.JUPITER_API_KEY

export async function POST(request: Request) {
   try{
     if (!API_KEY) {
        return Response.json({ error: "Missing Api key" }, { status: 500 })
     }

     const { quoteResponse, userPublicKey } = await request.json()

     if (!quoteResponse || !userPublicKey) {
        return Response.json({ error: "Missing parameters" }, { status: 400})
     }

     const response = await fetch("https://api.jup.ag/swap/v1/swap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key" : API_KEY,
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey,
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
        }),
     })

     if (!response.ok) {
        const errText = await response.text()
        console.error("Jupiter swap error: ", response.status, errText)
        return Response.json({ error: errText}, { status: response.status})
     }

     const data = await response.json()
     return Response.json(data)


   } catch(err) {
    console.error("Swap route error: ", err)
    return Response.json({ error: String(err) }, { status: 500 })

   }
}