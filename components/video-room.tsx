"use client"

import React, { useState, useCallback } from "react"
import { useParticipantIds, useScreenShare, useDailyEvent, useLocalSessionId, useDaily } from "@daily-co/daily-react"
import { UserMediaError } from "./user-media-error"
import { Tile } from "./tile"
import { Controls } from "./controls"
import { useRoomStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function VideoRoom({ userName }: { userName: string }) {
    const [getUserMediaError, setGetUserMediaError] = useState(false)
    const daily = useDaily()
    const { screens } = useScreenShare()
    const remoteParticipantIds = useParticipantIds({ filter: "remote" })
    const localSessionId = useLocalSessionId()
    const isAlone = remoteParticipantIds.length < 1 && screens.length < 1

    // Handle camera/microphone errors
    useDailyEvent(
        "camera-error",
        useCallback(() => {
            setGetUserMediaError(true)
        }, []),
    )

    // Join the room when the component mounts
    React.useEffect(() => {
        if (!daily) return

        const join = async () => {
            try {
                await daily.join({ userName })
                useRoomStore.getState().setMeetingStartTime(new Date())
            } catch (err) {
                console.error("Failed to join room:", err)
                setGetUserMediaError(true)
            }
        }

        join()

        return () => {
            daily.leave()
        }
    }, [daily, userName])

    const renderCallScreen = () => (
        <div className="h-screen flex flex-col bg-background">
            <main
                className={cn(
                    "flex-1 relative p-4",
                    screens.length > 0 ? "grid grid-cols-4 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                )}
            >
                {/* Local participant tile */}
                {localSessionId && <Tile id={localSessionId} isLocal isAlone={isAlone} />}

                {/* Remote participants and screen shares */}
                {remoteParticipantIds.length > 0 || screens.length > 0 ? (
                    <>
                        {remoteParticipantIds.map((id) => (
                            <Tile key={id} id={id} />
                        ))}
                        {screens.map((screen) => (
                            <Tile key={screen.screenId} id={screen.session_id} isScreenShare />
                        ))}
                    </>
                ) : (
                    <div className="col-span-full flex items-center justify-center">
                        <div className="max-w-md text-center space-y-4 p-8 rounded-lg bg-muted/50">
                            <h1 className="text-2xl font-semibold">Waiting for others</h1>
                            <p className="text-muted-foreground">Invite someone by sharing this link:</p>
                            <div className="p-2 bg-background rounded-lg">
                                <p className="text-sm font-mono break-all">{window.location.href}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Controls className="h-16 border-t" />
        </div>
    )

    return getUserMediaError ? <UserMediaError /> : renderCallScreen()
}