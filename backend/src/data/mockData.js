const { v4: uuidv4 } = require('uuid');

const empresas = [
  { id: 'techcorp', nombre: 'TechCorp Industries', direccion: 'Av. Industrial 1234, CDMX', telefono: '+52 55 1234 5678', email: 'contacto@techcorp.com', logo: 'https://via.placeholder.com/150/2C3E50/FFFFFF?text=TechCorp', activa: true },
  { id: 'mercurio', nombre: 'Grupo Mercurio', direccion: 'Blvd. Corporativo 567, Monterrey', telefono: '+52 81 8765 4321', email: 'admin@mercurio.com', logo: 'https://via.placeholder.com/150/8E44AD/FFFFFF?text=Mercurio', activa: true },
  { id: 'valhalla', nombre: 'Valhalla Security', direccion: 'Av. Seguridad 999, Guadalajara', telefono: '+52 33 5555 9999', email: 'ops@valhalla.mx', logo: 'https://via.placeholder.com/150/C0392B/FFFFFF?text=Valhalla', activa: true }
];

const roles = [
  { id: 'admin', nombre: 'Administrador', color: '#6366F1', permisos: ['todos'] },
  { id: 'supervisor', nombre: 'Supervisor', color: '#F59E0B', permisos: ['ver_usuarios', 'ver_alertas', 'gestionar_equipos'] },
  { id: 'recepcion', nombre: 'Recepcionista', color: '#10B981', permisos: ['ver_agenda', 'crear_citas', 'ver_solicitudes'] },
  { id: 'guardia', nombre: 'Guardia', color: '#3B82F6', permisos: ['ver_agenda', 'reportar_incidencias', 'checkin'] }
];

const zonas = [
  { id: 'zona-a', nombre: 'Zona A - Perímetro Norte', ubicacion: 'Norte', empresaId: 'techcorp', lat: 19.4326, lng: -99.1332, color: '#EF4444', tipo: 'exterior', capacidad: 10 },
  { id: 'zona-b', nombre: 'Zona B - Interior', ubicacion: 'Centro', empresaId: 'techcorp', lat: 19.4327, lng: -99.1333, color: '#3B82F6', tipo: 'interior', capacidad: 20 },
  { id: 'recepcion', nombre: 'Recepción Principal', ubicacion: 'Principal', empresaId: 'techcorp', lat: 19.4328, lng: -99.1334, color: '#10B981', tipo: 'interior', capacidad: 5 },
  { id: 'zona-c', nombre: 'Zona C - Estacionamiento', ubicacion: 'Sur', empresaId: 'techcorp', lat: 19.4325, lng: -99.1331, color: '#F59E0B', tipo: 'exterior', capacidad: 15 },
  { id: 'bodega', nombre: 'Bodega Central', ubicacion: 'Este', empresaId: 'techcorp', lat: 19.4329, lng: -99.1330, color: '#8B5CF6', tipo: 'interior', capacidad: 8 },
  { id: 'zona-m-1', nombre: 'Edificio Principal', ubicacion: 'Central', empresaId: 'mercurio', lat: 25.6866, lng: -100.3161, color: '#EC4899', tipo: 'interior', capacidad: 30 },
  { id: 'zona-m-2', nombre: 'Planta de Producción', ubicacion: 'Norte', empresaId: 'mercurio', lat: 25.6867, lng: -100.3162, color: '#EF4444', tipo: 'industrial', capacidad: 25 }
];

const usuarios = [
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'admin', password: 'Admin123*', nombre: 'Carlos Mendoza', rol: 'admin', email: 'admin@techcorp.com', telefono: '+52 55 1111 1111', zona: null, estado: 'active', foto: 'https://i.pravatar.cc/150?u=admin', fechaAlta: '2024-01-15T08:00:00Z', ultimoAcceso: new Date().toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'supervisor', password: 'Super123*', nombre: 'Patricia Ruiz', rol: 'supervisor', email: 'supervisor@techcorp.com', telefono: '+52 55 2222 2222', zona: null, estado: 'active', foto: 'https://i.pravatar.cc/150?u=supervisor', fechaAlta: '2024-02-01T09:00:00Z', ultimoAcceso: new Date(Date.now() - 3600000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'jperez', password: 'Guardia123*', nombre: 'Juan Ramírez', rol: 'guardia', email: 'jperez@techcorp.com', telefono: '+52 55 3333 3333', zona: 'zona-a', estado: 'active', foto: 'https://i.pravatar.cc/150?u=jperez', fechaAlta: '2024-03-10T07:00:00Z', ultimoAcceso: new Date(Date.now() - 7200000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'asanchez', password: 'Guardia123*', nombre: 'Ana Sánchez', rol: 'guardia', email: 'asanchez@techcorp.com', telefono: '+52 55 4444 4444', zona: 'zona-b', estado: 'busy', foto: 'https://i.pravatar.cc/150?u=asanchez', fechaAlta: '2024-03-15T07:00:00Z', ultimoAcceso: new Date(Date.now() - 1800000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'lgarcia', password: 'Recep123*', nombre: 'Laura García', rol: 'recepcion', email: 'lgarcia@techcorp.com', telefono: '+52 55 5555 5555', zona: 'recepcion', estado: 'active', foto: 'https://i.pravatar.cc/150?u=lgarcia', fechaAlta: '2024-04-01T08:00:00Z', ultimoAcceso: new Date(Date.now() - 900000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'mcristina', password: 'Guardia123*', nombre: 'María Cristina', rol: 'guardia', email: 'mcristina@techcorp.com', telefono: '+52 55 6666 6666', zona: 'zona-c', estado: 'active', foto: 'https://i.pravatar.cc/150?u=mcristina', fechaAlta: '2024-04-15T19:00:00Z', ultimoAcceso: new Date(Date.now() - 10800000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'plopez', password: 'Guardia123*', nombre: 'Pedro López', rol: 'guardia', email: 'plopez@techcorp.com', telefono: '+52 55 7777 7777', zona: 'bodega', estado: 'offline', foto: 'https://i.pravatar.cc/150?u=plopez', fechaAlta: '2024-05-01T19:00:00Z', ultimoAcceso: new Date(Date.now() - 86400000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'rdiaz', password: 'Recep123*', nombre: 'Roberto Díaz', rol: 'recepcion', email: 'rdiaz@techcorp.com', telefono: '+52 55 8888 8888', zona: 'recepcion', estado: 'active', foto: 'https://i.pravatar.cc/150?u=rdiaz', fechaAlta: '2024-05-10T08:00:00Z', ultimoAcceso: new Date(Date.now() - 2700000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'mhernandez', password: 'Guardia123*', nombre: 'Miguel Hernández', rol: 'guardia', email: 'mhernandez@techcorp.com', telefono: '+52 55 9999 9999', zona: 'zona-a', estado: 'active', foto: 'https://i.pravatar.cc/150?u=mhernandez', fechaAlta: '2024-06-01T07:00:00Z', ultimoAcceso: new Date(Date.now() - 5400000).toISOString() },
  { id: uuidv4(), empresaId: 'techcorp', usuario: 'jflores', password: 'Guardia123*', nombre: 'José Flores', rol: 'guardia', email: 'jflores@techcorp.com', telefono: '+52 55 1010 1010', zona: 'zona-b', estado: 'busy', foto: 'https://i.pravatar.cc/150?u=jflores', fechaAlta: '2024-06-15T19:00:00Z', ultimoAcceso: new Date(Date.now() - 3600000).toISOString() },
  { id: uuidv4(), empresaId: 'mercurio', usuario: 'admin2', password: 'Admin123*', nombre: 'Sofia Benítez', rol: 'admin', email: 'admin@mercurio.com', telefono: '+52 81 1000 1000', zona: null, estado: 'active', foto: 'https://i.pravatar.cc/150?u=admin2', fechaAlta: '2024-01-20T08:00:00Z', ultimoAcceso: new Date(Date.now() - 7200000).toISOString() },
  { id: uuidv4(), empresaId: 'mercurio', usuario: 'guard1', password: 'Guardia123*', nombre: 'Luis Martínez', rol: 'guardia', email: 'guard1@mercurio.com', telefono: '+52 81 2000 2000', zona: 'zona-m-1', estado: 'active', foto: 'https://i.pravatar.cc/150?u=guard1', fechaAlta: '2024-07-01T07:00:00Z', ultimoAcceso: new Date(Date.now() - 1800000).toISOString() },
  { id: uuidv4(), empresaId: 'mercurio', usuario: 'guard2', password: 'Guardia123*', nombre: 'Diana Torres', rol: 'guardia', email: 'guard2@mercurio.com', telefono: '+52 81 3000 3000', zona: 'zona-m-2', estado: 'active', foto: 'https://i.pravatar.cc/150?u=guard2', fechaAlta: '2024-07-15T19:00:00Z', ultimoAcceso: new Date(Date.now() - 5400000).toISOString() }
];

const equipos = [
  { id: 'eq-techcorp-manana', nombre: 'Turno Matutino TechCorp', empresaId: 'techcorp', turno: 'matutino', zona: null, miembros: usuarios.filter(u => u.empresaId === 'techcorp' && u.rol === 'guardia' && ['zona-a', 'zona-b'].includes(u.zona)).map(u => u.id), horarioInicio: '06:00', horarioFin: '14:00' },
  { id: 'eq-techcorp-tarde', nombre: 'Turno Vespertino TechCorp', empresaId: 'techcorp', turno: 'vespertino', zona: null, miembros: usuarios.filter(u => u.empresaId === 'techcorp' && u.rol === 'guardia' && ['zona-c', 'bodega'].includes(u.zona)).map(u => u.id), horarioInicio: '14:00', horarioFin: '22:00' },
  { id: 'eq-techcorp-noche', nombre: 'Turno Nocturno TechCorp', empresaId: 'techcorp', turno: 'nocturno', zona: null, miembros: usuarios.filter(u => u.empresaId === 'techcorp' && u.rol === 'guardia').map(u => u.id).slice(0, 2), horarioInicio: '22:00', horarioFin: '06:00' },
  { id: 'eq-mercurio-manana', nombre: 'Turno Matutino Mercurio', empresaId: 'mercurio', turno: 'matutino', zona: null, miembros: usuarios.filter(u => u.empresaId === 'mercurio').map(u => u.id), horarioInicio: '06:00', horarioFin: '14:00' },
  { id: 'eq-mercurio-tarde', nombre: 'Turno Vespertino Mercurio', empresaId: 'mercurio', turno: 'vespertino', zona: null, miembros: [], horarioInicio: '14:00', horarioFin: '22:00' }
];

const generateMensajes = () => {
  const contenidos = [
    { remitente: 'jperez', destinatario: 'admin', contenido: 'Buenos días, reporte de movimiento inusual en el perímetro norte.', leido: false },
    { remitente: 'admin', destinatario: 'jperez', contenido: 'Recibido. ¿Puedes confirmar si hay personas no autorizadas?', leido: true },
    { remitente: 'jperez', destinatario: 'admin', contenido: 'Confirmado. Dos personas sospechosas cerca de la cerca perimetral.', leido: true },
    { remitente: 'asanchez', destinatario: 'supervisor', contenido: 'Reporte: Acceso de visitante en recepción autorizado.', leido: false },
    { remitente: 'mcristina', destinatario: 'admin', contenido: 'Alerta: Sensor de movimiento activado en zona de bodega.', leido: false },
    { remitente: 'lgarcia', destinatario: 'admin', contenido: 'Cita programada para las 14:00 hrs confirmada.', leido: true },
    { remitente: 'plopez', destinatario: 'supervisor', contenido: 'Check-in realizado en Zona C - Estacionamiento.', leido: true },
    { remitente: 'admin', destinatario: 'asanchez', contenido: 'Por favor revisar cámaras del sector norte.', leido: false },
    { remitente: 'mhernandez', destinatario: 'admin', contenido: 'Incidente reportado: Vehículo sospechoso en zona de carga.', leido: false },
    { remitente: 'jflores', destinatario: 'supervisor', contenido: 'Patrulla completada sin incidentes.', leido: true },
    { remitente: 'admin', destinatario: 'mhernandez', contenido: 'Buen trabajo en el reporte. Continúen pendientes.', leido: true },
    { remitente: 'guard1', destinatario: 'admin2', contenido: 'Inicio de turno en Edificio Principal.', leido: true },
    { remitente: 'admin2', destinatario: 'guard1', contenido: 'Confirmado. Revisen las cámaras del perímetro.', leido: false },
    { remitente: 'lgarcia', destinatario: 'rdiaz', contenido: 'Cambio de turno en recepción. Todo en orden.', leido: true }
  ];

  return contenidos.map((msg, index) => {
    const remitente = usuarios.find(u => u.usuario === msg.remitente);
    const destinatario = usuarios.find(u => u.usuario === msg.destinatario);
    return {
      id: uuidv4(),
      remitenteId: remitente?.id,
      destinatarioId: destinatario?.id,
      contenido: msg.contenido,
      timestamp: new Date(Date.now() - (index * 600000)).toISOString(),
      leido: msg.leido
    };
  }).filter(m => m.remitenteId && m.destinatarioId);
};

const mensajes = generateMensajes();

const alertas = [
  { tipo: 'movimiento', ubicacion: 'zona-a', descripcion: 'Movimiento sospechoso detectado en perímetro norte', severidad: 'alta', estado: 'active' },
  { tipo: 'acceso', ubicacion: 'recepcion', descripcion: 'Intento de acceso con credencial inválida', severidad: 'media', estado: 'resolved' },
  { tipo: 'incendio', ubicacion: 'zona-b', descripcion: 'Alarma de humo activada en área de servidores', severidad: 'critica', estado: 'resolved' },
  { tipo: 'intrusion', ubicacion: 'zona-c', descripcion: 'Cerca perimetral vulnerada en sector oeste', severidad: 'alta', estado: 'active' },
  { tipo: 'equipo', ubicacion: 'bodega', descripcion: 'Fallo de comunicación en cámara de seguridad #12', severidad: 'baja', estado: 'resolved' },
  { tipo: 'movimiento', ubicacion: 'zona-a', descripcion: 'Detección de movimiento en zona restringida', severidad: 'media', estado: 'active' },
  { tipo: 'acceso', ubicacion: 'recepcion', descripcion: 'Acceso no autorizado a área de oficinas', severidad: 'alta', estado: 'active' },
  { tipo: 'emergencia', ubicacion: 'zona-b', descripcion: 'Solicitud de emergencia médica en recepción', severidad: 'critica', estado: 'resolved' }
].map((alerta, index) => ({
  id: uuidv4(),
  tipo: alerta.tipo,
  ubicacion: alerta.ubicacion,
  descripcion: alerta.descripcion,
  severidad: alerta.severidad,
  usuarioId: usuarios[Math.floor(Math.random() * usuarios.length)].id,
  timestamp: new Date(Date.now() - (index * 3600000)).toISOString(),
  estado: alerta.estado,
  evidencia: alerta.severidad === 'alta' || alerta.severidad === 'critica' ? `https://picsum.photos/seed/${index}/400/300` : null
}));

const checkins = Array.from({ length: 40 }, (_, i) => ({
  id: uuidv4(),
  usuarioId: usuarios[Math.floor(Math.random() * usuarios.length)].id,
  zona: zonas.filter(z => z.empresaId === 'techcorp')[Math.floor(Math.random() * 5)].id,
  timestamp: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000).toISOString(),
  lat: 19.4326 + (Math.random() - 0.5) * 0.01,
  lng: -99.1332 + (Math.random() - 0.5) * 0.01,
  notas: Math.random() > 0.7 ? 'Todo en orden' : null
})).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

const metricasAws = {
  ec2: { actual: 4, maximo: 10, instancia: 't3.medium', costo: 125.50 },
  rds: { actual: 45, maximo: 100, tipo: 'db.t3.medium', costo: 85.00 },
  s3: { actual: 23.5, maximo: 50, objetos: 1250, costo: 12.30 },
  cloudwatch: { metricas: 45, alarma: 8, costo: 35.00 },
  lambda: { invocaciones: 15420, costo: 2.50 },
  vpn: { conexiones: 2, uptime: 99.9 }
};

const costosAws = [
  { servicio: 'EC2', costo: 125.50, descripcion: '4 instancias en ejecución' },
  { servicio: 'RDS', costo: 85.00, descripcion: '1 instancia db.t3.medium' },
  { servicio: 'S3', costo: 12.30, descripcion: '23.5 GB almacenamiento' },
  { servicio: 'CloudWatch', costo: 35.00, descripcion: 'Monitoreo y alertas' },
  { servicio: 'Lambda', costo: 2.50, descripcion: '15,420 invocaciones' },
  { servicio: 'VPN', costo: 0.00, descripcion: 'Incluido en free tier' }
];

const visitas = [
  { id: uuidv4(), nombre: 'Roberto Jiménez', empresa: 'Proveedor ABC', fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), hora: '10:00', motivo: 'Entrega de mercancía', zona: 'recepcion', estado: 'confirmada', empresaId: 'techcorp' },
  { id: uuidv4(), nombre: 'Carmen López', empresa: 'Cliente', fecha: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), hora: '14:00', motivo: 'Reunión de negocios', zona: 'recepcion', estado: 'pendiente', empresaId: 'techcorp' },
  { id: uuidv4(), nombre: 'Fernando Díaz', empresa: 'Mantenimiento Tech', fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), hora: '09:00', motivo: 'Servicio de aire acondicionado', zona: 'zona-b', estado: 'completada', empresaId: 'techcorp' },
  { id: uuidv4(), nombre: 'María González', empresa: 'Auditoría Externa', fecha: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), hora: '08:00', motivo: 'Auditoría trimestral', zona: 'recepcion', estado: 'confirmada', empresaId: 'techcorp' },
  { id: uuidv4(), nombre: 'Carlos Ruiz', empresa: 'Proveedor XYZ', fecha: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), hora: '11:30', motivo: 'Inspección de seguridad', zona: 'zona-c', estado: 'pendiente', empresaId: 'techcorp' }
];

const incidentes = [
  { id: uuidv4(), tipo: 'robo', descripcion: 'Intento de hurto en zona de estacionamiento', fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), estado: 'investigacion', ubicacion: 'zona-c', evidencia: 'https://picsum.photos/seed/inc1/400/300', empresaId: 'techcorp' },
  { id: uuidv4(), tipo: 'accidente', descripcion: 'Colisión de vehículo en entrada principal', fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), estado: 'cerrado', ubicacion: 'recepcion', evidencia: null, empresaId: 'techcorp' },
  { id: uuidv4(), tipo: 'emergencia', descripcion: 'Desmayo de empleado en área de trabajo', fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), estado: 'resuelto', ubicacion: 'zona-b', evidencia: null, empresaId: 'techcorp' },
  { id: uuidv4(), tipo: 'vandalismo', descripcion: 'Daños a propiedad en perímetro sur', fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), estado: 'cerrado', ubicacion: 'zona-a', evidencia: 'https://picsum.photos/seed/inc4/400/300', empresaId: 'techcorp' }
];

const reportes = [
  { id: uuidv4(), titulo: 'Reporte Semanal de Seguridad', fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'semanal', resumen: 'Sin incidentes mayores. 15 alertas procesadas. 45 check-ins registrados.', autor: 'Carlos Mendoza', empresaId: 'techcorp' },
  { id: uuidv4(), titulo: 'Resumen Mensual Junio', fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'mensual', resumen: '45 check-ins registrados, 3 incidentes menores, 8 alertas resueltas.', autor: 'Patricia Ruiz', empresaId: 'techcorp' },
  { id: uuidv4(), titulo: 'Auditoría de Zonas', fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'auditoria', resumen: 'Todas las zonas operando con cobertura del 85%.', autor: 'Carlos Mendoza', empresaId: 'techcorp' }
];

module.exports = {
  empresas,
  roles,
  zonas,
  usuarios,
  equipos,
  mensajes,
  alertas,
  checkins,
  metricasAws,
  costosAws,
  visitas,
  incidentes,
  reportes
};