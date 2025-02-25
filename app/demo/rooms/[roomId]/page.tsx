"use client"

import React, { useEffect, useState } from "react"
import {useParams, useSearchParams} from "next/navigation"
import { DailyProvider } from "@daily-co/daily-react"
import VideoRoom from "@/components/video-room"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RoomPage({params}) {
    const [url, setUrl] = useState("")
    const [token, setToken] = useState("")
    const [error, setError] = useState("")
    const searchParams = useSearchParams()
    const {roomId} = React.use(params);
    const name = searchParams.get("name")

    useEffect(() => {
        if (!roomId || !name) {
            setError("Invalid room parameters")
            return
        }

        const dailyUrl = `${process.env.NEXT_PUBLIC_DAILY_SUBDOMAIN}.daily.co/${roomId}`
        setUrl(dailyUrl)

        // Fetch the meeting token
        fetch(`/api/rooms/${roomId}/tokens`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error)
                }
                console.log(data);
                setToken(data.token)
            })
            .catch((err) => {
                console.error("Error fetching meeting token:", err)
                setError("Failed to join the room. Please try again.")
            })
    }, [roomId, name])

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!url || !token) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <DailyProvider url={url} token={token}>
            <VideoRoom userName={name || "Guest"} />
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    onClick={() => {
                        const shareUrl = `${window.location.origin}?roomId=${roomId}`
                        navigator.clipboard.writeText(shareUrl)
                        alert("Room link copied to clipboard!")
                    }}
                >
                    Share Room Link
                </Button>
            </div>
        </DailyProvider>
    )
}