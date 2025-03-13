"use client"

import React, { useEffect, useState } from "react"
import {useParams, useSearchParams} from "next/navigation"
import { DailyProvider } from "@daily-co/daily-react"
import VideoRoom from "@/components/video-room"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RoomPage() {
    const {roomId} = useParams<{roomId: string}>();
    const [url, setUrl] = useState("")
    const [token, setToken] = useState("")
    const [error, setError] = useState("")
    const searchParams = useSearchParams()
    const name = searchParams.get("name")

    useEffect(() => {
        if (!roomId || !name) {
            setError("Invalid room parameters")
            return
        }

        const dailyUrl = `${process.env.NEXT_PUBLIC_DAILY_SUBDOMAIN}.daily.co/${roomId}`
        setUrl(dailyUrl)

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

    console.log('bruh')

    return (
        <DailyProvider url={url} token={token}>
            <VideoRoom roomName="Meeting" userName={name || "Guest"} url={url} />
        </DailyProvider>
    )
}