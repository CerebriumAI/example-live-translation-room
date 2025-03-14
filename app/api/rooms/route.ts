import { NextRequest, NextResponse } from "next/server";
import { createRoomSchema } from "@/lib/schemas";

const DAILY_API_URL = "https://api.daily.co/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createRoomSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          exp: Math.round(Date.now() / 1000) + 60 * 30,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create room");
    }

    const room = await response.json();

    return NextResponse.json({ roomId: room.name }, { status: 200 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
