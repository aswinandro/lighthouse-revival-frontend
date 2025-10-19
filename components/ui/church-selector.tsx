"use client"

import { Check, ChevronsUpDown, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useChurch } from "@/components/providers/church-context"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ChurchSelector() {
  const { selectedChurch, churches, setSelectedChurch } = useChurch()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between bg-transparent"
        >
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{selectedChurch?.name || "Select church..."}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search church..." />
          <CommandList>
            <CommandEmpty>No church found.</CommandEmpty>
            <CommandGroup>
              {churches.map((church, idx) => (
                <CommandItem
                  key={church.id + '-' + idx}
                  value={church.name}
                  onSelect={() => {
                    setSelectedChurch(church)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedChurch?.id === church.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{church.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {church.city}, {church.country}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
