import { NextResponse } from "next/server"
import { roomIdSchema } from "@/lib/schemas"

const DAILY_API_URL = "https://api.daily.co/v1"

export async function GET(request: Request, { params }: { params: { roomId: string } }) {
    const result = roomIdSchema.safeParse(await params.roomId)

    if (!result.success) {
        const errorMessage = result.error.issues.map((issue) => issue.message).join(", ")
        return NextResponse.json({ valid: false, error: errorMessage }, { status: 400 })
    }

    const roomId = result.data

    try {
        const response = await fetch(`${DAILY_API_URL}/rooms/${roomId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
            },
        })

        if (response.ok) {
            return NextResponse.json({ valid: true }, { status: 200 })
        } else if (response.status === 404) {
            return NextResponse.json({ valid: false, error: "Room not found" }, { status: 404 })
        } else {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to validate room")
        }
    } catch (error) {
        console.error("Error validating room:", error)
        return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 })
    }
}

