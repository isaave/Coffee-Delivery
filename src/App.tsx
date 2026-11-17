import { Header } from '@/components/Header'
import { CartProvider } from '@/contexts/CartProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import CatalogPage from '@/pages/CatalogPage'

/** Camada fina: apenas provedores, layout e (na Tarefa 5) rotas. */
export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Header />
        <CatalogPage />
      </CartProvider>
    </ThemeProvider>
  )
}
