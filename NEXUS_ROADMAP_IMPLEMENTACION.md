# NEXUS CONSTRUCTION
## Roadmap de Implementación Estructurado

**Documento de Estrategia:** Cómo pasar del metamodelo conceptual a un sistema funcional de seguimiento y asignación de tareas.

---

## 📋 Estado Actual

### ✅ Lo que YA tienes documentado:

1. **Definiciones conceptuales claras** (META_MODELO.docx)
   - Proyecto, Nodo, Proceso, Actividad, Entregable, Evidencia
   - Definiciones empresariales muy sólidas para tu contexto

2. **Estructura de tipos de proyectos** (META_MODELO_2.docx)
   - Proyecto tipo 1: Solo venta de materiales
   - Proyecto tipo 2: Venta + construcción
   - Proyecto tipo 3: Licitación simple
   - Proyecto tipo 3a: Licitación formal
   - Proyecto tipo 4: Licitación múltiples especialidades
   - Proyecto tipo 5: Proyectos virtuales con catálogo existente

3. **Visión clara de NEXUS** (NEXUS_CONSTRUCTION_AFMO_V1_0.docx)
   - Sistema basado en nodos y relaciones, NO en tareas
   - Orientado a responsabilidades, entregables, evidencias
   - Resolver fragmentación de información

4. **Mapeo de procesos** (Mapeos_Construccion002_final_16_12_2019.xls)
   - 12 áreas identificadas
   - 41 formularios catalogados
   - Flujo horizontal claro

### ❌ Lo que FALTA para que sea implementable:

1. **Modelo de datos concreto**
   - Estructura de tablas/entidades
   - Campos específicos de cada entidad
   - Relaciones de base de datos

2. **Definición de vistas**
   - Wireframes de interfaz
   - Cómo se navega
   - Qué información ve cada rol

3. **Reglas de negocio implementables**
   - Transiciones de estado
   - Permisos por rol
   - Automatizaciones

4. **MVP claramente delimitado**
   - Qué entra en V1
   - Qué se postpone

---

## 🏗️ FASE 1: Arquitectura de Datos
### (Semanas 1-2)

### 1.1 Definir Entidades Principales

```
EMPRESA
├── id
├── nombre
├── rfc
├── contacto
└── datos_fiscales

CLIENTE
├── id
├── nombre_empresa
├── rfc
├── email
├── personas_contacto
└── historial_proyectos

PROYECTO
├── id (ej: PRY-2024-001)
├── nombre
├── cliente_id (FK)
├── tipo (1, 2, 3, 3a, 4, 5)
├── fecha_inicio
├── fecha_fin_planificada
├── fecha_fin_real
├── monto_total
├── monto_anticipo
├── estado (negociación, contratado, planificación, ejecución, cierre)
├── pm_responsable_id (FK a Persona)
├── areas_involucradas (M:N)
├── propietario_empresa_id (FK - cuál empresa lo lleva)
└── created_at, updated_at

AREA
├── id
├── nombre (Ventas, Construcción, Compras, etc.)
├── descripcion
├── responsable_id (FK)
└── nivel (nivel en la jerarquía)

PERSONA
├── id
├── nombre
├── puesto
├── area_id (FK)
├── email
├── telefono
├── permisos (array de roles)
├── activo (bool)
└── empresa_id (FK - si es de empresa externa)

PROVEEDOR
├── id
├── nombre
├── rfc
├── especialidad (materiales, mano_obra, maquila, etc.)
├── contacto
├── calificacion
└── proyectos_participados

NODO
├── id (ej: NOD-2024-001-001)
├── proyecto_id (FK)
├── nombre
├── tipo_nodo (objetivo, hito, actividad, evidencia)
├── descripcion
├── responsable_id (FK)
├── area_id (FK)
├── estado
├── fecha_inicio
├── fecha_fin_planificada
├── fecha_fin_real
├── es_critico (bool - en ruta crítica)
├── parent_nodo_id (FK - para anidación jerárquica)
└── created_at, updated_at

OBJETIVO
├── id
├── nodo_id (FK - el nodo es el contenedor)
├── descripcion
├── metricas_exito
└── hitos_asociados

HITO
├── id
├── nodo_id (FK)
├── nombre
├── fecha_target
├── descripcion
├── deliverables_asociados
└── personas_aprobadoras

ACTIVIDAD
├── id
├── nodo_id (FK - puede estar dentro de un objetivo/hito)
├── nombre
├── descripcion
├── responsable_id (FK)
├── duracion_estimada (horas)
├── duracion_real (horas)
├── estado
├── porcentaje_avance
├── dependencias_previas (M:N con otras actividades)
└── entregables

ENTREGABLE
├── id
├── nodo_id (FK)
├── tipo (documento, pieza, material, servicio, acta, plano, estimacion, factura)
├── nombre
├── descripcion
├── responsable_id (FK)
├── estado (no_iniciado, en_proceso, en_revision, aprobado, rechazado)
├── fecha_entrega_planificada
├── fecha_entrega_real
├── version
├── archivo_url
└── evidencias_asociadas

EVIDENCIA
├── id
├── entregable_id (FK)
├── nodo_id (FK)
├── tipo (documento, foto, acta, factura, inspección)
├── archivo_url
├── fecha_evidencia
├── responsable_id (FK)
├── descripcion
├── datos_tecnicos (tolerancias, gráficas, etc.)
├── firmas_conformidad (JSON - personas que aprueban)
└── created_at

RELACION
├── id
├── nodo_origen_id (FK)
├── nodo_destino_id (FK)
├── tipo_relacion (depende_de, genera, aprueba, entrega, bloquea, informa)
├── descripcion
└── es_critica (bool)

ESTADO
├── id
├── nombre (no_iniciado, en_proceso, pendiente, bloqueado, terminado, cancelado)
├── aplicable_a (proyecto, nodo, actividad, entregable)
├── color (para UI)
└── es_terminal (bool)

PARTICIPACION
├── id
├── proyecto_id (FK)
├── area_id (FK)
├── rol_en_proyecto (lider, ejecutor, revisor, aprovador)
├── fecha_inicio
└── fecha_fin

INDICADOR
├── id
├── nodo_id (FK)
├── proyecto_id (FK)
├── nombre (ej: Avance Físico vs Financiero)
├── formula
├── valor_actual
├── valor_meta
├── frecuencia_actualizacion (diaria, semanal, mensual)
└── ultima_actualizacion
```

### 1.2 Definir Relaciones de Base de Datos

```
Proyecto (1) ──────→ (N) Nodo
Proyecto (1) ──────→ (1) Cliente
Proyecto (M) ◄────► (N) Área [a través de PARTICIPACION]
Proyecto (1) ──────→ (1) Persona (PM)

Nodo (1) ──────→ (N) Nodo (anidación jerárquica - parent_nodo_id)
Nodo (1) ──────→ (1) Persona (responsable)
Nodo (1) ──────→ (1) Área
Nodo (1) ──────→ (N) Entregable
Nodo (1) ──────→ (N) Evidencia
Nodo (1) ──────→ (N) Indicador

Nodo (M) ◄────► (N) Nodo [a través de RELACION]

Entregable (1) ──────→ (N) Evidencia
Evidencia (N) ──────→ (1) Archivo (storage)

Persona (N) ──────→ (1) Área
Persona (M) ◄────► (N) Proyecto [roles]

Proveedor (M) ◄────► (N) Proyecto

Actividad está contenida en Nodo
Objetivo está contenida en Nodo
Hito está contenida en Nodo
```

### 1.3 Campos Clave para Seguimiento

```json
{
  "proyecto": {
    "metricas_seguimiento": {
      "avance_fisico": "porcentaje",
      "avance_financiero": "porcentaje",
      "varianza": "monto",
      "estado_general": "string"
    }
  },
  "nodo": {
    "metricas_seguimiento": {
      "avance_porcentual": "0-100",
      "dias_en_retraso": "numero",
      "ruta_critica": "boolean",
      "bloqueantes": ["relacion_ids"],
      "dependencias_pendientes": ["nodo_ids"]
    }
  },
  "actividad": {
    "asignacion": {
      "responsable_id": "id",
      "fecha_asignacion": "datetime",
      "prioridad": "1-5",
      "horas_estimadas": "numero",
      "horas_reales": "numero",
      "eficiencia": "porcentaje"
    }
  }
}
```

---

## 📊 FASE 2: Vistas y Navegación
### (Semanas 3-4)

### 2.1 Vista Jerárquica (Árbol)

**Propósito:** Ver la estructura completa proyecto → áreas → nodos → actividades

```
Proyecto: Construcción Acero 2024
├── Objetivo: Ejecutar estructura metálica
│   ├── Hito: Ingeniería aprobada
│   │   ├── Actividad: Diseño estructural
│   │   ├── Actividad: Cálculos FEA
│   │   └── Actividad: Documentación
│   ├── Hito: Materiales en sitio (bloqueado por ↑)
│   │   ├── Actividad: Cotizar acero
│   │   ├── Actividad: Solicitar orden de compra
│   │   └── Actividad: Recepción de materiales
│   └── Hito: Instalación completada
│       ├── Actividad: Preparar sitio
│       ├── Actividad: Montaje estructura
│       └── Actividad: Inspección final

Área: Construcción
├── Responsable: Ing. Jorge
├── Estado: En proceso (75%)
├── Personas asignadas: [...]
└── Indicador: Avance 75% vs Meta 80%
```

**Información mostrada por nodo:**
- Estado (color)
- Responsable (avatar/nombre)
- Avance (barra de progreso)
- Entregables pendientes (contador)
- Bloqueantes (iconos de alerta)
- Próximas fechas

### 2.2 Vista de Nodos (Mapa)

**Propósito:** Visualización de conexiones y dependencias

```
┌─────────────────────────────────────────────────────┐
│                    PROYECTO XYZ                      │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐   │
│  │ Objetivo │      │  Hito 1  │      │  Hito 2  │   │
│  │Ejecutar  │      │ Ing aprobada     │ Materiales   │
│  │ Estructura      │          │      │ en sitio │   │
│  │  Verde    │      │ Verde    │      │ Amarillo │   │
│  └──────────┘      └──────────┘      └──────────┘   │
│      ↓                  ↓                  ↓          │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐   │
│  │ Actividad│      │ Actividad│      │ Actividad│   │
│  │ Diseño   │      │ Cálculos │      │ Cotizar  │   │
│  │          │      │ Estructurales     │          │   │
│  └──────────┘      └──────────┘      └──────────┘   │
│                         ↑ Bloqueador                 │
│                    (relación crítica)                │
└─────────────────────────────────────────────────────┘
```

**Interacciones:**
- Hacer clic en nodo: ver detalles
- Arrastrar: cambiar relaciones (si permisos permiten)
- Filtrar por: estado, responsable, área, criticidad
- Zoom: acercar/alejar

### 2.3 Vista de Asignaciones (Kanban Evolucionado)

**Propósito:** Seguimiento de tareas por persona/área

```
┌─────────────┬──────────────┬──────────────┬────────────┐
│ No Iniciado │ En Proceso   │ En Revisión  │  Aprobado  │
├─────────────┼──────────────┼──────────────┼────────────┤
│             │              │              │            │
│ ACT-001     │ ACT-003      │ ACT-005      │ ACT-007    │
│ Diseño      │ Cálculos     │ Documentación│ Recepción  │
│ Responsable:│ Responsable: │ Responsable: │ Responsable│
│ Ing. Jorge  │ Ing. Carlos  │ Arq. María   │ Ing. Pedro │
│ Vence: 5d   │ Vence: 2d    │ Vence: 7d    │ Vence: 1d  │
│ 3 Bloques   │ 0 Bloques    │ 2 Bloques    │ 0 Bloques  │
│             │              │              │            │
│ ACT-002     │ ACT-004      │ ACT-006      │            │
│ Especific.  │ Documentar   │ Revisión     │            │
│ Responsable:│ Responsable: │ Responsable: │            │
│ Arq. María  │ Arq. María   │ Ing. Jorge   │            │
│ Vence: 8d   │ Vence: 3d    │ Vence: 1d    │            │
│ 1 Bloque    │ 0 Bloques    │ 1 Bloque     │            │
└─────────────┴──────────────┴──────────────┴────────────┘
```

**Información por tarjeta:**
- ID y nombre de actividad
- Responsable
- Días para vencer (color: rojo <2d, amarillo <5d, verde >5d)
- Número de bloqueantes
- % de avance

### 2.4 Vista de Cronograma (Gantt)

**Propósito:** Planificación y visualización de ruta crítica

```
Actividad          Ene    Feb    Mar    Apr    May
─────────────────────────────────────────────────────
Diseño             ▓▓▓    
Cálculos               ▓▓▓▓    
Documentación            ▓▓▓ ⚠️ (retrasado)
Cotizar Acero          ▓▓▓▓▓ 
Orden Compra                  ▓▓
Recepción                       ▓▓▓
Preparar Sitio                     ▓▓
Montaje                            ▓▓▓▓▓ (ruta crítica)
Inspección                              ▓▓

Leyenda:
▓▓▓ = En tiempo
⚠️  = Retrasado
▓▓▓ = Ruta crítica (rojo)
```

### 2.5 Vista de Indicadores (Dashboard)

**Propósito:** KPIs del proyecto y del sistema

```
PROYECTO: Construcción Acero 2024
┌──────────────────────────────────────────────────────┐

SALUD DEL PROYECTO
┌─────────────────────┬──────────────────────────────┐
│ Avance Físico       │ 75% ▓▓▓▓▓▓▓▓░░              │
│ Avance Financiero   │ 82% ▓▓▓▓▓▓▓▓▓░              │
│ Varianza Presup     │ +2% (bajo control)           │
│ Días en Retraso     │ 3 días ⚠️                    │
└─────────────────────┴──────────────────────────────┘

EQUIPO
┌──────────────┬─────────┬──────────┬────────────────┐
│ Responsable  │ Activas │ Atrasadas│ % Eficiencia   │
├──────────────┼─────────┼──────────┼────────────────┤
│ Ing. Jorge   │ 5       │ 0        │ 95%            │
│ Ing. Carlos  │ 3       │ 1        │ 78% ⚠️         │
│ Arq. María   │ 4       │ 0        │ 100%           │
│ Ing. Pedro   │ 2       │ 0        │ 85%            │
└──────────────┴─────────┴──────────┴────────────────┘

PRÓXIMOS VENCIMIENTOS (7 días)
1. ⚠️ Documentación (Revisión) - Arq. María - Vence HOY
2. ⚠️ Cálculos Estructurales - Ing. Carlos - Vence en 2d
3. ✓ Diseño Estructural - Ing. Jorge - Vence en 5d
```

---

## 🔐 FASE 3: Reglas de Negocio y Permisos
### (Semanas 5-6)

### 3.1 Transiciones de Estado

```
PROYECTO
No Negociación → Negociación → Contratado → Planificación 
    ↓                              ↓              ↓
  [Usuario]               [PM Proyecto]    [PM Proyecto]
  
Planificación → Ejecución → Cierre Administrativo → Cerrado
    ↓               ↓               ↓                  ↓
[Dirección]   [PM Proyecto]  [Contabilidad]    [Sistema]

Cualquier estado → Cancelado (solo Dirección)

NODO / ACTIVIDAD / ENTREGABLE
No Iniciado → En Proceso → En Revisión → Aprobado → Terminado
                              ↓
                          Rechazado → En Proceso (regresa)

Cualquier estado → Bloqueado
Cualquier estado → Cancelado

EVIDENCIA
No Subida → Subida → En Revisión → Aprobada
                          ↓
                      Rechazada → En Revisión (regresa)
```

### 3.2 Reglas Automáticas

```
1. UN NODO PASA A "BLOQUEADO" SI:
   - Una de sus dependencias previas está en "Cancelado"
   - Un nodo que depende de él está retrasado más de 2 días

2. UN PROYECTO PASA A AMARILLO (ALERTA) SI:
   - Más del 20% de sus nodos están retrasados
   - Gasto acumulado > presupuesto - 10%
   - Más de 2 actividades en ruta crítica están retrasadas

3. UN PROYECTO PASA A ROJO (CRÍTICO) SI:
   - Más del 40% de sus nodos están retrasados
   - Gasto acumulado > presupuesto - 5%
   - Hito crítico está vencido

4. NOTIFICACIONES AUTOMÁTICAS:
   - Responsable: 3 días antes de vencimiento
   - Responsable: 1 día antes de vencimiento
   - Responsable: Vencido (cada 8 horas)
   - PM Proyecto: Si alguno de sus nodos entra a estado de bloqueo
   - Dirección: Si proyecto pasa a ROJO
   - Aprobador: Cuando hay evidencia en revisión (cada 24h)

5. CÁLCULOS AUTOMÁTICOS:
   - % Avance de Nodo = Promedio ponderado de sus actividades
   - % Avance de Proyecto = Promedio de sus nodos
   - Días de Retraso = MAX(0, HOY - fecha_fin_planificada)
   - Eficiencia = horas_reales / horas_estimadas
   - Ruta Crítica = camino más largo en la red de dependencias

6. RESTRICCIONES:
   - No puedes aprobar tu propio entregable (debe ser otro)
   - No puedes cancelar un nodo si otros dependen de él
   - No puedes cambiar fecha a un hito si alguno de sus nodos está en proceso
   - No puedes cambiar responsable de una actividad en proceso
```

### 3.3 Permisos por Rol

```
ROLES BASE:
1. Administrador: Acceso total
2. Director General: Acceso a todos los proyectos, puede cambiar PM
3. PM (Project Manager): Puede ver/editar su proyecto, asignar tareas
4. Líder de Área: Puede ver/asignar tareas de su área
5. Ejecutor: Puede actualizar su propia tareas, crear evidencias
6. Revisor: Puede aprobar/rechazar entregables
7. Consultor: Solo lectura de información pública

MATRIZ DE PERMISOS DETALLADA:

┌─────────────────┬──────┬────────┬────┬─────────┬────────┬────────┬──────────┐
│ Acción          │Admin │Director│ PM │Líder    │Ejecutor│Revisor │Consultor │
├─────────────────┼──────┼────────┼────┼─────────┼────────┼────────┼──────────┤
│Ver Proyecto     │  ✓   │   ✓    │ ✓* │    ✓*   │   ✓*   │   ✓*   │    ✓*    │
│Editar Proyecto  │  ✓   │   ✓    │ ✓* │    ✗    │   ✗    │   ✗    │    ✗     │
│Crear Nodo       │  ✓   │   ✓    │ ✓* │    ✓*   │   ✗    │   ✗    │    ✗     │
│Asignar Tarea    │  ✓   │   ✓    │ ✓* │    ✓*   │   ✗    │   ✗    │    ✗     │
│Cambiar Estado   │  ✓   │   ✓    │ ✓* │    ✓*   │   ✓**  │   ✗    │    ✗     │
│Aprobar Entrgble │  ✓   │   ✓    │ ✓* │    ✓    │   ✗    │   ✓    │    ✗     │
│Crear Evidencia  │  ✓   │   ✓    │ ✓* │    ✓*   │   ✓    │   ✗    │    ✗     │
│Cambiar Fechas   │  ✓   │   ✓    │ ✓* │    ✓*   │   ✗    │   ✗    │    ✗     │
│Cancelar Nodo    │  ✓   │   ✓    │ ✓* │    ✗    │   ✗    │   ✗    │    ✗     │
│Ver Indicadores  │  ✓   │   ✓    │ ✓* │    ✓    │   ✓*   │   ✓*   │    ✓*    │
│Exportar Reportes│  ✓   │   ✓    │ ✓* │    ✓*   │   ✓*   │   ✓*   │    ✗     │

Leyenda:
✓  = Acceso completo
✓* = Acceso solo a su proyecto/área
✓**= Solo propio progreso
✗  = Sin acceso
```

---

## 🚀 FASE 4: Automatizaciones y Eventos
### (Semanas 7-8)

### 4.1 Flujos Automáticos

```
FLUJO 1: Cuando se crea un PROYECTO de tipo 3
├─ Automáticamente crear nodos base:
│  ├─ Nodo: Revisión de Especificaciones (área Proyectos)
│  ├─ Nodo: Análisis de Presupuesto (área Costos)
│  ├─ Nodo: Ingeniería (área Ingeniería)
│  └─ Nodo: Construcción (área Construcción)
├─ Configurar dependencias:
│  └─ Ingeniería depende de Revisión
│  └─ Construcción depende de Ingeniería
└─ Enviar notificación al PM y líderes de área

FLUJO 2: Cuando un ENTREGABLE pasa a "En Revisión"
├─ Notificar al revisor designado
├─ Crear tarea de revisión
├─ Establecer deadline de revisión (+2 días)
└─ Si no se revisa en 2 días, escalar a PM

FLUJO 3: Cuando un NODO pasa a "Bloqueado"
├─ Notificar al responsable del nodo
├─ Notificar al responsable del nodo bloqueador
├─ Crear alerta en dashboard
├─ Incluir razón del bloqueo en historial
└─ Si se desbloquea, crear evidencia automática

FLUJO 4: Fin de mes - CIERRE DE ESTIMACIÓN
├─ Obtener todos los nodos "En Proceso" o "Completados"
├─ Calcular avance físico total
├─ Calcular gasto acumulado
├─ Generar reporte de estimación
├─ Enviar a Contabilidad
└─ Actualizar estado de proyecto si es necesario

FLUJO 5: Control de Horas
├─ Si Eficiencia > 130% (actividad tardó mucho más)
│  └─ Notificar a Líder de Área
├─ Si Eficiencia < 70% (actividad fue muy rápida)
│  └─ Validar con responsable
└─ Generar reporte semanal de eficiencia por persona
```

### 4.2 Eventos y Webhooks

```
EVENTOS A REGISTRAR:
- proyecto.creado
- proyecto.estado_cambiado
- nodo.asignado
- nodo.bloqueado
- nodo.desbloquead
- actividad.completada
- entregable.subido
- entregable.aprobado
- entregable.rechazado
- evidencia.creada
- relacion.creada
- persona.asignada
- notification.enviada

INTEGRACIONES POSIBLES:
- Slack: Notificaciones en tiempo real
- Email: Resúmenes diarios/semanales
- Calendar: Hitos y vencimientos
- Drive: Almacenamiento de archivos
- WhatsApp: Alertas críticas
```

---

## 📊 FASE 5: Reportería e Indicadores
### (Semanas 9-10)

### 5.1 Reportes Operativos

```
1. REPORTE DIARIO (Para PM)
   - Estado de proyecto (Avance físico, financiero, varianza)
   - Nodos retrasados (cantidad, % del total)
   - Personas sobrecargas (más de 5 tareas activas)
   - Próximos vencimientos (7 días)
   - Alertas críticas
   - Bloqueos activos

2. REPORTE SEMANAL (Para Dirección)
   - Resumen de todos los proyectos
   - Proyectos en rojo/amarillo
   - Cumplimiento de hitos
   - Eficiencia del equipo
   - Riesgos detectados
   - Cambios de estado

3. REPORTE DE ESTIMACIÓN (Para Contabilidad)
   - Avance físico %
   - Gasto acumulado $
   - Porcentaje de facturación posible
   - Análisis de varianzas
   - Proyección de cierre

4. REPORTE DE RECURSOS (Para RH)
   - Carga de trabajo por persona
   - Horas estimadas vs reales
   - Eficiencia individual
   - Capacitación/vacíos identificados
   - Rotación de personal por proyecto

5. REPORTE DE RIESGOS
   - Proyectos en riesgo (estado rojo)
   - Nodos críticos retrasados
   - Dependencias bloqueadas
   - Personas clave ausentes
   - Cambios de alcance no controlados

6. REPORTE DE CALIDAD
   - Entregables rechazados (cantidad, % de rechazo)
   - Causas de rechazo más frecuentes
   - Tiempo promedio de aprobación
   - Personas con mayor/menor tasa de rechazo
   - Evidencias incompletas
```

### 5.2 Indicadores Clave (KPIs)

```
NIVEL PROYECTO:
├─ Avance Físico (%) = Promedio ponderado de nodos
├─ Avance Financiero (%) = Gasto acumulado / Presupuesto total
├─ Índice de Desempeño de Costo (CPI) = Trabajo realizado / Gasto real
├─ Índice de Desempeño de Cronograma (SPI) = Trabajo realizado / Trabajo planificado
├─ Varianza = Costo real - Costo esperado
├─ Varianza de Cronograma = Actividades retrasadas / Total de actividades
├─ Estado Proyecto = VERDE / AMARILLO / ROJO
└─ Días en Riesgo = Días en que estuvo en ROJO

NIVEL EQUIPO:
├─ Eficiencia = Horas reales / Horas estimadas (meta: 0.9-1.1)
├─ Tasa de Cumplimiento = Tareas completadas a tiempo / Total de tareas
├─ Carga de Trabajo = Tareas activas por persona (meta: 3-5)
├─ Tiempo de Ciclo = Días promedio para completar una tarea
└─ Tasa de Rechazo = Entregables rechazados / Total entregables

NIVEL SISTEMA:
├─ Cobertura de Proyectos = Proyectos en sistema / Total de proyectos
├─ Adopción = Personas activas / Total de personas
├─ Calidad de Datos = Nodos con información completa / Total de nodos
├─ Actualización = Nodos actualizados en últimos 7 días / Total
└─ Satisfacción = Encuesta trimestral de usuarios
```

---

## 🎯 FASE 6: MVP - Definición
### (Semana 11)

### 6.1 Qué Entra en V1

```
✅ MÓDULOS INCLUIDOS:

1. GESTIÓN DE PROYECTOS
   ├─ Crear proyecto (tipos 1, 2, 3)
   ├─ Asignar áreas y personas
   ├─ Ver estado básico
   └─ Cambiar fechas y estado general

2. NODOS Y TAREAS
   ├─ Crear nodos simples (sin jerarquía compleja aún)
   ├─ Asignar responsable
   ├─ Cambiar estado
   ├─ Ver dependencias básicas
   └─ Crear hasta 1 nivel de anidación

3. ASIGNACIONES
   ├─ Asignar tarea a persona
   ├─ Ver mis tareas (ejecutor)
   ├─ Actualizar progreso
   └─ Marcar como completada

4. VISTAS
   ├─ Vista de árbol (jerárquica)
   ├─ Vista Kanban simplificado (3 estados: No iniciado, En Proceso, Completado)
   ├─ Listado de tareas
   └─ Dashboard básico (solo avance proyecto)

5. ENTREGABLES Y EVIDENCIAS
   ├─ Subir archivo como evidencia
   ├─ Marcar como evidencia de entregable
   ├─ Revisor puede aprobar/rechazar
   └─ Historial simple

6. NOTIFICACIONES
   ├─ Tareas asignadas
   ├─ Vencimientos próximos
   ├─ Cambios de estado en mis tareas
   └─ Email básico

7. REPORTES
   ├─ Reporte diario (PDF)
   ├─ Estado general del proyecto
   ├─ Avance físico
   └─ Exportar a Excel

8. PERMISOS BÁSICOS
   ├─ Admin, PM, Ejecutor, Revisor
   └─ Sin permisos granulares complejos

❌ NO INCLUIDOS EN V1 (Para V2/V3):

- Jerarquía compleja de nodos (multiples niveles)
- Relaciones explícitas entre nodos (depende de, genera, etc.)
- Gantt chart interactivo
- Visualización de grafo de dependencias
- Automatizaciones complejas
- Webhooks e integraciones externas
- Tipos de proyecto 3a, 4, 5 (solo básicos)
- Análisis de ruta crítica
- Presupuestos y gastos en detalle
- Múltiples idiomas
- Sistema de roles granulares
- Importar/exportar masivo
- Historial completo de cambios
```

### 6.2 Timeline MVP

```
FASE 1: Backend API y Datos (Semanas 1-3)
├─ Definir esquema SQL
├─ Crear tablas
├─ Implementar endpoints REST
└─ Autenticación y autorización básica

FASE 2: Frontend Básico (Semanas 4-6)
├─ Interfaz de login
├─ Dashboard
├─ Listado de proyectos
├─ Crear proyecto
├─ Vista Kanban
└─ Asignar tareas

FASE 3: Entregables y Revisiones (Semanas 7-8)
├─ Subir evidencias
├─ Revisar/aprobar
├─ Historial
└─ Notificaciones básicas

FASE 4: Reportería (Semana 9)
├─ Dashboard mejorado
├─ Reporte PDF diario
├─ Exportar Excel
└─ Gráficas básicas

FASE 5: Pulido y Testing (Semana 10)
├─ Testing completo
├─ Documentación
├─ Training de usuarios
└─ Deploy

LANZAMIENTO: Final de semana 10
```

---

## 🗺️ Roadmap Post-MVP

```
TRIMESTRE 2 (Semanas 11-26):
├─ V1.1: Jerarquía de nodos completa
├─ V1.2: Relaciones explícitas (depende de, genera)
├─ V1.3: Gantt interactivo
├─ V1.4: Visualización de dependencias en grafo
└─ V2.0: Presupuestos y análisis financiero

TRIMESTRE 3 (Semanas 27-39):
├─ V2.1: Tipos de proyecto 3a, 4, 5
├─ V2.2: Automatizaciones complejas
├─ V2.3: Integraciones (Slack, Drive, Email)
├─ V2.4: Análisis de ruta crítica
└─ V3.0: Sistema de roles granulares

TRIMESTRE 4:
├─ V3.1: Mobile app (lectura)
├─ V3.2: Importación/exportación masiva
├─ V3.3: Análisis predictivo y alertas
├─ V3.4: Múltiples idiomas
└─ V4.0: IA para optimización de recursos
```

---

## 💻 Stack Tecnológico Recomendado

```
BACKEND:
- Node.js + Express.js o Python + FastAPI
- PostgreSQL o MySQL (base de datos relacional)
- Redis (caché y notificaciones)
- JWT (autenticación)
- Bcrypt (hashing de contraseñas)

FRONTEND:
- React o Vue.js
- Redux o Pinia (state management)
- Material-UI o Tailwind CSS (UI components)
- D3.js o Visx (para gráficos complejos)
- Socket.io (notificaciones en tiempo real)

INFRAESTRUCTURA:
- Docker (containerización)
- CI/CD (GitHub Actions o GitLab CI)
- Cloud (AWS, Azure o GCP)
- S3 o equivalente (almacenamiento de archivos)
- Sentry (error tracking)

HERRAMIENTAS:
- Git + GitHub
- Postman (API testing)
- Jest (unit testing)
- Cypress (E2E testing)
- Figma (diseño de UI)
```

---

## 📋 Próximos Pasos Inmediatos

1. **Esta semana:**
   - [ ] Validar modelo de datos con stakeholders
   - [ ] Crear documento detallado de entidades (con ejemplos)
   - [ ] Definir permisos específicos por rol
   
2. **Próximas 2 semanas:**
   - [ ] Hacer diseño de UI/UX (wireframes)
   - [ ] Crear especificación de API (Swagger/OpenAPI)
   - [ ] Configurar repositorio Git
   
3. **Semanas 3-4:**
   - [ ] Empezar desarrollo backend (autenticación + CRUD básico)
   - [ ] Empezar desarrollo frontend (layout base)

---

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Estado:** En desarrollo de especificaciones
