import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Sobre() {
  return (
    <main className="relative min-h-screen text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/Fondo.png" 
          alt="Fondo AquaSave"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Contenido */}
      <section className="max-w-5xl mx-auto text-center pt-32 px-6">
        <h1 className="text-4xl font-bold mb-6">Sobre Nosotros</h1>
      </section>

      {/* Nuestra misión */}
      <section className="max-w-5xl mx-auto mb-12 px-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-3">Nuestra Misión</h2>
          <p>
            Concientizar a la población sobre la importancia del agua y 
            brindar soluciones tecnológicas accesibles para monitorear y 
            reducir el consumo, promoviendo la sostenibilidad.
          </p>
        </div>
      </section>

      {/* Nuestra visión */}
      <section className="max-w-5xl mx-auto mb-12 px-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-3">Nuestra Visión</h2>
          <p>
            Ser la plataforma líder en gestión de recursos hídricos en Chile, 
            aportando al cuidado del planeta y garantizando un futuro más 
            sustentable para las próximas generaciones.
          </p>
        </div>
      </section>

      {/* Equipo */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Nuestro Equipo</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-xl shadow-md text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Miembro del equipo"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
            />
            <h3 className="text-xl font-semibold">Juan Pérez</h3>
            <p className="text-sm">Fundador & CEO</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-md text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Miembro del equipo"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
            />
            <h3 className="text-xl font-semibold">María López</h3>
            <p className="text-sm">CTO</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-md text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Miembro del equipo"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
            />
            <h3 className="text-xl font-semibold">Carlos Díaz</h3>
            <p className="text-sm">Diseñador UX/UI</p>
          </div>
        </div>
      </section>
    </main>
  );
}
