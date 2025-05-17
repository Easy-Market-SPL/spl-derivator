/*
  EasyMarket – Single‑Page Application (Next.js 14 / React 18)
  ----------------------------------------------------------------
  📦  Dependencies (add to package.json):
      "next": "latest",
      "react": "latest",
      "react-dom": "latest",
      "react-awesome-reveal": "^4",
      "tailwindcss": "latest"

  ✨  Tailwind setup is assumed (postcss + autoprefixer). See https://tailwindcss.com/docs/guides/nextjs
      for the two‑minute install.

  ----------------------------------------------------------------
  The code below lives in `/app/page.tsx` (Next.js 14 `app/` router) or in
  `/pages/index.tsx` if you are using the pages router – it works in either case.
  ----------------------------------------------------------------
*/

'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Fade, Slide } from 'react-awesome-reveal';

interface ChecklistItem {
  id: string;
  label: string;
  requires?: string[];   // IDs that must be checked first
  disables?: string[];   // IDs that will be disabled if this is checked
}

const checklistData: ChecklistItem[] = [
  { id: 'gui-web', label: 'GUI Web' },
  { id: 'gui-mobile', label: 'GUI Móvil' },
  { id: 'auth-email', label: 'Autenticación por email' },
  { id: 'auth-third', label: 'Autenticación con terceros', requires: ['auth-email'] },
  { id: 'catalog-search', label: 'Búsqueda de bienes' },
  { id: 'catalog-filter', label: 'Filtrado de bienes', requires: ['catalog-search'] },
  { id: 'orders-tracking', label: 'Seguimiento de órdenes' },
  { id: 'orders-notify', label: 'Notificaciones de cambios', requires: ['orders-tracking'] },
  { id: 'realtime-track', label: 'Seguimiento en tiempo real', requires: ['orders-tracking'], disables: ['orders-notify'] },
  { id: 'payments-card', label: 'Pago con tarjeta' },
  { id: 'payments-cash', label: 'Pago en efectivo' }
];

function useHeaderVisibility(heroRef: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [heroRef]);

  return visible;
}

function Header({ show }: { show: boolean }) {
  return (
    <header
      className={`z-50 w-full top-0 transition-transform duration-300 ${
        show ? 'fixed backdrop-blur-md bg-white/80 shadow-md' : 'absolute'
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center gap-3 px-6 py-3">
        {/* Logo */}
        <Image src="/logo.svg" alt="EasyMarket logo" width={40} height={40} />
        <span className="font-extrabold text-xl text-blue-900">EasyMarket</span>
      </div>
    </header>
  );
}

function Checklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleToggle = (item: ChecklistItem) => {
    setChecked(prev => {
      const newState = { ...prev };
      const newValue = !prev[item.id];

      // enforce requires
      if (newValue && item.requires) {
        const unmet = item.requires.find(req => !prev[req]);
        if (unmet) {
          alert('Este elemento requiere seleccionar primero: ' + unmet);
          return prev;
        }
      }

      newState[item.id] = newValue;

      // enforce disables
      if (item.disables) {
        item.disables.forEach(dis => (newState[dis] = false));
      }

      return newState;
    });
  };

  return (
    <Fade cascade damping={0.12} triggerOnce>
      <ul className="space-y-2">
        {checklistData.map(item => {
          const disabled =
            !!item.requires?.find(req => !checked[req]) || // disabled until requirements met
            !!item.disables?.find(dis => checked[item.id]); // already handled but keep greyed
          return (
            <li key={item.id} className="flex items-center gap-3">
              <input
                id={item.id}
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                checked={!!checked[item.id]}
                disabled={disabled}
                onChange={() => handleToggle(item)}
              />
              <label htmlFor={item.id} className="select-none text-gray-800">
                {item.label}
              </label>
            </li>
          );
        })}
      </ul>
    </Fade>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const showHeader = useHeaderVisibility(heroRef);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center pt-24 md:pt-32 pb-32 bg-white"
      >
        <Fade direction="down" triggerOnce>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            ¡Bienvenido a <span className="text-blue-800 italic">EasyMarket</span>!
          </h1>
        </Fade>
        <Fade delay={200} triggerOnce>
          <p className="max-w-xl mt-4 text-lg md:text-xl text-gray-600">
            Una solución para gestionar el proceso de ventas en tu empresa. Fácil y a tu manera.
          </p>
        </Fade>
        {/* conveyor illustration */}
        <Slide direction="up" damping={0.1} triggerOnce>
          <Image
            src="/conveyor.svg"
            alt="Conveyor illustration"
            width={500}
            height={200}
            className="mt-10"
          />
        </Slide>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {[
            'Gestiona tu catálogo',
            'Recibe y sigue tus órdenes',
            'Conoce mejor a tus clientes'
          ].map(text => (
            <Fade key={text} delay={400} triggerOnce>
              <button className="w-full px-6 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl shadow-md transition-colors">
                {text}
              </button>
            </Fade>
          ))}
        </div>
        <Fade delay={600} triggerOnce>
          <p className="mt-16 text-blue-600 font-semibold text-xl">Crea tu app ahora</p>
        </Fade>

        {/* down arrow */}
        <Slide direction="down" delay={800} triggerOnce>
          <svg
            className="mt-4 h-8 w-8 text-gray-400 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </Slide>
      </section>

      {/* Sticky Header */}
      <Header show={showHeader} />

      {/* Checklist section */}
      <section className="flex-1 bg-gray-50 py-24 px-6">
        <div className="max-w-screen-lg mx-auto">
          <Slide direction="left" triggerOnce>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Personaliza tu EasyMarketSPL</h2>
          </Slide>
          <Checklist />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6">
        <p className="text-sm">© {new Date().getFullYear()} EasyMarket – Todos los derechos reservados</p>
      </footer>
    </main>
  );
}
