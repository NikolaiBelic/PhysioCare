const mongoose = require('mongoose');
const Paciente = require('./models/paciente');
const Fisio = require('./models/fisio');
const Expediente = require('./models/expediente');

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/gestion_clinica')
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    cargarDatos();
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

// Función para cargar datos iniciales
async function cargarDatos() {
  try {
    // Limpiar las colecciones existentes
    await Paciente.deleteMany({});
    await Fisio.deleteMany({});
    await Expediente.deleteMany({});
    
    // Crear algunos pacientes   
    const pacientes = [
        new Paciente({
            nombre: 'José',
            apellidos: 'López',
            fechaNacimiento: new Date('1985-06-15'),
            direccion: 'Calle Mayor 123, Alicante',
            numeroSeguridadSocial: '123456789'
        }),
        new Paciente({
            nombre: 'Ana',
            apellidos: 'Pérez',
            fechaNacimiento: new Date('1990-09-22'),
            direccion: 'Avenida del Sol 45, Valencia',
            numeroSeguridadSocial: '987654321'
        }),
        new Paciente({
            nombre: 'Luis',
            apellidos: 'Martínez',
            fechaNacimiento: new Date('1975-03-11'),
            direccion: 'Calle de la Luna 89, Alicante',
            numeroSeguridadSocial: '456789123'
        }),
        new Paciente({
            nombre: 'María',
            apellidos: 'Sanz',
            fechaNacimiento: new Date('1992-05-30'),
            direccion: 'Plaza Mayor 22, Valencia',
            numeroSeguridadSocial: '321654987'
        })
    ];

    // Guardar todos los pacientes usando Promise.all
    const pacientesGuardados = await Promise.all(pacientes.map(paciente => paciente.save()));
    console.log('Pacientes añadidos:', pacientesGuardados);
    
    // Crear varios fisios, al menos uno para cada especialidad
    const fisios = [
        new Fisio({
            nombre: 'Javier',
            apellidos: 'Martínez',
            especialidad: 'Deportiva',
            numeroColegiado: 'A1234567'
        }),
        new Fisio({
            nombre: 'Ainhoa',
            apellidos: 'Fernández',
            especialidad: 'Neurológica',
            numeroColegiado: 'B7654321'
        }),
        new Fisio({
            nombre: 'Mario',
            apellidos: 'Sánchez',
            especialidad: 'Pediátrica',
            numeroColegiado: 'C9876543'
        }),
        new Fisio({
            nombre: 'Andrea',
            apellidos: 'Ortega',
            especialidad: 'Pediátrica',
            numeroColegiado: 'C9876543'
        }),
        new Fisio({
            nombre: 'Ana',
            apellidos: 'Rodríguez',
            especialidad: 'Geriátrica',
            numeroColegiado: 'D6543210'
        }),
        new Fisio({
            nombre: 'Marcos',
            apellidos: 'Gómez',
            especialidad: 'Oncológica',
            numeroColegiado: 'E4321098'
        })
    ];

    // Guardar todos los fisios usando Promise.all
    const fisiosGuardados = await Promise.all(fisios.map(fisio => fisio.save()));
    console.log('Fisios añadidos:', fisiosGuardados);

    // Crear expedientes médicos con consultas
    const expedientes = [
        new Expediente({
            paciente: pacientesGuardados[0]._id,
            historialClinico: 'Paciente con antecedentes de lesiones en rodilla y cadera.',
            consultas: [
                {
                    fecha: new Date('2024-02-10'),
                    fisio: fisiosGuardados[0]._id, // Fisio de especialidad Deportiva
                    diagnostico: 'Distensión de ligamentos de la rodilla',
                    tratamiento: 'Rehabilitación con ejercicios de fortalecimiento',
                    observaciones: 'Se recomienda evitar actividad intensa por 6 semanas'
                },
                {
                    fecha: new Date('2024-03-01'),
                    fisio: fisiosGuardados[0]._id,
                    diagnostico: 'Mejoría notable, sin dolor agudo',
                    tratamiento: 'Continuar con ejercicios, añadir movilidad funcional',
                    observaciones: 'Próxima revisión en un mes'
                }
            ]
        }),
        new Expediente({
            paciente: pacientesGuardados[1]._id,
            historialClinico: 'Paciente con problemas neuromusculares.',
            consultas: [
                {
                    fecha: new Date('2024-02-15'),
                    fisio: fisiosGuardados[1]._id, // Fisio de especialidad Neurológica
                    diagnostico: 'Debilidad muscular en miembros inferiores',
                    tratamiento: 'Terapia neuromuscular y estiramientos',
                    observaciones: 'Revisar la evolución en 3 semanas'
                }
            ]
        }),
        new Expediente({
            paciente: pacientesGuardados[2]._id,
            historialClinico: 'Lesión de hombro recurrente, movilidad limitada.',
            consultas: [
                {
                    fecha: new Date('2024-01-25'),
                    fisio: fisiosGuardados[2]._id, // Fisio de especialidad Pediátrica
                    diagnostico: 'Tendinitis en el manguito rotador',
                    tratamiento: 'Ejercicios de movilidad y fortalecimiento',
                    observaciones: 'Revisar en 4 semanas'
                }
            ]
        }),
        new Expediente({
            paciente: pacientesGuardados[3]._id,
            historialClinico: 'Paciente con problemas oncológicos.',
            consultas: [
                {
                    fecha: new Date('2024-01-15'),
                    fisio: fisiosGuardados[4]._id, // Fisio de especialidad Oncológica
                    diagnostico: 'Fatiga post-tratamiento oncológico',
                    tratamiento: 'Ejercicios suaves y terapia de relajación',
                    observaciones: 'Revisión en 2 semanas'
                }
            ]
        })
    ];

    // Guardar todos los expedientes usando Promise.all
    const expedientesGuardados = await Promise.all(expedientes.map(expediente => expediente.save()));
    console.log('Expedientes añadidos:', expedientesGuardados);

    mongoose.disconnect();
    console.log('Datos cargados exitosamente y desconectado de MongoDB');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mongoose.disconnect();
    }
}
