import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRoomStore } from "@/lib/store"

const languages = [
    { code: "es", name: "Spanish" },
    { code: "en", name: "English" },
] as const

export function LanguageSelector() {
    const { preferences, updatePreferences } = useRoomStore()

    const onUpdate = (value: string) => {
        const updatedPreferences = {...preferences}
        updatedPreferences.targetLanguage = value
        updatePreferences(updatedPreferences)
    }

    return (
        <Select value={preferences.targetLanguage} onValueChange={onUpdate}>
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

