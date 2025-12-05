"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <Button
            onClick={toggleTheme}
            size="icon"
            variant="ghost"
            className="
        bg-transparent 
        hover:bg-transparent
        border border-transparent
        focus-visible:ring-0 
        focus-visible:ring-offset-0
        relative
      "
        >
            <Sun
                className="
          h-[1.2rem] w-[1.2rem]
          rotate-0 scale-100
          transition-all
          dark:-rotate-90 dark:scale-0
        "
            />

            <Moon
                className="
          absolute h-[1.2rem] w-[1.2rem]
          rotate-90 scale-0
          transition-all
          dark:rotate-0 dark:scale-100
        "
            />
        </Button>
    )
}
