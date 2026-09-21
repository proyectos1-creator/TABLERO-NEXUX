-- ============================================================================
-- NEXUS CONSTRUCTION - DATABASE SCHEMA
-- Sistema de Gestión de Proyectos basado en Nodos y Relaciones
-- ============================================================================

-- Configuración inicial
SET CHARSET utf8mb4;
SET COLLATION utf8mb4_unicode_ci;

-- ============================================================================
-- 1. TABLAS MAESTRAS
-- ============================================================================

-- Tabla: EMPRESA
CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    rfc VARCHAR(20) NOT NULL UNIQUE,
    domicilio TEXT,
    contacto_principal VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(20),
    razon_social VARCHAR(255),
    regimen_fiscal VARCHAR(100),
    logo_url VARCHAR(500),
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_rfc (rfc),
    INDEX idx_activa (activa)
);

-- Tabla: CLIENTE
CREATE TABLE cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_empresa VARCHAR(255) NOT NULL,
    rfc VARCHAR(20),
    email VARCHAR(255),
    telefono VARCHAR(20),
    domicilio TEXT,
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100),
    contacto_principal VARCHAR(255),
    puesto_contacto VARCHAR(100),
    tipo_cliente ENUM('gobierno', 'privado', 'interno') DEFAULT 'privado',
    calificacion INT DEFAULT 0,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre_empresa),
    INDEX idx_rfc (rfc),
    INDEX idx_tipo_cliente (tipo_cliente),
    INDEX idx_activo (activo)
);

-- Tabla: AREA
CREATE TABLE area (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    responsable_id INT,
    nivel INT DEFAULT 0,
    orden INT DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_nivel (nivel),
    INDEX idx_activa (activa)
);

-- Tabla: PERSONA
CREATE TABLE persona (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    puesto VARCHAR(100),
    area_id INT NOT NULL,
    empresa_id INT,
    telefono VARCHAR(20),
    avatar_url VARCHAR(500),
    activa BOOLEAN DEFAULT TRUE,
    fecha_inicio DATE,
    fecha_fin_contrato DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_area_id (area_id),
    INDEX idx_activa (activa),
    CONSTRAINT fk_persona_area FOREIGN KEY (area_id) 
        REFERENCES area(id) ON DELETE RESTRICT,
    CONSTRAINT fk_persona_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresa(id) ON DELETE SET NULL
);

ALTER TABLE area
    ADD CONSTRAINT fk_area_responsable FOREIGN KEY (responsable_id)
        REFERENCES persona(id) ON DELETE SET NULL;

-- Tabla: PROVEEDOR
CREATE TABLE proveedor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    rfc VARCHAR(20),
    email VARCHAR(255),
    telefono VARCHAR(20),
    domicilio TEXT,
    especialidad VARCHAR(255),
    descripcion TEXT,
    calificacion INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_especialidad (especialidad),
    INDEX idx_activo (activo)
);

-- ============================================================================
-- 2. TABLAS DE PROYECTOS
-- ============================================================================

-- Tabla: PROYECTO
CREATE TABLE proyecto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    cliente_id INT NOT NULL,
    tipo ENUM('1', '2', '3', '3a', '4', '5') DEFAULT '1',
    descripcion TEXT,
    
    -- Fechas
    fecha_inicio DATE,
    fecha_fin_planificada DATE,
    fecha_fin_real DATE,
    
    -- Montos
    monto_total DECIMAL(15, 2),
    monto_anticipo DECIMAL(15, 2),
    monto_facturado DECIMAL(15, 2) DEFAULT 0,
    monto_pagado DECIMAL(15, 2) DEFAULT 0,
    
    -- Estado
    estado ENUM('negociacion', 'acuerdo', 'contratado', 'planificacion', 
                'ejecucion', 'cierre_admin', 'cerrado_siroc', 'cerrado_imss', 
                'cerrado_hacienda', 'cancelado') DEFAULT 'negociacion',
    
    -- Responsables
    pm_responsable_id INT,
    empresa_responsable_id INT NOT NULL,
    
    -- Indicadores
    avance_fisico INT DEFAULT 0,
    avance_financiero INT DEFAULT 0,
    dias_retraso INT DEFAULT 0,
    
    -- Datos adicionales
    ubicacion TEXT,
    observaciones TEXT,
    activo BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_pm_responsable_id (pm_responsable_id),
    INDEX idx_activo (activo),
    
    CONSTRAINT fk_proyecto_cliente FOREIGN KEY (cliente_id) 
        REFERENCES cliente(id) ON DELETE RESTRICT,
    CONSTRAINT fk_proyecto_pm FOREIGN KEY (pm_responsable_id) 
        REFERENCES persona(id) ON DELETE SET NULL,
    CONSTRAINT fk_proyecto_empresa FOREIGN KEY (empresa_responsable_id) 
        REFERENCES empresa(id) ON DELETE RESTRICT
);

-- Tabla: PARTICIPACION (relación M:N entre Proyecto y Área)
CREATE TABLE participacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proyecto_id INT NOT NULL,
    area_id INT NOT NULL,
    rol_en_proyecto ENUM('lider', 'ejecutor', 'revisor', 'aprobador', 'consultor') 
        DEFAULT 'ejecutor',
    fecha_inicio DATE,
    fecha_fin DATE,
    responsable_area_id INT,
    activa BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_proyecto_area (proyecto_id, area_id),
    INDEX idx_proyecto_id (proyecto_id),
    INDEX idx_area_id (area_id),
    
    CONSTRAINT fk_participacion_proyecto FOREIGN KEY (proyecto_id) 
        REFERENCES proyecto(id) ON DELETE CASCADE,
    CONSTRAINT fk_participacion_area FOREIGN KEY (area_id) 
        REFERENCES area(id) ON DELETE RESTRICT,
    CONSTRAINT fk_participacion_responsable FOREIGN KEY (responsable_area_id)
        REFERENCES persona(id) ON DELETE SET NULL
);

-- ============================================================================
-- 3. TABLAS DE NODOS Y ESTRUCTURA JERÁRQUICA
-- ============================================================================

-- Tabla: ESTADO_NODO (Catálogo)
CREATE TABLE estado_nodo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#808080',
    es_terminal BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    
    KEY idx_nombre (nombre)
);

-- Insertar estados estándar
INSERT INTO estado_nodo (nombre, descripcion, color, es_terminal, orden) VALUES
('no_iniciado', 'Nodo no iniciado', '#E0E0E0', FALSE, 0),
('en_proceso', 'En ejecución', '#1E88E5', FALSE, 1),
('en_revision', 'Esperando revisión/aprobación', '#FF9800', FALSE, 2),
('aprobado', 'Aprobado', '#4CAF50', FALSE, 3),
('terminado', 'Completado', '#00AA00', TRUE, 4),
('bloqueado', 'Bloqueado por dependencia', '#F44336', FALSE, 5),
('rechazado', 'Rechazado - requiere revisión', '#E91E63', FALSE, 6),
('cancelado', 'Cancelado', '#424242', TRUE, 7),
('pendiente', 'Pendiente de acción', '#FFC107', FALSE, 8);

-- Tabla: NODO (Unidad fundamental de trabajo)
CREATE TABLE nodo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL,
    proyecto_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Tipo y categoría
    tipo_nodo ENUM('objetivo', 'hito', 'actividad', 'entregable', 'evidencia') 
        NOT NULL DEFAULT 'actividad',
    
    -- Jerarquía
    parent_nodo_id INT,
    nivel_jerarquia INT DEFAULT 1,
    
    -- Responsabilidades
    responsable_id INT NOT NULL,
    area_id INT NOT NULL,
    revisor_id INT,
    aprobador_id INT,
    
    -- Fechas
    fecha_inicio DATE,
    fecha_fin_planificada DATE,
    fecha_fin_real DATE,
    
    -- Duracion (para actividades)
    duracion_estimada_horas INT,
    duracion_real_horas INT,
    
    -- Estado y progreso
    estado_id INT NOT NULL DEFAULT 1,
    porcentaje_avance INT DEFAULT 0,
    es_critico BOOLEAN DEFAULT FALSE,
    
    -- Indicadores
    dias_retraso INT DEFAULT 0,
    numero_bloqueantes INT DEFAULT 0,
    numero_dependientes INT DEFAULT 0,
    
    -- Metadatos
    prioridad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
    notas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_codigo_proyecto (codigo, proyecto_id),
    INDEX idx_proyecto_id (proyecto_id),
    INDEX idx_parent_nodo_id (parent_nodo_id),
    INDEX idx_responsable_id (responsable_id),
    INDEX idx_area_id (area_id),
    INDEX idx_estado_id (estado_id),
    INDEX idx_tipo_nodo (tipo_nodo),
    INDEX idx_es_critico (es_critico),
    INDEX idx_activo (activo),
    
    CONSTRAINT fk_nodo_proyecto FOREIGN KEY (proyecto_id) 
        REFERENCES proyecto(id) ON DELETE CASCADE,
    CONSTRAINT fk_nodo_parent FOREIGN KEY (parent_nodo_id) 
        REFERENCES nodo(id) ON DELETE CASCADE,
    CONSTRAINT fk_nodo_responsable FOREIGN KEY (responsable_id) 
        REFERENCES persona(id) ON DELETE RESTRICT,
    CONSTRAINT fk_nodo_area FOREIGN KEY (area_id) 
        REFERENCES area(id) ON DELETE RESTRICT,
    CONSTRAINT fk_nodo_revisor FOREIGN KEY (revisor_id)
        REFERENCES persona(id) ON DELETE SET NULL,
    CONSTRAINT fk_nodo_aprobador FOREIGN KEY (aprobador_id)
        REFERENCES persona(id) ON DELETE SET NULL,
    CONSTRAINT fk_nodo_estado FOREIGN KEY (estado_id)
        REFERENCES estado_nodo(id) ON DELETE RESTRICT
);

-- Tabla: OBJETIVO
CREATE TABLE objetivo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nodo_id INT NOT NULL,
    descripcion TEXT,
    metricas_exito TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nodo_id (nodo_id),
    
    CONSTRAINT fk_objetivo_nodo FOREIGN KEY (nodo_id)
        REFERENCES nodo(id) ON DELETE CASCADE
);

-- Tabla: HITO
CREATE TABLE hito (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nodo_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_target DATE,
    es_contractual BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nodo_id (nodo_id),
    
    CONSTRAINT fk_hito_nodo FOREIGN KEY (nodo_id)
        REFERENCES nodo(id) ON DELETE CASCADE
);

-- Tabla: ACTIVIDAD
CREATE TABLE actividad (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nodo_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    responsable_id INT NOT NULL,
    duracion_estimada_horas INT,
    duracion_real_horas INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nodo_id (nodo_id),
    INDEX idx_responsable_id (responsable_id),
    
    CONSTRAINT fk_actividad_nodo FOREIGN KEY (nodo_id)
        REFERENCES nodo(id) ON DELETE CASCADE,
    CONSTRAINT fk_actividad_responsable FOREIGN KEY (responsable_id)
        REFERENCES persona(id) ON DELETE RESTRICT
);

-- ============================================================================
-- 4. TABLAS DE RELACIONES Y DEPENDENCIAS
-- ============================================================================

-- Tabla: TIPO_RELACION (Catálogo)
CREATE TABLE tipo_relacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    es_bloqueadora BOOLEAN DEFAULT FALSE,
    
    KEY idx_nombre (nombre)
);

-- Insertar tipos de relación estándar
INSERT INTO tipo_relacion (nombre, descripcion, es_bloqueadora) VALUES
('depende_de', 'El nodo origen depende del nodo destino', TRUE),
('genera', 'El nodo origen genera el nodo destino', FALSE),
('aprueba', 'El nodo origen aprueba el nodo destino', FALSE),
('entrega', 'El nodo origen entrega a destino', FALSE),
('bloquea', 'El nodo origen bloquea el nodo destino', TRUE),
('informa', 'El nodo origen informa al destino', FALSE),
('es_prerequisito_de', 'El nodo origen es prerequisito del destino', TRUE),
('sigue_a', 'El nodo origen sigue al destino', TRUE);

-- Tabla: RELACION
CREATE TABLE relacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nodo_origen_id INT NOT NULL,
    nodo_destino_id INT NOT NULL,
    tipo_relacion_id INT NOT NULL,
    descripcion TEXT,
    es_critica BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_relacion (nodo_origen_id, nodo_destino_id, tipo_relacion_id),
    INDEX idx_nodo_origen_id (nodo_origen_id),
    INDEX idx_nodo_destino_id (nodo_destino_id),
    INDEX idx_tipo_relacion_id (tipo_relacion_id),
    INDEX idx_es_critica (es_critica),
    
    CONSTRAINT fk_relacion_origen FOREIGN KEY (nodo_origen_id)
        REFERENCES nodo(id) ON DELETE CASCADE,
    CONSTRAINT fk_relacion_destino FOREIGN KEY (nodo_destino_id)
        REFERENCES nodo(id) ON DELETE CASCADE,
    CONSTRAINT fk_relacion_tipo FOREIGN KEY (tipo_relacion_id)
        REFERENCES tipo_relacion(id) ON DELETE RESTRICT
);

-- ============================================================================
-- 5. TABLAS DE ENTREGABLES Y EVIDENCIAS
-- ============================================================================

-- Tabla: TIPO_ENTREGABLE (Catálogo)
CREATE TABLE tipo_entregable (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    requiere_archivo BOOLEAN DEFAULT TRUE,
    requiere_firma BOOLEAN DEFAULT FALSE,
    
    KEY idx_nombre (nombre)
);

-- Insertar tipos de entregable estándar
INSERT INTO tipo_entregable (nombre, descripcion, requiere_archivo, requiere_firma) VALUES
('documento', 'Documento (PDF, Word, Excel, etc)', TRUE, FALSE),
('pieza', 'Pieza física/material', FALSE, TRUE),
('material', 'Material entregado', FALSE, TRUE),
('servicio', 'Servicio prestado', FALSE, FALSE),
('acta', 'Acta de conformidad', TRUE, TRUE),
('plano', 'Plano o dibujo técnico', TRUE, FALSE),
('estimacion', 'Estimación de avance', TRUE, FALSE),
('factura', 'Factura/comprobante', TRUE, TRUE),
('submital', 'Submital de materiales', TRUE, FALSE),
('reporte', 'Reporte o informe', TRUE, FALSE);

-- Tabla: ENTREGABLE
CREATE TABLE entregable (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nodo_id INT NOT NULL,
    tipo_entregable_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Responsabilidades
    responsable_id INT NOT NULL,
    revisor_id INT,
    aprobador_id INT,
    
    -- Fechas
    fecha_entrega_planificada DATE,
    fecha_entrega_real DATE,
    
    -- Estado
    estado ENUM('no_iniciado', 'en_proceso', 'en_revision', 'aprobado', 
                'rechazado', 'cancelado') DEFAULT 'no_iniciado',
    porcentaje_avance INT DEFAULT 0,
    
    -- Versión y cambios
    version INT DEFAULT 1,
    numero_rechazos INT DEFAULT 0,
    motivo_ultimo_rechazo TEXT,
    
    -- Archivo
    archivo_url VARCHAR(500),
    archivo_nombre_original VARCHAR(255),
    archivo_tamaño_bytes BIGINT,
    
    -- Metadata
    activo BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nodo_id (nodo_id),
    INDEX idx_tipo_entregable_id (tipo_entregable_id),
    INDEX idx_responsable_id (responsable_id),
    INDEX idx_estado (estado),
    INDEX idx_activo (activo),
    
    CONSTRAINT fk_entregable_nodo FOREIGN KEY (nodo_id)
        REFERENCES nodo(id) ON DELETE CASCADE,
    CONSTRAINT fk_entregable_tipo FOREIGN KEY (tipo_entregable_id)
        REFERENCES tipo_entregable(id) ON DELETE RESTRICT,
    CONSTRAINT fk_entregable_responsable FOREIGN KEY (responsable_id)
        REFERENCES persona(id) ON DELETE RESTRICT,
    CONSTRAINT fk_entregable_revisor FOREIGN KEY (revisor_id)
        REFERENCES persona(id) ON DELETE SET NULL,
    CONSTRAINT fk_entregable_aprobador FOREIGN KEY (aprobador_id)
        REFERENCES persona(id) ON DELETE SET NULL
);

-- Tabla: TIPO_EVIDENCIA (Catálogo)
CREATE TABLE tipo_evidencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    
    KEY idx_nombre (nombre)
);

-- Insertar tipos de evidencia estándar
INSERT INTO tipo_evidencia (nombre, descripcion) VALUES
('documento', 'Documento de respaldo'),
('fotografia', 'Fotografía de obra'),
('acta', 'Acta de conformidad/cumplimiento'),
('factura', 'Factura o comprobante fiscal'),
('inspeccion', 'Reporte de inspección'),
('video', 'Video de registro'),
('firma_digital', 'Firma digital de conformidad'),
('correo', 'Correo de confirmación'),
('formulario', 'Formulario diligenciado'),
('otro', 'Otro tipo de evidencia');

-- Tabla: EVIDENCIA
CREATE TABLE evidencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entregable_id INT,
    nodo_id INT NOT NULL,
    tipo_evidencia_id INT NOT NULL,
    descripcion TEXT,
    
    -- Responsabilidades
    responsable_id INT NOT NULL,
    creado_por_id INT NOT NULL,
    
    -- Fechas
    fecha_evidencia DATE NOT NULL DEFAULT CURDATE(),
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Archivo
    archivo_url VARCHAR(500),
    archivo_nombre_original VARCHAR(255),
    archivo_tamaño_bytes BIGINT,
    tipo_mime VARCHAR(100),
    
    -- Datos técnicos
    datos_tecnicos JSON,
    
    -- Firmas de conformidad (JSON array de personas)
    firmas_conformidad JSON,
    personas_aprobadas TEXT,
    
    -- Metadata
    activa BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_entregable_id (entregable_id),
    INDEX idx_nodo_id (nodo_id),
    INDEX idx_tipo_evidencia_id (tipo_evidencia_id),
    INDEX idx_responsable_id (responsable_id),
    INDEX idx_fecha_evidencia (fecha_evidencia),
    
    CONSTRAINT fk_evidencia_entregable FOREIGN KEY (entregable_id)
        REFERENCES entregable(id) ON DELETE CASCADE,
    CONSTRAINT fk_evidencia_nodo FOREIGN KEY (nodo_id)
        REFERENCES nodo(id) ON DELETE CASCADE,
    CONSTRAINT fk_evidencia_tipo FOREIGN KEY (tipo_evidencia_id)
        REFERENCES tipo_evidencia(id) ON DELETE RESTRICT,
    CONSTRAINT fk_evidencia_responsable FOREIGN KEY (responsable_id)
        REFERENCES persona(id) ON DELETE RESTRICT,
    CONSTRAINT fk_evidencia_creado_por FOREIGN KEY (creado_por_id)
        REFERENCES persona(id) ON DELETE RESTRICT
);

-- ============================================================================
-- 6. TABLAS DE INDICADORES Y SEGUIMIENTO
-- ============================================================================

-- Tabla: INDICADOR
CREATE TABLE indicador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Ámbito
    aplicable_a ENUM('proyecto', 'nodo', 'area', 'persona', 'sistema') 
        DEFAULT 'proyecto',
    proyecto_id INT,
    nodo_id INT,
    
    -- Valores
    formula VARCHAR(500),
    valor_actual DECIMAL(10, 2),
    valor_meta DECIMAL(10, 2),
    valor_minimo DECIMAL(10, 2),
    valor_maximo DECIMAL(10, 2),
    
    -- Frecuencia
    frecuencia_actualizacion ENUM('diaria', 'semanal', 'mensual', 'trimestral') 
        DEFAULT 'semanal',
    ultima_actualizacion TIMESTAMP,
    
    -- Estado
    activo BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_proyecto_id (proyecto_id),
    INDEX idx_nodo_id (nodo_id),
    INDEX idx_aplicable_a (aplicable_a),
    
    CONSTRAINT fk_indicador_proyecto FOREIGN KEY (proyecto_id)
        REFERENCES proyecto(id) ON DELETE CASCADE,
    CONSTRAINT fk_indicador_nodo FOREIGN KEY (nodo_id)
        REFERENCES nodo(id) ON DELETE CASCADE
);

-- Tabla: HISTORIAL_INDICADOR (Auditoría)
CREATE TABLE historial_indicador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    indicador_id INT NOT NULL,
    valor DECIMAL(10, 2),
    meta DECIMAL(10, 2),
    varianza DECIMAL(10, 2),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_indicador_id (indicador_id),
    INDEX idx_fecha_registro (fecha_registro),
    
    CONSTRAINT fk_historial_indicador FOREIGN KEY (indicador_id)
        REFERENCES indicador(id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. TABLAS DE NOTIFICACIONES Y AUDITORÍA
-- ============================================================================

-- Tabla: NOTIFICACION
CREATE TABLE notificacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    persona_id INT NOT NULL,
    tipo ENUM('tarea_asignada', 'vencimiento_proximo', 'cambio_estado', 
              'bloqueo', 'aprobacion_requerida', 'evidencia_subida', 
              'proyecto_alerta', 'otro') DEFAULT 'otro',
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    nodo_id INT,
    proyecto_id INT,
    leida BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_persona_id (persona_id),
    INDEX idx_leida (leida),
    INDEX idx_created_at (created_at),
    INDEX idx_nodo_id (nodo_id),
    
    CONSTRAINT fk_notificacion_persona FOREIGN KEY (persona_id)
        REFERENCES persona(id) ON DELETE CASCADE,
    CONSTRAINT fk_notificacion_nodo FOREIGN KEY (nodo_id)
        REFERENCES nodo(id) ON DELETE SET NULL,
    CONSTRAINT fk_notificacion_proyecto FOREIGN KEY (proyecto_id)
        REFERENCES proyecto(id) ON DELETE SET NULL
);

-- Tabla: HISTORIAL_CAMBIOS (Auditoría completa)
CREATE TABLE historial_cambios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_entidad VARCHAR(100) NOT NULL,
    id_entidad INT NOT NULL,
    campo_modificado VARCHAR(100),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    modificado_por_id INT NOT NULL,
    razon_cambio VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tipo_entidad (tipo_entidad),
    INDEX idx_id_entidad (id_entidad),
    INDEX idx_modificado_por_id (modificado_por_id),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT fk_historial_cambios_persona FOREIGN KEY (modificado_por_id)
        REFERENCES persona(id) ON DELETE RESTRICT
);

-- ============================================================================
-- 8. VISTAS ÚTILES
-- ============================================================================

-- Vista: Nodos en retraso
CREATE VIEW vw_nodos_en_retraso AS
SELECT 
    n.id,
    n.codigo,
    n.nombre,
    p.codigo as proyecto_codigo,
    p.nombre as proyecto_nombre,
    n.fecha_fin_planificada,
    DATEDIFF(CURDATE(), n.fecha_fin_planificada) as dias_retraso,
    n.responsable_id,
    per.nombre as responsable_nombre,
    n.estado_id,
    en.nombre as estado_nombre,
    n.porcentaje_avance
FROM nodo n
JOIN proyecto p ON n.proyecto_id = p.id
JOIN persona per ON n.responsable_id = per.id
JOIN estado_nodo en ON n.estado_id = en.id
WHERE n.estado_id NOT IN (4, 7, 8) -- Excluir terminado, cancelado
  AND n.fecha_fin_planificada < CURDATE()
  AND n.activo = TRUE
ORDER BY dias_retraso DESC;

-- Vista: Actividades por responsable
CREATE VIEW vw_actividades_por_responsable AS
SELECT 
    per.id,
    per.nombre,
    COUNT(CASE WHEN en.nombre = 'no_iniciado' THEN 1 END) as no_iniciadas,
    COUNT(CASE WHEN en.nombre = 'en_proceso' THEN 1 END) as en_proceso,
    COUNT(CASE WHEN en.nombre = 'en_revision' THEN 1 END) as en_revision,
    COUNT(CASE WHEN en.nombre = 'bloqueado' THEN 1 END) as bloqueadas,
    COUNT(n.id) as total_activas
FROM persona per
LEFT JOIN nodo n ON per.id = n.responsable_id AND n.activo = TRUE
LEFT JOIN estado_nodo en ON n.estado_id = en.id
WHERE per.activa = TRUE
GROUP BY per.id, per.nombre
ORDER BY total_activas DESC;

-- Vista: Avance por proyecto
CREATE VIEW vw_avance_por_proyecto AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.monto_total,
    p.monto_facturado,
    ROUND((p.monto_facturado / p.monto_total * 100), 2) as avance_financiero,
    ROUND(AVG(CASE WHEN n.estado_id = 4 THEN 100 ELSE n.porcentaje_avance END), 2) as avance_fisico,
    COUNT(CASE WHEN n.estado_id = 5 THEN 1 END) as nodos_bloqueados,
    COUNT(CASE WHEN n.estado_id NOT IN (4, 7) THEN 1 END) as nodos_pendientes,
    p.estado,
    p.pm_responsable_id
FROM proyecto p
LEFT JOIN nodo n ON p.id = n.proyecto_id AND n.activo = TRUE
WHERE p.activo = TRUE
GROUP BY p.id, p.codigo, p.nombre, p.monto_total, p.monto_facturado, p.estado, p.pm_responsable_id
ORDER BY p.updated_at DESC;

-- Vista: Eficiencia por persona
CREATE VIEW vw_eficiencia_por_persona AS
SELECT 
    per.id,
    per.nombre,
    a.area_id,
    a.nombre as area_nombre,
    COUNT(n.id) as actividades_completadas,
    ROUND(SUM(n.duracion_estimada_horas), 0) as horas_estimadas,
    ROUND(SUM(n.duracion_real_horas), 0) as horas_reales,
    CASE 
        WHEN SUM(n.duracion_estimada_horas) = 0 THEN 0
        ELSE ROUND(SUM(n.duracion_real_horas) / SUM(n.duracion_estimada_horas) * 100, 2)
    END as eficiencia_porcentaje
FROM persona per
JOIN area a ON per.area_id = a.id
LEFT JOIN nodo n ON per.id = n.responsable_id 
    AND n.estado_id = 4 -- Solo completados
    AND n.activo = TRUE
WHERE per.activa = TRUE
GROUP BY per.id, per.nombre, a.area_id, a.nombre
ORDER BY eficiencia_porcentaje DESC;

-- ============================================================================
-- 9. ÍNDICES ADICIONALES DE OPTIMIZACIÓN
-- ============================================================================

-- Índices para búsquedas comunes
ALTER TABLE nodo ADD INDEX idx_proyecto_estado (proyecto_id, estado_id);
ALTER TABLE nodo ADD INDEX idx_responsable_estado (responsable_id, estado_id);
ALTER TABLE proyecto ADD INDEX idx_estado_empresa (estado, empresa_responsable_id);
ALTER TABLE evidencia ADD INDEX idx_fecha_nodo (fecha_evidencia, nodo_id);
ALTER TABLE historial_cambios ADD INDEX idx_entidad_fecha (tipo_entidad, id_entidad, created_at);

-- ============================================================================
-- 10. DOCUMENTACIÓN Y COMMENTS
-- ============================================================================

-- ALTER TABLE proyecto COMMENT = 'Tabla de proyectos - unidad principal de trabajo';
-- ALTER TABLE nodo COMMENT = 'Tabla de nodos - unidad de información y trabajo';
-- ALTER TABLE entregable COMMENT = 'Tabla de entregables - resultados verificables';
-- ALTER TABLE evidencia COMMENT = 'Tabla de evidencias - pruebas documentales del cumplimiento';

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================
