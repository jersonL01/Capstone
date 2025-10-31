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
          Pagina Administrativa de <span className="text-blue-300">AquaSave</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-200 mt-5 text-lg text-center max-w-xl">
          Mide tu consumo de agua, descubre cuánto puedes ahorrar  y ayuda al planeta .
        </p>
      </div>
    </div>
  );
}
