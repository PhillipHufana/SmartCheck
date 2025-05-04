import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="w-full bg-green-400 px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Link href="/" className="text-2xl font-bold flex items-center">
          SmartCheck
          <Check className="h-6 w-6 ml-1" />
        </Link>
      </div>
    </header>
  )
}
