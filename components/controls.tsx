"use client"

import { useDaily, useLocalParticipant } from "@daily-co/daily-react"
import { Button } from "@/components/ui/button"
import { useRoomStore } from "@/lib/store"
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    MessageSquare,
    Share2,
    Users,
    RepeatIcon as Record,
    Hand,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Controls({
                             className,
                             isMobile,
                         }: {
    className?: string
    isMobile?: boolean
}) {
    const daily = useDaily()
    const localParticipant = useLocalParticipant()
    const { toggleChat, toggleParticipants, isRecording, isSharingScreen, setRecording, setScreenSharing } =
        useRoomStore()

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

    const startScreenShare = async () => {
        try {
            await daily?.startScreenShare()
            setScreenSharing(true)
        } catch (err) {
            console.error("Failed to start screen share:", err)
        }
    }

    const stopScreenShare = async () => {
        try {
            await daily?.stopScreenShare()
            setScreenSharing(false)
        } catch (err) {
            console.error("Failed to stop screen share:", err)
        }
    }

    const toggleRecording = async () => {
        try {
            if (isRecording) {
                await daily?.stopRecording()
                setRecording(false)
            } else {
                await daily?.startRecording()
                setRecording(true)
            }
        } catch (err) {
            console.error("Failed to toggle recording:", err)
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
            show: true,
        },
        {
            icon: localParticipant?.video ? <Video /> : <VideoOff className="text-destructive" />,
            label: localParticipant?.video ? "Stop Video" : "Start Video",
            onClick: toggleVideo,
            show: true,
        },
        {
            icon: <MessageSquare />,
            label: "Chat",
            onClick: toggleChat,
            show: !isMobile,
        },
        {
            icon: <Users />,
            label: "Participants",
            onClick: toggleParticipants,
            show: !isMobile,
        },
        {
            icon: <Share2 className={cn(isSharingScreen && "text-primary")} />,
            label: isSharingScreen ? "Stop Sharing" : "Share Screen",
            onClick: isSharingScreen ? stopScreenShare : startScreenShare,
            show: !isMobile,
        },
        {
            icon: <Record className={cn(isRecording && "text-destructive")} />,
            label: isRecording ? "Stop Recording" : "Start Recording",
            onClick: toggleRecording,
            show: !isMobile,
        },
        {
            icon: <Hand />,
            label: "Raise Hand",
            onClick: () => {}, // Implement raise hand functionality
            show: true,
        },
    ]

    return (
        <TooltipProvider>
            <div className={cn("flex items-center justify-center gap-2 md:gap-4", className)}>
                {controls
                    .filter((control) => control.show)
                    .map((control, index) => (
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

