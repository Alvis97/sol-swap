import { quoteSchema } from '../../../../lib/validation';

const API_KEY = process.env.JUPITER_API_KEY;

export async function GET(request: Request) {
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
   'x-api-key' : API_KEY!,
 }
 })

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


