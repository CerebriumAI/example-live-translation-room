import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UserMediaError() {
    return (
        <div className="h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Unable to access devices</CardTitle>
                    <CardDescription>We need access to your camera and microphone to join the call.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Camera or Microphone Error</AlertTitle>
                        <AlertDescription className="mt-2">
                            <p className="mb-4">
                                We can&apos;t access your camera or microphone. To use this app, you need to allow access to your media
                                devices.
                            </p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    )
}

