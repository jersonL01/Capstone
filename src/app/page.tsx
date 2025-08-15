import Image from "next/image";

export default function Home() {
  return (
     <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Image
        src="/img/logo.png" // Coloca tu logo en /public/logo.svg
        alt="Logo de la app"
        width={100}
        height={100}
        className="mb-6"
      />

      {/* Título */}
      <h1 className="text-4xl font-bold text-blue-700 text-center">
        Bienvenido a <span className="text-blue-500">AquaSave</span>
      </h1>

      {/* Subtítulo */}
      <p className="text-gray-600 mt-4 text-lg text-center max-w-xl">
        Mide tu consumo de agua, descubre cuánto puedes ahorrar 💧 y ayuda al planeta 🌍.
      </p>

      {/* Botones */}
      <div className="mt-8 flex gap-4">
        <a
          href="/registro"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Comenzar ahora
        </a>
        <a
          href="/sobre"
          className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition"
        >
          Saber más
        </a>
      </div>
    </div>
  );
}
