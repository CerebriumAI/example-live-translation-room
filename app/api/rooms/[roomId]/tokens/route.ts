import { NextRequest, NextResponse } from "next/server";
import { roomIdSchema, nameSchema } from "@/lib/schemas";

const DAILY_API_URL = "https://api.daily.co/v1";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;
  const roomIdResult = roomIdSchema.safeParse(roomId);

  if (!roomIdResult.success) {
    const errorMessage = roomIdResult.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  try {
    const body = await request.json();
    const nameResult = nameSchema.safeParse(body.name);

    if (!nameResult.success) {
      const errorMessage = nameResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const name = nameResult.data;

    const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          room_name: roomId,
          user_name: name,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create meeting token");
    }

    const data = await response.json();

    return NextResponse.json({ token: data.token }, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting token:", error);
    return NextResponse.json(
      { error: "Failed to create meeting token" },
      { status: 500 },
    );
  }
}
