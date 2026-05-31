import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Dynamically combines Tailwind CSS classes, resolving collisions intelligently.
 * It is a fundamental dependency for variant composition in Shadcn UI components.
 * 
 * @param inputs - List or array of optional class names, booleans, or objects.
 * @returns Clean and optimized string of unified classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
