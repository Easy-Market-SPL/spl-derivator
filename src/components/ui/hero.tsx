import Image from 'next/image';
import { Fade, Slide } from 'react-awesome-reveal';

function Hero() {
  return (
    <div
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
            src="/images/logo.png"
            alt="Conveyor illustration"
            width={800}
            height={500}
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
      </div>
  );
}

export default Hero;