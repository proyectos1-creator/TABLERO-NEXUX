import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  FolderKanban, 
  Users, 
  Search, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Calendar,
  Building2,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';

const kpis = [
  { title: "Avance Físico", value: "73%", subtext: "Meta: 80%", progress: 73, color: "text-green-600", bg: "bg-green-600", icon: Activity },
  { title: "Avance Financiero", value: "68%", subtext: "Facturado: $1.7M", progress: 68, color: "text-blue-600", bg: "bg-blue-600", icon: TrendingUp },
  { title: "Eficiencia del Equipo", value: "96%", subtext: "Estado: Excelente", progress: 96, color: "text-emerald-600", bg: "bg-emerald-600", icon: Users },
  { title: "Días de Retraso", value: "0", subtext: "Alerta: ACT-007 vence hoy", progress: 100, color: "text-amber-500", bg: "bg-amber-500", icon: Clock },
];

const alerts = [
  { type: "urgent", text: "ACT-007 vence HOY y aún está en revisión. Revisor Ing. Pedro López debe aprobar hoy.", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  { type: "info", text: "Segundo embarque de acero: ETA 27 Feb.", icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
  { type: "success", text: "ACT-005 OC Cliente completada 1 día antes de lo planeado.", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
];

const milestones = [
  { id: 1, title: "HITO 1: Ingeniería Aprobada", status: "Completado", progress: 100, color: "bg-green-500", text: "text-green-600" },
  { id: 2, title: "HITO 2: Materiales en Sitio", status: "En proceso, 60%", progress: 60, color: "bg-blue-500", text: "text-blue-600" },
  { id: 3, title: "HITO 3: Instalación Completada", status: "No iniciado", progress: 0, color: "bg-gray-300", text: "text-gray-500" },
];

const kanbanData = {
  "No Iniciado": [
    { id: "ACT-008", title: "Preparar Sitio", assignee: "Capataz Manuel", due: "01 Mar", tags: [{ text: "Bloqueado", color: "bg-gray-200 text-gray-700" }, { text: "Alta", color: "bg-orange-100 text-orange-700" }] },
    { id: "ACT-009", title: "Montaje Estructura", assignee: "Capataz Manuel", due: "30 Jun", tags: [{ text: "Ruta Crítica", color: "bg-red-100 text-red-700" }] },
  ],
  "En Proceso": [
    { id: "ACT-006", title: "Recepción Acero", assignee: "Ing. Jorge Bautista", due: "28 Feb", progress: 60, tags: [{ text: "Alta", color: "bg-orange-100 text-orange-700" }] },
  ],
  "En Revisión": [
    { id: "ACT-007", title: "Inspección", assignee: "Ing. Pedro López", due: "HOY", tags: [{ text: "Crítica", color: "bg-red-100 text-red-700" }] },
  ],
  "Aprobado": [
    { id: "ACT-001", title: "Diseño CAD", assignee: "Ing. Carlos Mendoza", due: "Aprobado 22 Ene", tags: [{ text: "Completado", color: "bg-green-100 text-green-700" }] },
    { id: "ACT-004", title: "OC Acero al Prov.", assignee: "Ing. Pedro López", due: "Aprobado 25 Ene", subtext: "Eficiencia 93%", tags: [{ text: "Completado", color: "bg-green-100 text-green-700" }] },
  ]
};

const viewLabels = {
  proyectos: 'Proyectos',
  entregables: 'Entregables',
  equipo: 'Equipo',
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'proyectos', label: 'Proyectos', icon: Building2 },
    { id: 'kanban', label: 'Tablero Kanban', icon: KanbanSquare },
    { id: 'entregables', label: 'Entregables', icon: FolderKanban },
    { id: 'equipo', label: 'Equipo', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-lg">N</span>
          </div>
          NEXUS
        </div>
      </div>
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Principal</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">NEXUS Construction v1.0</div>
      </div>
    </aside>
  );
};

const Header = () => (
  <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0">
    <div className="flex items-center gap-2">
      <h1 className="text-slate-800 font-semibold text-lg hidden md:block">
        CEDIS IRAPUATO LALA - <span className="text-slate-500 font-normal">Licitación</span>
      </h1>
      <h1 className="text-slate-800 font-semibold text-lg md:hidden">CEDIS LALA</h1>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="relative hidden lg:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Buscar nodos, tareas..." 
          className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none w-64 transition-all"
        />
      </div>
      
      <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
      
      <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
      
      <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
          JB
        </div>
        <div className="hidden md:block text-sm text-left">
          <div className="font-semibold text-slate-700">Ing. Jorge Bautista</div>
          <div className="text-xs text-slate-500">Project Manager</div>
        </div>
      </div>
    </div>
  </header>
);

const DashboardView = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    {/* KPIs */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
                <h3 className={`text-2xl font-bold mt-1 ${kpi.title === 'Días de Retraso' ? 'text-slate-800' : kpi.color}`}>
                  {kpi.value}
                </h3>
              </div>
              <div className={`p-2 rounded-lg ${kpi.bg} bg-opacity-10 ${kpi.color}`}>
                <Icon size={20} />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
              <div className={`h-1.5 rounded-full ${kpi.bg}`} style={{ width: `${kpi.progress}%` }}></div>
            </div>
            <p className={`text-xs font-medium ${kpi.title === 'Días de Retraso' ? 'text-amber-600' : 'text-slate-500'}`}>
              {kpi.subtext}
            </p>
          </div>
        );
      })}
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Alertas y Notificaciones */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Bell size={18} className="text-slate-500" />
            Alertas y Notificaciones
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todas</button>
        </div>
        <div className="p-2 flex-1">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg mb-2 transition-colors hover:bg-slate-50`}>
                <div className={`mt-0.5 p-2 rounded-full ${alert.bg} ${alert.color} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{alert.text}</p>
                  <p className="text-xs text-slate-400 mt-1">Hace {index === 0 ? '2 horas' : index === 1 ? '5 horas' : '1 día'}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreVertical size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hitos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-slate-500" />
            Hitos del Proyecto (Milestones)
          </h3>
        </div>
        <div className="p-6 flex-1">
          <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {milestones.map((hito, index) => (
              <div key={hito.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Marker */}
                <div className={`flex items-center justify-center w-4 h-4 rounded-full border-4 border-white ${hito.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-5 -translate-x-1/2 md:left-1/2`}></div>
                
                {/* Content */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] ml-12 md:ml-0 p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-slate-800">{hito.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-semibold ${hito.text}`}>{hito.status}</span>
                    </div>
                    {hito.progress > 0 && hito.progress < 100 && (
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                        <div className={`h-1 rounded-full ${hito.color}`} style={{ width: `${hito.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  </div>
);

const KanbanView = () => (
  <div className="h-full flex flex-col animate-in fade-in duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-slate-800">Tablero de Tareas</h2>
        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200">6 activas</span>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          Filtros
        </button>
        <button className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          + Nueva Tarea
        </button>
      </div>
    </div>

    <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar items-start">
      {Object.entries(kanbanData).map(([columnName, tasks]) => (
        <div key={columnName} className="flex flex-col w-80 shrink-0 max-h-full">
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              {columnName === 'No Iniciado' && <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
              {columnName === 'En Proceso' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              {columnName === 'En Revisión' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
              {columnName === 'Aprobado' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
              {columnName}
              <span className="text-slate-400 font-normal ml-1">({tasks.length})</span>
            </h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
          </div>

          {/* Cards Container */}
          <div className="flex-1 bg-slate-100/50 rounded-xl p-2 flex flex-col gap-3 overflow-y-auto border border-slate-200 border-dashed min-h-[200px]">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-grab group">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {task.tags.map((tag, i) => (
                    <span key={i} className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${tag.color}`}>
                      {tag.text}
                    </span>
                  ))}
                </div>
                
                {/* Title */}
                <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug group-hover:text-blue-700 transition-colors">
                  <span className="text-slate-400 font-normal mr-1">{task.id.split('-')[1]}</span> 
                  {task.title}
                </h4>
                
                {/* Progress bar (if any) */}
                {task.progress !== undefined && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 my-3">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                  </div>
                )}
                
                {/* Subtext (if any) */}
                {task.subtext && (
                  <p className="text-xs text-slate-500 my-2 font-medium">{task.subtext}</p>
                )}

                {/* Footer (Assignee & Date) */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5" title={task.assignee}>
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {task.assignee.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <span className="text-xs text-slate-600 truncate max-w-[100px]">{task.assignee}</span>
                  </div>
                  
                  {task.due && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0
                      ${task.due === 'HOY' ? 'text-red-700 bg-red-100' : 
                        task.due.includes('Aprobado') ? 'text-emerald-700' : 'text-slate-500 bg-slate-100'}`}>
                      <Calendar size={10} />
                      {task.due}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PlannedView = ({ view }) => (
  <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
    <div>
      <h2 className="text-xl font-bold text-slate-800">{viewLabels[view]}</h2>
      <p className="mt-2 text-sm text-slate-500">Esta vista está contemplada en el roadmap y se habilitará en la siguiente fase.</p>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Menu Lateral */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        {/* Pestañas (Tabs) de navegación de página */}
        <div className="px-6 pt-6 pb-2 shrink-0 border-b border-slate-200 bg-white">
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 relative -bottom-[1px] ${
                activeTab === 'dashboard' 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Resumen (Dashboard)
            </button>
            <button 
              onClick={() => setActiveTab('kanban')}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 relative -bottom-[1px] ${
                activeTab === 'kanban' 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tablero Kanban
            </button>
          </div>
        </div>

        {/* Área de scroll del contenido */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'kanban' && <KanbanView />}
            {viewLabels[activeTab] && <PlannedView view={activeTab} />}
          </div>
        </main>
      </div>

      {/* Estilos globales para la scrollbar personalizada */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}