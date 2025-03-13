"use client"

import React, { useEffect, useRef, useState } from "react"
import {useParams, useRouter, useSearchParams} from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Volume2, RefreshCcw, Camera, CameraOff, AlertCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { LanguageSelector } from "@/components/language-selector"

interface MediaDevice {
    deviceId: string
    label: string
}

interface DeviceError {
    type: "camera" | "microphone" | "permission" | "general"
    message: string
}

export default function HairCheckPage() {
    const {roomId} = useParams<{roomId: string}>()
    const router = useRouter()
    const searchParams = useSearchParams()
    const name = searchParams.get("name")

    const [cameras, setCameras] = useState<MediaDevice[]>([])
    const [microphones, setMicrophones] = useState<MediaDevice[]>([])
    const [selectedCamera, setSelectedCamera] = useState<string>("")
    const [selectedMicrophone, setSelectedMicrophone] = useState<string>("")
    const [volume, setVolume] = useState(75)
    const [errors, setErrors] = useState<DeviceError[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isTestingAudio, setIsTestingAudio] = useState(false)

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const audioTestRef = useRef<HTMLAudioElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    useEffect(() => {
        if (!roomId || !name) {
            router.push("/")
            return
        }

        const getDevices = async () => {
            try {
                // First request permissions
                await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

                const devices = await navigator.mediaDevices.enumerateDevices()

                const videoDevices = devices
                    .filter((device) => device.kind === "videoinput")
                    .map((device) => ({
                        deviceId: device.deviceId,
                        label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`,
                    }))

                const audioDevices = devices
                    .filter((device) => device.kind === "audioinput")
                    .map((device) => ({
                        deviceId: device.deviceId,
                        label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`,
                    }))

                setCameras(videoDevices)
                setMicrophones(audioDevices)

                if (videoDevices.length === 0) {
                    setErrors((prev) => [
                        ...prev,
                        {
                            type: "camera",
                            message: "No cameras found. Please connect a camera and refresh.",
                        },
                    ])
                } else {
                    setSelectedCamera(videoDevices[0].deviceId)
                }

                if (audioDevices.length === 0) {
                    setErrors((prev) => [
                        ...prev,
                        {
                            type: "microphone",
                            message: "No microphones found. Please connect a microphone and refresh.",
                        },
                    ])
                } else {
                    setSelectedMicrophone(audioDevices[0].deviceId)
                }
            } catch (err) {
                if (err instanceof DOMException) {
                    if (err.name === "NotAllowedError") {
                        setErrors([
                            {
                                type: "permission",
                                message: "Please allow access to your camera and microphone to join the meeting.",
                            },
                        ])
                    } else {
                        setErrors([
                            {
                                type: "general",
                                message: "An error occurred while accessing your devices.",
                            },
                        ])
                    }
                }
            } finally {
                setIsLoading(false)
            }
        }

        getDevices()

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }
        }
    }, [roomId, name, router])

    useEffect(() => {
        const startStream = async () => {
            if (!selectedCamera) return

            try {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop())
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: selectedCamera },
                    audio: selectedMicrophone ? { deviceId: selectedMicrophone } : false,
                })

                streamRef.current = stream

                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }

                // Clear any previous camera/mic errors
                setErrors((prev) => prev.filter((error) => error.type !== "camera" && error.type !== "microphone"))
            } catch (error) {
                console.error(error)
                setErrors((prev) => [
                    ...prev,
                    {
                        type: "camera",
                        message: "Failed to access camera. Please check your permissions and try again.",
                    },
                ])
            }
        }

        startStream()
    }, [selectedCamera, selectedMicrophone])

    const testAudio = async () => {
        setIsTestingAudio(true)
        try {
            if (audioTestRef.current) {
                audioTestRef.current.volume = volume / 100
                await audioTestRef.current.play()
                await new Promise((resolve) => setTimeout(resolve, 3000))
                audioTestRef.current.pause()
                audioTestRef.current.currentTime = 0
            }
        } catch (error) {
            console.error(error)
            setErrors((prev) => [
                ...prev,
                {
                    type: "general",
                    message: "Failed to test audio. Please check your speaker settings.",
                },
            ])
        } finally {
            setIsTestingAudio(false)
        }
    }

    const joinRoom = () => {
        if (errors.length > 0) return

        try {
            // Stop the preview stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }

            router.push(
                `/demo/rooms/${roomId}?name=${encodeURIComponent(name || 'guest')}&cameraId=${selectedCamera}&microphoneId=${selectedMicrophone}&volume=${volume}`,
            )
        } catch (error) {
            console.error(error)
            setErrors([{ type: "general", message: "Failed to join room. Please try again." }])
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-background to-mute">
                <div className="text-center space-y-4">
                    <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">Setting up your devices...</p>
                </div>
            </div>
        )
    }

    const hasBlockingError = errors.some((error) => error.type === "permission")

    if (hasBlockingError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            Permission Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertDescription>{errors.find((error) => error.type === "permission")?.message}</AlertDescription>
                        </Alert>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => router.push("/")}>
                                Cancel
                            </Button>
                            <Button onClick={() => window.location.reload()}>Try Again</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-5xl shadow-none border-0 md:border md:shadow-sm">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle>Check Your Audio & Video</CardTitle>
                    <CardDescription>Make sure everything looks and sounds good before joining</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                                <video ref={videoRef} autoPlay playsInline muted
                                       className="w-full h-full object-cover"/>
                                {errors.some((error) => error.type === "camera") && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <div className="text-center space-y-2">
                                            <CameraOff className="h-8 w-8 mx-auto text-muted-foreground"/>
                                            <p className="text-sm text-muted-foreground">Camera not available</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {errors.length > 0 && !hasBlockingError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Device Issues Detected</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc list-inside space-y-1 mt-2">
                                            {errors.map((error, index) => (
                                                <li key={index}>{error.message}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="camera" className="flex items-center gap-2">
                                    <Camera className="h-3 w-3"/> Camera
                                </Label>
                                <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                                    <SelectTrigger id="camera" className="bg-background">
                                        <SelectValue placeholder="Select camera"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cameras.map((camera) => (
                                            <SelectItem key={camera.deviceId} value={camera.deviceId}>
                                                {camera.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="microphone" className="flex items-center gap-2">
                                    <Volume2 className="h-3 w-3"/> Microphone
                                </Label>
                                <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                                    <SelectTrigger id="microphone" className="bg-background">
                                        <SelectValue placeholder="Select microphone"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {microphones.map((mic) => (
                                            <SelectItem key={mic.deviceId} value={mic.deviceId}>
                                                {mic.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 justify-start space-1.5">
                                <div className="space-y-1">
                                    <Label>Translation Language</Label>
                                    <LanguageSelector/>
                                    <p className="text-xs text-muted-foreground">Language you will hear</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-2 mt-4">
                        <Label>Speaker Volume</Label>
                        <div className="flex items-center gap-4 pb-4">
                            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0"/>
                            <Slider
                                value={[volume]}
                                onValueChange={([value]) => setVolume(value)}
                                max={100}
                                step={1}
                                className="[&_[role=slider]]:bg-[#E31B5D] [&_[role=slider]]:border-[#E31B5D]"
                            />
                            <span className="w-12 text-sm text-muted-foreground">{volume}%</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={testAudio}
                            disabled={isTestingAudio}
                            className="h-8 text-xs"
                        >
                            {isTestingAudio ? (
                                <>
                                    <RefreshCcw className="mr-2 h-3 w-3 animate-spin"/>
                                    Testing...
                                </>
                            ) : (
                                "Test Sound"
                            )}
                        </Button>
                    </div>

                    <audio ref={audioTestRef} src="/test-sound.mp3"/>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => router.push("/")} className="text-sm">
                            Cancel
                        </Button>
                        <Button
                            onClick={joinRoom}
                            disabled={hasBlockingError || errors.length > 0}
                            className="bg-[#E31B5D] hover:bg-[#E31B5D]/90 text-sm"
                        >
                            Join Room
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}