import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRoomStore } from "@/lib/store"

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
] as const

export function LanguageSelector() {
    const { preferences, updatePreferences } = useRoomStore()

    return (
        <Select value={preferences.targetLanguage} onValueChange={(value) => updatePreferences({ targetLanguage: value })}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
                {
                    languages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                            {language.name}
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}

