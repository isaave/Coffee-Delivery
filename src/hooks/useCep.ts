import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CepError,
  fetchAddress,
  isValidCep,
  normalizeCep,
  type CepAddress,
} from '@/utils/cep'

export type CepStatus = 'idle' | 'loading' | 'success' | 'error'

/** Encapsula efeito, abort e estados da consulta (RF-06). */
export function useCep() {
  const [status, setStatus] = useState<CepStatus>('idle')
  const [data, setData] = useState<CepAddress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [])

  const lookup = useCallback(async (rawCep: string): Promise<CepAddress | null> => {
    controllerRef.current?.abort()

    if (!isValidCep(rawCep)) {
      setStatus('error')
      setError('Informe um CEP válido com 8 dígitos.')
      return null
    }

    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('loading')
    setError(null)

    try {
      const address = await fetchAddress(normalizeCep(rawCep), controller.signal)
      if (!mountedRef.current || controller.signal.aborted) return null
      setData(address)
      setStatus('success')
      return address
    } catch (cause) {
      if (
        controller.signal.aborted ||
        (cause instanceof Error && cause.name === 'AbortError')
      ) {
        return null
      }
      setStatus('error')
      setError(
        cause instanceof CepError
          ? cause.message
          : 'Não foi possível consultar o CEP.',
      )
      return null
    }
  }, [])

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    setStatus('idle')
    setData(null)
    setError(null)
  }, [])

  return { status, data, error, lookup, reset }
}
