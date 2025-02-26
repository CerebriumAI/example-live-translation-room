"use client"

import { useDaily, useLocalParticipant } from "@daily-co/daily-react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Controls({
                             className,
                         }: {
    className?: string
}) {
    const daily = useDaily()
    const localParticipant = useLocalParticipant()

    const toggleAudio = async () => {
        try {
            if (localParticipant?.audio) {
                await daily?.setLocalAudio(false)
            } else {
                await daily?.setLocalAudio(true)
            }
        } catch (err) {
            console.error("Failed to toggle audio:", err)
        }
    }

    const toggleVideo = async () => {
        try {
            if (localParticipant?.video) {
                await daily?.setLocalVideo(false)
            } else {
                await daily?.setLocalVideo(true)
            }
        } catch (err) {
            console.error("Failed to toggle video:", err)
        }
    }

    const leaveCall = async () => {
        try {
            await daily?.leave()
            window.location.href = "/"
        } catch (err) {
            console.error("Failed to leave call:", err)
            window.location.href = "/"
        }
    }

    const controls = [
        {
            icon: localParticipant?.audio ? <Mic /> : <MicOff className="text-destructive" />,
            label: localParticipant?.audio ? "Mute" : "Unmute",
            onClick: toggleAudio,
        },
        {
            icon: localParticipant?.video ? <Video /> : <VideoOff className="text-destructive" />,
            label: localParticipant?.video ? "Stop Video" : "Start Video",
            onClick: toggleVideo,
        },
    ]

    return (
        <TooltipProvider>
            <div className={cn("flex items-center justify-center gap-2 md:gap-4", className)}>
                {controls.map((control, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={control.onClick}>
                                {control.icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{control.label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}

                <Button variant="destructive" size="icon" onClick={leaveCall}>
                    <PhoneOff />
                </Button>
            </div>
        </TooltipProvider>
    )
}