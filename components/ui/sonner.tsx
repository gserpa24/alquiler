"use client"

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({
  position = "bottom-right",
  richColors = true,
  theme = "light",
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      position={position}
      richColors={richColors}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4 text-emerald-600 shrink-0" />,
        info: <Info className="h-4 w-4 text-blue-600 shrink-0" />,
        warning: <TriangleAlert className="h-4 w-4 text-amber-600 shrink-0" />,
        error: <OctagonX className="h-4 w-4 text-red-600 shrink-0" />,
        loading: <LoaderCircle className="h-4 w-4 text-zinc-600 animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans shadow-lg rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 py-3 px-4",
          success:
            "!bg-emerald-50 !text-emerald-950 !border-emerald-200 dark:!bg-emerald-950 dark:!text-emerald-100 dark:!border-emerald-800",
          error:
            "!bg-red-50 !text-red-950 !border-red-200 dark:!bg-red-950 dark:!text-red-100 dark:!border-red-800",
          warning:
            "!bg-amber-50 !text-amber-950 !border-amber-200 dark:!bg-amber-950 dark:!text-amber-100 dark:!border-amber-800",
          info:
            "!bg-blue-50 !text-blue-950 !border-blue-200 dark:!bg-blue-950 dark:!text-blue-100 dark:!border-blue-800",
          description: "text-zinc-600 dark:text-zinc-400 text-xs font-normal mt-0.5",
          actionButton:
            "bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold px-3 py-1.5 rounded-md",
          cancelButton:
            "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-md",
          closeButton:
            "bg-transparent hover:bg-black/5 text-zinc-500 hover:text-zinc-800 border-none",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
