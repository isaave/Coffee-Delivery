import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import './ThemeToggle.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {isDark ? (
        <Sun size={20} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Moon size={20} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  )
}
