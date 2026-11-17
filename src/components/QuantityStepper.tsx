import { Minus, Plus } from 'lucide-react'
import './QuantityStepper.css'

interface QuantityStepperProps {
  value: number
  onChange: (update: (current: number) => number) => void
  productName: string
}

export function QuantityStepper({
  value,
  onChange,
  productName,
}: QuantityStepperProps) {
  return (
    <div
      className="quantity-stepper"
      role="group"
      aria-label={`Quantidade de ${productName}`}
    >
      <button
        type="button"
        className="quantity-stepper__button"
        onClick={() => onChange((current) => Math.max(1, current - 1))}
        disabled={value <= 1}
        aria-label={`Diminuir quantidade de ${productName}`}
      >
        <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <output className="quantity-stepper__value" aria-live="polite">
        {value}
      </output>

      <button
        type="button"
        className="quantity-stepper__button"
        onClick={() => onChange((current) => current + 1)}
        aria-label={`Aumentar quantidade de ${productName}`}
      >
        <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  )
}
