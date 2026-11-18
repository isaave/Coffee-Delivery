import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { CartSummary } from '@/components/CartSummary'
import { FormField } from '@/components/FormField'
import { products } from '@/data/products'
import { useCart } from '@/hooks/useCart'
import { useCep } from '@/hooks/useCep'
import {
  checkoutSchema,
  type CheckoutSchemaValues,
} from '@/schemas/checkoutSchema'
import { PAYMENT_METHODS } from '@/types/checkout'
import { buildOrder, saveOrder } from '@/utils/order'
import { getShippingInCents } from '@/utils/shipping'
import { calculateTotals } from '@/utils/totals'
import './CheckoutPage.css'

export function CheckoutPage() {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()
  const { status, error: cepError, lookup } = useCep()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutSchemaValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  })

  const shippingInCents = getShippingInCents(watch('state'))
  const totals = calculateTotals(items, products, shippingInCents)

  async function handleCepLookup() {
    const address = await lookup(watch('cep'))
    if (!address) return

    setValue('street', address.street, { shouldValidate: true })
    setValue('neighborhood', address.neighborhood, { shouldValidate: true })
    setValue('city', address.city, { shouldValidate: true })
    setValue('state', address.state, { shouldValidate: true })
  }

  function onSubmit(values: CheckoutSchemaValues) {
    // Guarda dupla: a UI já esconde o formulário, mas o reducer pode mudar.
    if (items.length === 0) return

    saveOrder(buildOrder(items, products, values))
    clearCart()
    navigate('/success', { replace: true })
  }

  if (items.length === 0) {
    return (
      <main className="container checkout">
        <h1 className="checkout__title">Finalizar pedido</h1>
        <div className="checkout__empty" role="status">
          <p>Seu carrinho está vazio. Escolha seus cafés antes de continuar.</p>
          <Link className="checkout__back" to="/">
            Voltar ao catálogo
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container checkout">
      <h1 className="checkout__title">Finalizar pedido</h1>

      <div className="checkout__layout">
        <form
          id="checkout-form"
          className="checkout__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <section className="checkout__section">
            <h2>Seus dados</h2>
            <FormField id="name" label="Nome completo" error={errors.name?.message}>
              <input
                id="name"
                autoComplete="name"
                placeholder="Como podemos te chamar?"
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
            </FormField>
            <FormField id="email" label="E-mail" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
            </FormField>
          </section>

          <section className="checkout__section">
            <h2>Endereço de entrega</h2>

            <div className="checkout__cep">
              <FormField id="cep" label="CEP" error={errors.cep?.message}>
                <input
                  id="cep"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={9}
                  placeholder="00000-000"
                  aria-invalid={Boolean(errors.cep)}
                  {...register('cep')}
                />
              </FormField>
              <button
                type="button"
                className="checkout__cep-button"
                onClick={handleCepLookup}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <LoaderCircle size={18} className="checkout__spin" aria-hidden="true" />
                ) : (
                  <MapPin size={18} aria-hidden="true" />
                )}
                Buscar
              </button>
            </div>

            <p className="checkout__cep-status" role="status" aria-live="polite">
              {status === 'loading' && 'Buscando endereço...'}
              {status === 'success' && 'Endereço encontrado.'}
              {status === 'error' && cepError}
            </p>

            <div className="checkout__grid">
              <FormField
                id="street"
                label="Rua"
                error={errors.street?.message}
                className="checkout__span-2"
              >
                <input
                  id="street"
                  autoComplete="address-line1"
                  placeholder="Avenida, rua..."
                  aria-invalid={Boolean(errors.street)}
                  {...register('street')}
                />
              </FormField>
              <FormField id="number" label="Número" error={errors.number?.message}>
                <input
                  id="number"
                  inputMode="numeric"
                  placeholder="248"
                  aria-invalid={Boolean(errors.number)}
                  {...register('number')}
                />
              </FormField>
              <FormField id="complement" label="Complemento" error={errors.complement?.message}>
                <input
                  id="complement"
                  placeholder="Opcional"
                  aria-invalid={Boolean(errors.complement)}
                  {...register('complement')}
                />
              </FormField>
              <FormField
                id="neighborhood"
                label="Bairro"
                error={errors.neighborhood?.message}
              >
                <input
                  id="neighborhood"
                  autoComplete="address-level3"
                  placeholder="Seu bairro"
                  aria-invalid={Boolean(errors.neighborhood)}
                  {...register('neighborhood')}
                />
              </FormField>
              <FormField id="city" label="Cidade" error={errors.city?.message}>
                <input
                  id="city"
                  autoComplete="address-level2"
                  placeholder="Sua cidade"
                  aria-invalid={Boolean(errors.city)}
                  {...register('city')}
                />
              </FormField>
              <FormField id="state" label="UF" error={errors.state?.message}>
                <input
                  id="state"
                  maxLength={2}
                  autoComplete="address-level1"
                  placeholder="SP"
                  aria-invalid={Boolean(errors.state)}
                  {...register('state')}
                />
              </FormField>
            </div>
          </section>

          <section className="checkout__section">
            <h2>Forma de pagamento</h2>
            <fieldset className="checkout__payment">
              <legend>Selecione uma opção</legend>
              {PAYMENT_METHODS.map((method) => (
                <label className="checkout__payment-option" key={method.value}>
                  <input type="radio" value={method.value} {...register('paymentMethod')} />
                  <span>{method.label}</span>
                </label>
              ))}
            </fieldset>
            {errors.paymentMethod?.message && (
              <p className="form-field__error" role="alert">
                {errors.paymentMethod.message}
              </p>
            )}
          </section>
        </form>

        <CartSummary totals={totals} disabled={isSubmitting} />
      </div>
    </main>
  )
}
