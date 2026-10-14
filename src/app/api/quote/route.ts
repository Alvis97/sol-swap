import { quoteSchema } from '../../../../lib/validation';
import { guard } from '../../../../lib/guard'

const API_KEY = process.env.JUPITER_API_KEY;

export async function GET(request: Request) {
  const blocked = await guard(request, "quote")
  if (blocked) return blocked

   try {
if (!API_KEY) {
  console.error("JUPITER_API_KEY is not set")
  return Response.json({ error: "Server configuration error" }, { status: 500 })
}

 const { searchParams } = new URL(request.url)
 const parsed = quoteSchema.safeParse(Object.fromEntries(searchParams))

 if(!parsed.success) {
  console.error("Invalid quote params:", parsed.error.issues)
  return Response.json({ error: "Invalid parameters" }, { status: 400 })
 }

 const { inputMint, outputMint, amount, slippageBps } = parsed.data

    const params = new URLSearchParams({ 
      inputMint,
      outputMint,
      amount : amount.toString(),
      slippageBps : slippageBps.toString(),
    })

 const response = await fetch(
      `https://api.jup.ag/swap/v1/quote?${params}`,
 { headers: {
   'x-api-key' : API_KEY,
 }
 })

 if (!response.ok) {
   const errText = await response.text()
   console.error("Jupiter API error:", response.status, errText)
   return Response.json({ error: "Failed to fetch quote" }, { status: 502 })
 }

 const data = await response.json()
 return Response.json(data)
} catch (err) {
   console.error("Route handle error:", err)
   return Response.json({ error: "Internal server error" }, { status: 500 })
}
}


