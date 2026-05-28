import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina dinámicamente clases de Tailwind CSS resolviendo colisiones de forma inteligente.
 * Es una dependencia fundamental para la composición de variantes en componentes de Shadcn UI.
 * 
 * @param inputs - Lista o matriz de nombres de clase opcionales, booleanos u objetos.
 * @returns Cadena limpia y optimizada de clases unificadas.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
