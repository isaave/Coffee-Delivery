import { Coffee, Package, ShoppingCart, Timer } from 'lucide-react'
import './Hero.css'

const benefits = [
  { icon: ShoppingCart, text: 'Compra simples e segura', tone: 'yellow-dark' },
  { icon: Timer, text: 'Embalagem mantém o café intacto', tone: 'text' },
  { icon: Package, text: 'Entrega rápida e rastreada', tone: 'yellow' },
  { icon: Coffee, text: 'O café chega fresquinho até você', tone: 'primary' },
] as const

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__content">
        <div className="hero__copy">
          <h1 id="hero-title">
            Encontre o café perfeito
            <br />
            para qualquer hora do dia
          </h1>
          <p>
            Com o Coffee Delivery você recebe seu café onde estiver, a qualquer
            hora
          </p>

          <ul className="hero__benefits">
            {benefits.map(({ icon: Icon, text, tone }) => (
              <li className="hero__benefit" key={text}>
                <span className={`hero__benefit-icon hero__benefit-icon--${tone}`}>
                  <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <img
          className="hero__image"
          src="/images/coffee/hero-cup.png"
          alt=""
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
