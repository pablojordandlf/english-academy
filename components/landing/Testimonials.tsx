"use client";

import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Desde que comencé a usar esta plataforma, mi fluidez en inglés ha mejorado notablemente. Las conversaciones con el profesor AI son increíblemente naturales.",
      name: "Carmen Rodríguez",
      title: "Estudiante Universitaria",
      avatar: "/avatars/avatar-1.jpg"
    },
    {
      quote: "Las clases personalizadas y la retroalimentación detallada han acelerado mi aprendizaje. En solo 3 meses, pasé de nivel básico a intermedio avanzado.",
      name: "Alejandro Martínez",
      title: "Profesional de Marketing",
      avatar: "/avatars/avatar-2.jpg"
    },
    {
      quote: "Como profesional que necesita inglés para reuniones internacionales, esta plataforma ha sido fundamental. La práctica constante con diferentes acentos y vocabulario específico me ha dado mucha confianza.",
      name: "Laura Sánchez",
      title: "Gerente de Proyectos",
      avatar: "/avatars/avatar-3.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lo que dicen nuestros estudiantes
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Miles de estudiantes ya han mejorado su inglés con nuestro método
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary-500">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-100">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.title}</p>
                </div>
              </div>
              
              <blockquote className="relative">
                <span className="text-primary-500 text-4xl absolute -top-2 -left-2 opacity-50">"</span>
                <p className="text-gray-300 italic relative z-10 pl-4">{testimonial.quote}</p>
              </blockquote>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-gray-800/50 px-6 py-3 rounded-full">
              <p className="text-primary-100 font-semibold">+5,000 estudiantes activos</p>
            </div>
            <div className="bg-gray-800/50 px-6 py-3 rounded-full">
              <p className="text-primary-100 font-semibold">98% de satisfacción</p>
            </div>
            <div className="bg-gray-800/50 px-6 py-3 rounded-full">
              <p className="text-primary-100 font-semibold">4.9/5 valoración promedio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 