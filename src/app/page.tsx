import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (

    <div
      className="min-h-screen bg-[url('/img/Fondo.png')] bg-cover bg-center flex flex-col items-center justify-center px-6"
    >
      <Navbar />
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Título */}
        <h1 className="text-4xl font-bold text-white text-center mb-5">
          Bienvenido a <span className="text-blue-300">AquaSave</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-200 mt-5 text-lg text-center max-w-xl">
          Mide tu consumo de agua, descubre cuánto puedes ahorrar  y ayuda al planeta .
        </p>

        {/* Botones */}
        <div className="mt-8 flex gap-4">
          <a
            href="/auth/login"
            className="bg-blue-400 border border-black text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition"
          >
            Comenzar ahora
          </a>
          <a
            href="/sobre"
            className="bg-blue-400 border border-black text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition"
          >
            Saber más
          </a>
        </div>
        <h6 className="mt-5">Haz click en "Comenzar ahora" para unirte </h6>
      </div>
    </div>
  );
}
