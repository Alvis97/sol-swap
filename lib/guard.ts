import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

const quoteLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, "1 m"),
    prefix: "rl:quote",
})

const swapLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "rl:swap",
})

export async function guard(
    req: Request,
    kind: "quote" | "swap"
): Promise<Response | null> {
    const origin = req.headers.get("origin")
    if (origin && origin !== process.env.APP_ORIGIN) {
        return Response.json({ error: "Forbidden" }, {status: 403 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const limiter = kind === "quote" ? quoteLimiter : swapLimiter

    const { success } = await limiter.limit(ip)

    if (!success) {
        return Response.json({ error: "Too many requests" }, { status: 429 })
    }
    return null
}

