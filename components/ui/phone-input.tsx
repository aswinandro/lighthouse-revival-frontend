"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

const countries = [
    { value: "ae", label: "UAE", code: "+971", flag: "🇦🇪" },
    { value: "in", label: "India", code: "+91", flag: "🇮🇳" },
    { value: "ph", label: "Philippines", code: "+63", flag: "🇵🇭" },
    { value: "pk", label: "Pakistan", code: "+92", flag: "🇵🇰" },
    { value: "ng", label: "Nigeria", code: "+234", flag: "🇳🇬" },
    { value: "gb", label: "UK", code: "+44", flag: "🇬🇧" },
    { value: "us", label: "USA", code: "+1", flag: "🇺🇸" },
    { value: "om", label: "Oman", code: "+968", flag: "🇴🇲" },
    { value: "sa", label: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
    { value: "kw", label: "Kuwait", code: "+965", flag: "🇰🇼" },
    { value: "bh", label: "Bahrain", code: "+973", flag: "🇧🇭" },
    { value: "qa", label: "Qatar", code: "+974", flag: "🇶🇦" },
    { value: "lk", label: "Sri Lanka", code: "+94", flag: "🇱🇰" },
    { value: "np", label: "Nepal", code: "+977", flag: "🇳🇵" },
    { value: "bd", label: "Bangladesh", code: "+880", flag: "🇧🇩" },
    { value: "eg", label: "Egypt", code: "+20", flag: "🇪🇬" },
    { value: "lb", label: "Lebanon", code: "+961", flag: "🇱🇧" },
    { value: "jo", label: "Jordan", code: "+962", flag: "🇯🇴" },
    { value: "sy", label: "Syria", code: "+963", flag: "🇸🇾" },
    { value: "iq", label: "Iraq", code: "+964", flag: "🇮🇶" },
    { value: "ye", label: "Yemen", code: "+967", flag: "🇾🇪" },
    { value: "ke", label: "Kenya", code: "+254", flag: "🇰🇪" },
    { value: "ug", label: "Uganda", code: "+256", flag: "🇺🇬" },
    { value: "gh", label: "Ghana", code: "+233", flag: "🇬🇭" },
    { value: "za", label: "South Africa", code: "+27", flag: "🇿🇦" },
    { value: "ca", label: "Canada", code: "+1", flag: "🇨🇦" },
    { value: "au", label: "Australia", code: "+61", flag: "🇦🇺" },
    { value: "nz", label: "New Zealand", code: "+64", flag: "🇳🇿" },
    { value: "sg", label: "Singapore", code: "+65", flag: "🇸🇬" },
    { value: "my", label: "Malaysia", code: "+60", flag: "🇲🇾" },
    { value: "id", label: "Indonesia", code: "+62", flag: "🇮🇩" },
]

interface PhoneInputProps {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
    required?: boolean
    id?: string
}

export function PhoneInput({ value, onChange, className, placeholder, required, id }: PhoneInputProps) {
    const [open, setOpen] = React.useState(false)
    const [countryCode, setCountryCode] = React.useState("+971")
    const [phoneNumber, setPhoneNumber] = React.useState("")

    // Parse initial value
    React.useEffect(() => {
        if (value) {
            // Find matching country code
            const matchingCountry = countries.find(c => value.startsWith(c.code))
            if (matchingCountry) {
                setCountryCode(matchingCountry.code)
                // Only set phone number if it hasn't been extracted yet or changed externally entirely
                const numberPart = value.slice(matchingCountry.code.length).trim()
                if (numberPart !== phoneNumber) {
                    setPhoneNumber(numberPart)
                }
            } else {
                // Default or if code not found in list, treat whole thing as number or keep default +971
                if (value.startsWith("+")) {
                    // Try to guess? For now just let it be.
                    // Actually if it starts with + but not in our list, user might have typed it manually.
                    // We can just set phone number to the whole string if we want, but better to enforce structure.
                    // Let's assume standard +971 default if nothing matches.
                }
            }
        }
    }, [value])


    const handleCountrySelect = (currentValue: string) => {
        const country = countries.find((c) => c.value === currentValue)
        if (country) {
            setCountryCode(country.code)
            setOpen(false)
            // Trigger onChange with new code + existing number
            onChange(`${country.code}${phoneNumber}`)
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value
        // Allow only numbers and spaces
        if (/^[0-9\s]*$/.test(newVal)) {
            setPhoneNumber(newVal)
            onChange(`${countryCode}${newVal.trim()}`)
        }
    }

    const selectedCountry = countries.find((c) => c.code === countryCode)

    return (
        <div className={cn("flex gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[110px] justify-between px-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                    >
                        {selectedCountry ? (
                            <span className="flex items-center gap-2 truncate">
                                <span className="text-lg">{selectedCountry.flag}</span>
                                <span className="text-xs">{selectedCountry.code}</span>
                            </span>
                        ) : (
                            "Code"
                        )}
                        <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0 bg-slate-900 border-white/10 text-white max-h-[300px] overflow-y-auto">
                    <Command className="bg-transparent text-white">
                        <CommandInput placeholder="Search country..." className="text-white h-9" />
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup className="text-white">
                            {countries.map((country) => (
                                <CommandItem
                                    key={country.value}
                                    value={country.label}
                                    onSelect={() => handleCountrySelect(country.value)}
                                    className="text-white aria-selected:bg-white/10"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            countryCode === country.code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="mr-2 text-lg">{country.flag}</span>
                                    <span className="flex-1">{country.label}</span>
                                    <span className="text-muted-foreground text-xs">{country.code}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <Input
                id={id}
                placeholder={placeholder || "50 123 4567"}
                required={required}
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="flex-1 bg-white/5 border-white/10 focus:border-primary/50 transition-all text-white"
            />
        </div>
    )
}
