import { z } from 'zod'
import {
  PAYMENT_METHODS,
  type PaymentMethod,
} from '@/types/checkout'

const paymentValues = PAYMENT_METHODS.map(
  (method) => method.value,
) as [PaymentMethod, ...PaymentMethod[]]

/** Fonte única de validação do formulário de checkout (RF-08). */
export const checkoutSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo.'),
  email: z.email('Informe um e-mail válido.'),
  // Aceita o CEP digitado com máscara (00000-000) ou apenas com dígitos.
  cep: z
    .string()
    .refine(
      (value) => /^\d{8}$/.test(value.replace(/\D/g, '')),
      'Informe um CEP com 8 dígitos.',
    ),
  street: z.string().trim().min(2, 'Informe a rua.'),
  number: z.string().trim().min(1, 'Informe o número.'),
  complement: z
    .string()
    .trim()
    .max(60, 'Use no máximo 60 caracteres.'),
  neighborhood: z.string().trim().min(2, 'Informe o bairro.'),
  city: z.string().trim().min(2, 'Informe a cidade.'),
  state: z
    .string()
    .regex(/^[A-Z]{2}$/, 'Informe a UF com 2 letras maiúsculas.'),
  paymentMethod: z.enum(paymentValues, {
    message: 'Selecione uma forma de pagamento.',
  }),
})

export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>
