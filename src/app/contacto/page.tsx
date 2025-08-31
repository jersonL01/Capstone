import Navbar from "../components/Navbar";

export default function Contact() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-6  bg-[url('/img/Fondo.png')]"
    >
      <Navbar />  
        
      <div className="max-w-4xl w-full bg-white bg-opacity-90 shadow-lg rounded-2xl p-8">
        {/* Título */}
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Contáctanos</h1>
        <p className="text-gray-600 text-center mb-8">
          Si tienes dudas o sugerencias, completa el formulario o comunícate con nosotros directamente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Información</h2>
            <p className="text-gray-600">📍 Dirección: Av. Siempre Viva 123, Santiago, Chile</p>
            <p className="text-gray-600">📞 Teléfono: +56 9 1234 5678</p>
            <p className="text-gray-600">✉️ Email: contacto@aquasave.cl</p>
            <p className="text-gray-600">⏰ Horario: Lunes a Viernes, 9:00 - 18:00 hrs</p>
          </div>

          {/* Formulario */}
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium " >Nombre</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Correo</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Mensaje</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
