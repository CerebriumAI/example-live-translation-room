"use client"

import { useEffect, useRef, useState } from "react"
import {
    useActiveSpeakerId,
    useLocalSessionId,
    useMediaTrack,
    useParticipantProperty,
} from "@daily-co/daily-react"
import { Mic, MicOff, Globe, User } from "lucide-react"
import { cn } from "@/lib/utils"
import {parseTranslatorInfo} from "@/components/video-room";

interface TileProps {
    id: string
}

export function Tile({ id }: TileProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const mediaTrack = useMediaTrack(id, 'video')
    const activeSpeakerId = useActiveSpeakerId();
    const localSessionId = useLocalSessionId()
    const userName = useParticipantProperty(id, 'user_name')
    const audio = useParticipantProperty(id, 'audio')
    const isLocal = id === localSessionId
    const isSpeaking = activeSpeakerId === id
    const [videoLoaded, setVideoLoaded] = useState(false)

    const translatorInfo = parseTranslatorInfo(userName);

    useEffect(() => {
        if (!mediaTrack.track || !videoRef.current) {
            setVideoLoaded(false)
            return
        }

        setVideoLoaded(false)

        try {
            videoRef.current.srcObject = new MediaStream([mediaTrack.track])

            const handleVideoLoaded = () => {
                setVideoLoaded(true)
            }

            videoRef.current.addEventListener('loadeddata', handleVideoLoaded)

            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('loadeddata', handleVideoLoaded)
                    videoRef.current.srcObject = null
                }
            }
        } catch (err) {
            console.error("Error setting video source:", err)
        }
    }, [mediaTrack.track])

    if (translatorInfo?.isTranslator) {
        const translatorInfo = parseTranslatorInfo(userName)

        return (
            <div
                className={cn(
                    "relative w-full h-full rounded-lg overflow-hidden bg-slate-200",
                    "transition-all duration-200",
                    isSpeaking && "ring-2 ring-primary ring-offset-2",
                )}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-white mb-2",
                        translatorInfo?.language === 'en' ? "bg-blue-500" :
                            translatorInfo?.language === 'es' ? "bg-red-500" : "bg-gray-500"
                    )}>
                        <Globe className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Translator</p>
                        <p className="text-sm text-gray-600">
                            {translatorInfo?.language === 'en' ? 'English Translation' :
                                translatorInfo?.language === 'es' ? 'Spanish Translation' : 'Translation'}
                        </p>
                    </div>
                    <div className="mt-2">
                        {audio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                    </div>
                </div>
            </div>
        )
    }

    if (!videoLoaded && mediaTrack.state !== "playable") {
        return (
            <div
                className={cn(
                    "relative w-full h-full rounded-lg overflow-hidden bg-slate-200",
                    "transition-all duration-200",
                    isSpeaking && "ring-2 ring-primary ring-offset-2",
                )}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-slate-500 mb-2">
                        <User className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">{userName}</p>
                        <p className="text-sm text-gray-600">Video connecting</p>
                    </div>
                    <div className="mt-2">
                        {audio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                "relative w-full h-full rounded-lg overflow-hidden",
                "transition-all duration-200",
                isSpeaking && "ring-2 ring-primary ring-offset-2",
            )}
        >
            <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">
                            {userName} {isLocal && "(You)"}
                        </span>
                        {audio ? <Mic className="h-4 w-4 text-white" /> : <MicOff className="h-4 w-4 text-red-500" />}
                    </div>
                </div>
            </div>
        </div>
    )
}