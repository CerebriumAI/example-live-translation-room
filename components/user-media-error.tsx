import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function UserMediaError() {
    return (
        <div className="h-screen flex items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera or Microphone Error</AlertTitle>
                <AlertDescription className="mt-2">
                    <p className="mb-4">
                        We can&apos;t access your camera or microphone. To use this app, you need to allow access to your media devices.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    )
}
