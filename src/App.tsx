import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from '@/components/Header'
import { CartProvider } from '@/contexts/CartProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { CatalogPage } from '@/pages/CatalogPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { SuccessPage } from '@/pages/SuccessPage'

/** Camada fina: apenas provedores, layout e rotas. */
export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  )
}
