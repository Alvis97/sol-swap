import { NextResponse } from 'next/server'
import React from 'react'
import { swapSchema } from '../../../../lib/validation'

const API_KEY = process.env.JUPITER_API_KEY

export async function POST(request: Request) {
   try{
     if (!API_KEY) {
        console.error("JUPITER_API_KEY is not set")
        return Response.json({ error: "Server configuration error" }, { status: 500 })
     }

     const body = await request.json().catch(() => null)
     const parsed = swapSchema.safeParse(body)

     if(!parsed.success) {
        console.error("Invalid swap body:", parsed.error.issues)
        return Response.json({ error: "Invalid parameters" }, { status: 400 })
     }

     const { quoteResponse, userPublicKey } = parsed.data

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