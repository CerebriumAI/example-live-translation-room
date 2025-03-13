import {NextRequest} from "next/server"
import { roomIdSchema } from "@/lib/schemas"

const DAILY_API_URL = "https://api.daily.co/v1"

export async function GET(request: NextRequest,  { params }: { params: Promise<{ roomId: string }>}) {
    const {roomId} = await params;
    const result = roomIdSchema.safeParse(roomId)

    if (!result.success) {
        const errorMessage = result.error.issues.map((issue) => issue.message).join(", ")
        return new Response(JSON.stringify({ valid: false, error: errorMessage }), { status: 400 })
    }

    try {
        const response = await fetch(`${DAILY_API_URL}/rooms/${roomId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
            },
        })

        if (response.ok) {
            return  new Response(JSON.stringify({ valid: true }), { status: 200 })
        } else if (response.status === 404) {
            return new Response(JSON.stringify({ valid: false, error: "Room not found" }), { status: 404 })
        } else {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to validate room")
        }
    } catch (error) {
        console.error("Error validating room:", error)
        return  new Response(JSON.stringify({ valid: false, error: "Internal server error" }), { status: 500 })
    }
}

