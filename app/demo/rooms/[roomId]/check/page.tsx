"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Volume2, RefreshCcw } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface MediaDevice {
    deviceId: string
    label: string
}

export default function HairCheck({params}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {roomId} = React.use(params)
    const name = searchParams.get("name")

    const [cameras, setCameras] = useState<MediaDevice[]>([])
    const [microphones, setMicrophones] = useState<MediaDevice[]>([])
    const [selectedCamera, setSelectedCamera] = useState<string>("")
    const [selectedMicrophone, setSelectedMicrophone] = useState<string>("")
    const [volume, setVolume] = useState(75)
    const [error, setError] = useState<string>("")
    const [isTestingAudio, setIsTestingAudio] = useState(false)

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const audioTestRef = useRef<HTMLAudioElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    useEffect(() => {
        if (!roomId || !name) {
            router.push("/demo")
            return
        }

        async function getDevices() {
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

                if (videoDevices.length > 0) {
                    setSelectedCamera(videoDevices[0].deviceId)
                }

                if (audioDevices.length > 0) {
                    setSelectedMicrophone(audioDevices[0].deviceId)
                }
            } catch (err) {
                setError(
                    "Failed to access media devices. Please ensure you have granted permission to use your camera and microphone.",
                )
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
        async function updateStream() {
            try {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop())
                }

                if (!selectedCamera) return

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: selectedCamera },
                    audio: false,
                })

                streamRef.current = stream

                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (err) {
                setError("Failed to access camera")
            }
        }

        updateStream()
    }, [selectedCamera])

    const testAudio = async () => {
        try {
            if (isTestingAudio || !selectedMicrophone) return

            setIsTestingAudio(true)

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedMicrophone },
            })

            // Create an audio context
            const audioContext = new AudioContext()
            const source = audioContext.createMediaStreamSource(stream)
            const analyser = audioContext.createAnalyser()
            source.connect(analyser)

            // Play a test sound
            if (audioTestRef.current) {
                audioTestRef.current.volume = volume / 100
                audioTestRef.current.play()
            }

            // Clean up after 3 seconds
            setTimeout(() => {
                stream.getTracks().forEach((track) => track.stop())
                audioContext.close()
                setIsTestingAudio(false)
            }, 3000)
        } catch (err) {
            setError("Failed to test audio")
            setIsTestingAudio(false)
        }
    }

    const joinRoom = async () => {
        try {
            // Stop the preview stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }

            // Navigate to the room with device preferences
            router.push(
                `/demo/rooms/${roomId}?name=${name}&cameraId=${selectedCamera}&microphoneId=${selectedMicrophone}&volume=${volume}`,
            )
        } catch (err) {
            setError("Failed to join room")
        }
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center p-4">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Check Your Audio & Video</CardTitle>
                    <CardDescription>Make sure everything looks and sounds good before joining</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Video Preview */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Camera Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="camera">Camera</Label>
                            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                                <SelectTrigger id="camera">
                                    <SelectValue placeholder="Select camera" />
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

                        {/* Microphone Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="microphone">Microphone</Label>
                            <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                                <SelectTrigger id="microphone">
                                    <SelectValue placeholder="Select microphone" />
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
                    </div>

                    {/* Volume Control */}
                    <div className="space-y-2">
                        <Label>Speaker Volume</Label>
                        <div className="flex items-center gap-4">
                            <Volume2 className="h-5 w-5 shrink-0" />
                            <Slider value={[volume]} onValueChange={([value]) => setVolume(value)} max={100} step={1} />
                            <span className="w-12 text-sm">{volume}%</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={testAudio} disabled={isTestingAudio} className="mt-2">
                            {isTestingAudio ? (
                                <>
                                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                    Testing...
                                </>
                            ) : (
                                "Test Sound"
                            )}
                        </Button>
                    </div>

                    <audio ref={audioTestRef} src="/test-sound.mp3" />

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => router.push("/")}>
                            Cancel
                        </Button>
                        <Button onClick={joinRoom}>Join Room</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}