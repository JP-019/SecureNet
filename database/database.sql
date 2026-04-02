-- =====================================================
-- Base de Datos: SecureNet - Sistema de Gestión de Seguridad
-- =====================================================

CREATE DATABASE SecureNetDB;
GO
USE SecureNetDB;
GO

-- =====================================================
-- ESQUEMA: CONFIGURACION
-- =====================================================
CREATE SCHEMA Config;
GO

CREATE TABLE Config.tbEmpresas(
    EmpresaId VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Direccion VARCHAR(250) NULL,
    Telefono VARCHAR(25) NULL,
    Email VARCHAR(150) NULL,
    Logo VARCHAR(500) NULL,
    Activa BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE Config.tbRoles(
    RolId VARCHAR(30) PRIMARY KEY,
    Nombre VARCHAR(80) NOT NULL,
    Color VARCHAR(20) NULL,
    Permisos VARCHAR(MAX) NULL,
    Activo BIT NOT NULL DEFAULT 1
);
GO

-- =====================================================
-- ESQUEMA: OPERACIONES
-- =====================================================
CREATE SCHEMA Operaciones;
GO

CREATE TABLE Operaciones.tbZonas(
    ZonaId VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Ubicacion VARCHAR(100) NULL,
    EmpresaId VARCHAR(50) NOT NULL,
    Latitud DECIMAL(10, 8) NULL,
    Longitud DECIMAL(11, 8) NULL,
    Color VARCHAR(20) NULL,
    Tipo VARCHAR(50) NULL,
    Capacidad INT NULL,
    Activa BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Zona_Empresa
        FOREIGN KEY (EmpresaId) REFERENCES Config.tbEmpresas(EmpresaId)
);
GO

CREATE TABLE Operaciones.tbEquipos(
    EquipoId VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    EmpresaId VARCHAR(50) NOT NULL,
    Turno VARCHAR(20) NULL,
    ZonaId VARCHAR(50) NULL,
    HorarioInicio TIME NULL,
    HorarioFin TIME NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Equipo_Empresa
        FOREIGN KEY (EmpresaId) REFERENCES Config.tbEmpresas(EmpresaId),

    CONSTRAINT FK_Equipo_Zona
        FOREIGN KEY (ZonaId) REFERENCES Operaciones.tbZonas(ZonaId)
);
GO

CREATE TABLE Operaciones.tbIncidentes(
    IncidenteId VARCHAR(50) PRIMARY KEY,
    Tipo VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(500) NOT NULL,
    Fecha DATETIME2 NOT NULL,
    Estado VARCHAR(30) NOT NULL,
    Ubicacion VARCHAR(50) NULL,
    Evidencia VARCHAR(500) NULL,
    ReportadoPor VARCHAR(50) NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE Operaciones.tbVisitas(
    VisitaId VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Empresa VARCHAR(150) NULL,
    Fecha DATETIME2 NOT NULL,
    Hora TIME NOT NULL,
    Motivo VARCHAR(300) NULL,
    ZonaId VARCHAR(50) NULL,
    Estado VARCHAR(30) NOT NULL,
    EmpresaId VARCHAR(50) NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Visita_Zona
        FOREIGN KEY (ZonaId) REFERENCES Operaciones.tbZonas(ZonaId)
);
GO

CREATE TABLE Operaciones.tbReportes(
    ReporteId VARCHAR(50) PRIMARY KEY,
    Titulo VARCHAR(200) NOT NULL,
    Fecha DATETIME2 NOT NULL,
    Tipo VARCHAR(30) NOT NULL,
    Resumen VARCHAR(MAX) NULL,
    Autor VARCHAR(150) NULL,
    EmpresaId VARCHAR(50) NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- =====================================================
-- ESQUEMA: USUARIOS
-- =====================================================
CREATE SCHEMA Usuarios;
GO

CREATE TABLE Usuarios.tbUsuarios(
    UsuarioId VARCHAR(50) PRIMARY KEY,
    EmpresaId VARCHAR(50) NOT NULL,
    NombreUsuario VARCHAR(60) NOT NULL UNIQUE,
    ClaveHash VARBINARY(256) NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    RolId VARCHAR(30) NOT NULL,
    Email VARCHAR(150) NULL,
    Telefono VARCHAR(25) NULL,
    ZonaId VARCHAR(50) NULL,
    Estado VARCHAR(20) NOT NULL DEFAULT 'offline',
    Foto VARCHAR(500) NULL,
    FechaAlta DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UltimoAcceso DATETIME2 NULL,
    Activo BIT NOT NULL DEFAULT 1,

    CONSTRAINT FK_Usuario_Empresa
        FOREIGN KEY (EmpresaId) REFERENCES Config.tbEmpresas(EmpresaId),

    CONSTRAINT FK_Usuario_Rol
        FOREIGN KEY (RolId) REFERENCES Config.tbRoles(RolId),

    CONSTRAINT FK_Usuario_Zona
        FOREIGN KEY (ZonaId) REFERENCES Operaciones.tbZonas(ZonaId)
);
GO

CREATE TABLE Usuarios.tbEquipoMiembros(
    EquipoId VARCHAR(50) NOT NULL,
    UsuarioId VARCHAR(50) NOT NULL,

    CONSTRAINT PK_EquipoMiembros
        PRIMARY KEY (EquipoId, UsuarioId),

    CONSTRAINT FK_EM_Equipo
        FOREIGN KEY (EquipoId) REFERENCES Operaciones.tbEquipos(EquipoId),

    CONSTRAINT FK_EM_Usuario
        FOREIGN KEY (UsuarioId) REFERENCES Usuarios.tbUsuarios(UsuarioId)
);
GO

-- =====================================================
-- ESQUEMA: MENSAJES
-- =====================================================
CREATE SCHEMA Mensajes;
GO

CREATE TABLE Mensajes.tbMensajes(
    MensajeId VARCHAR(50) PRIMARY KEY,
    RemitenteId VARCHAR(50) NOT NULL,
    DestinatarioId VARCHAR(50) NOT NULL,
    Contenido VARCHAR(MAX) NOT NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Leido BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_Mensaje_Remitente
        FOREIGN KEY (RemitenteId) REFERENCES Usuarios.tbUsuarios(UsuarioId),

    CONSTRAINT FK_Mensaje_Destinatario
        FOREIGN KEY (DestinatarioId) REFERENCES Usuarios.tbUsuarios(UsuarioId)
);
GO

-- =====================================================
-- ESQUEMA: ALERTAS
-- =====================================================
CREATE SCHEMA Alertas;
GO

CREATE TABLE Alertas.tbAlertas(
    AlertaId VARCHAR(50) PRIMARY KEY,
    Tipo VARCHAR(50) NOT NULL,
    Ubicacion VARCHAR(50) NULL,
    Descripcion VARCHAR(500) NOT NULL,
    Severidad VARCHAR(20) NOT NULL,
    UsuarioId VARCHAR(50) NOT NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Estado VARCHAR(20) NOT NULL DEFAULT 'active',
    Evidencia VARCHAR(500) NULL,

    CONSTRAINT FK_Alerta_Usuario
        FOREIGN KEY (UsuarioId) REFERENCES Usuarios.tbUsuarios(UsuarioId)
);
GO

-- =====================================================
-- ESQUEMA: MONITOREO
-- =====================================================
CREATE SCHEMA Monitoreo;
GO

CREATE TABLE Monitoreo.tbCheckins(
    CheckinId VARCHAR(50) PRIMARY KEY,
    UsuarioId VARCHAR(50) NOT NULL,
    ZonaId VARCHAR(50) NOT NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Latitud DECIMAL(10, 8) NULL,
    Longitud DECIMAL(11, 8) NULL,
    Notas VARCHAR(500) NULL,

    CONSTRAINT FK_Checkin_Usuario
        FOREIGN KEY (UsuarioId) REFERENCES Usuarios.tbUsuarios(UsuarioId),

    CONSTRAINT FK_Checkin_Zona
        FOREIGN KEY (ZonaId) REFERENCES Operaciones.tbZonas(ZonaId)
);
GO

CREATE TABLE Monitoreo.tbMetricasAWS(
    MetricaId INT IDENTITY(1,1) PRIMARY KEY,
    Servicio VARCHAR(50) NOT NULL,
    ValorActual DECIMAL(10, 2) NOT NULL,
    ValorMaximo DECIMAL(10, 2) NOT NULL,
    Tipo VARCHAR(50) NULL,
    Costo DECIMAL(10, 2) NULL,
    Fecha DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Empresas
INSERT INTO Config.tbEmpresas (EmpresaId, Nombre, Direccion, Telefono, Email, Logo, Activa)
VALUES 
('techcorp', 'TechCorp Industries', 'Av. Industrial 1234, CDMX', '+52 55 1234 5678', 'contacto@techcorp.com', 'https://via.placeholder.com/150/2C3E50/FFFFFF?text=TechCorp', 1),
('mercurio', 'Grupo Mercurio', 'Blvd. Corporativo 567, Monterrey', '+52 81 8765 4321', 'admin@mercurio.com', 'https://via.placeholder.com/150/8E44AD/FFFFFF?text=Mercurio', 1),
('valhalla', 'Valhalla Security', 'Av. Seguridad 999, Guadalajara', '+52 33 5555 9999', 'ops@valhalla.mx', 'https://via.placeholder.com/150/C0392B/FFFFFF?text=Valhalla', 1);

-- Roles
INSERT INTO Config.tbRoles (RolId, Nombre, Color, Permisos, Activo)
VALUES 
('admin', 'Administrador', '#9B59B6', '["todos"]', 1),
('supervisor', 'Supervisor', '#E67E22', '["ver_usuarios", "ver_alertas", "gestionar_equipos"]', 1),
('recepcion', 'Recepcionista', '#3498DB', '["ver_agenda", "crear_citas", "ver_solicitudes"]', 1),
('guardia', 'Guardia', '#27AE60', '["ver_agenda", "reportar_incidencias", "checkin"]', 1);

-- Zonas para TechCorp
INSERT INTO Operaciones.tbZonas (ZonaId, Nombre, Ubicacion, EmpresaId, Latitud, Longitud, Color, Tipo, Capacidad, Activa)
VALUES 
('zona-a', 'Zona A - Perímetro Norte', 'Norte', 'techcorp', 19.4326, -99.1332, '#E74C3C', 'exterior', 10, 1),
('zona-b', 'Zona B - Interior', 'Centro', 'techcorp', 19.4327, -99.1333, '#3498DB', 'interior', 20, 1),
('recepcion', 'Recepción Principal', 'Principal', 'techcorp', 19.4328, -99.1334, '#27AE60', 'interior', 5, 1),
('zona-c', 'Zona C - Estacionamiento', 'Sur', 'techcorp', 19.4325, -99.1331, '#F39C12', 'exterior', 15, 1),
('bodega', 'Bodega Central', 'Este', 'techcorp', 19.4329, -99.1330, '#1ABC9C', 'interior', 8, 1);

-- Zonas para Grupo Mercurio
INSERT INTO Operaciones.tbZonas (ZonaId, Nombre, Ubicacion, EmpresaId, Latitud, Longitud, Color, Tipo, Capacidad, Activa)
VALUES 
('zona-m-1', 'Edificio Principal', 'Central', 'mercurio', 25.6866, -100.3161, '#9B59B6', 'interior', 30, 1),
('zona-m-2', 'Planta de Producción', 'Norte', 'mercurio', 25.6867, -100.3162, '#E74C3C', 'industrial', 25, 1);

-- Equipos
INSERT INTO Operaciones.tbEquipos (EquipoId, Nombre, EmpresaId, Turno, HorarioInicio, HorarioFin, Activo)
VALUES 
('eq-techcorp-manana', 'Turno Matutino TechCorp', 'techcorp', 'matutino', '06:00', '14:00', 1),
('eq-techcorp-tarde', 'Turno Vespertino TechCorp', 'techcorp', 'vespertino', '14:00', '22:00', 1),
('eq-techcorp-noche', 'Turno Nocturno TechCorp', 'techcorp', 'nocturno', '22:00', '06:00', 1),
('eq-mercurio-manana', 'Turno Matutino Mercurio', 'mercurio', 'matutino', '06:00', '14:00', 1),
('eq-mercurio-tarde', 'Turno Vespertino Mercurio', 'mercurio', 'vespertino', '14:00', '22:00', 1);

-- =====================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================
CREATE INDEX IX_Usuarios_Empresa ON Usuarios.tbUsuarios(EmpresaId);
CREATE INDEX IX_Usuarios_Rol ON Usuarios.tbUsuarios(RolId);
CREATE INDEX IX_Zonas_Empresa ON Operaciones.tbZonas(EmpresaId);
CREATE INDEX IX_Alertas_Fecha ON Alertas.tbAlertas(Timestamp);
CREATE INDEX IX_Alertas_Estado ON Alertas.tbAlertas(Estado);
CREATE INDEX IX_Mensajes_Remitente ON Mensajes.tbMensajes(RemitenteId);
CREATE INDEX IX_Mensajes_Destinatario ON Mensajes.tbMensajes(DestinatarioId);
CREATE INDEX IX_Checkins_Usuario ON Monitoreo.tbCheckins(UsuarioId);
CREATE INDEX IX_Checkins_Fecha ON Monitoreo.tbCheckins(Timestamp);
GO