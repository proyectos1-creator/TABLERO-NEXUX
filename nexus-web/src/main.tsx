import { useMemo, useState } from 'react';
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Box,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Command,
  FileCheck2,
  Filter,
  GitBranch,
  Layers3,
  Link2,
  ListFilter,
  Map,
  MoreHorizontal,
  Network,
  PanelRight,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './styles.css';

type NodeKind = 'proyecto' | 'objetivo' | 'hito' | 'actividad' | 'entregable';
type NodeStatus = 'terminado' | 'en_proceso' | 'en_revision' | 'bloqueado' | 'no_iniciado';

type NexusNodeData = {
  label: string;
  code: string;
  kind: NodeKind;
  status: NodeStatus;
  progress: number;
  owner: string;
  area: string;
  due: string;
  description: string;
  critical?: boolean;
  blockedBy?: string;
};

type NexusNode = Node<NexusNodeData, 'nexus'>;

const nodeKindLabels: Record<NodeKind, string> = {
  proyecto: 'Proyecto',
  objetivo: 'Objetivo',
  hito: 'Hito',
  actividad: 'Actividad',
  entregable: 'Entregable',
};

const statusLabels: Record<NodeStatus, string> = {
  terminado: 'Terminado',
  en_proceso: 'En proceso',
  en_revision: 'En revision',
  bloqueado: 'Bloqueado',
  no_iniciado: 'No iniciado',
};

const seedNodes: NexusNode[] = [
  {
    id: 'project', type: 'nexus', position: { x: 360, y: 40 },
    data: { label: 'CEDIS IRAPUATO LALA', code: 'PRY-24-001', kind: 'proyecto', status: 'en_proceso', progress: 73, owner: 'Jorge Bautista', area: 'Direccion de proyectos', due: '30 Jun 2025', description: 'Construccion y puesta en marcha del centro de distribucion.', critical: true },
  },
  {
    id: 'objective', type: 'nexus', position: { x: 360, y: 220 },
    data: { label: 'Ejecutar estructura metalica', code: 'OBJ-001', kind: 'objetivo', status: 'en_proceso', progress: 68, owner: 'Jorge Bautista', area: 'Construccion', due: '14 Jun 2025', description: 'Coordinar ingenieria, suministro e instalacion hasta liberar la estructura.' },
  },
  {
    id: 'engineering', type: 'nexus', position: { x: 40, y: 420 },
    data: { label: 'Ingenieria aprobada', code: 'HIT-001', kind: 'hito', status: 'terminado', progress: 100, owner: 'Carlos Mendoza', area: 'Ingenieria', due: '22 Ene 2025', description: 'Planos y calculos estructurales aprobados para compra y fabricacion.' },
  },
  {
    id: 'materials', type: 'nexus', position: { x: 360, y: 420 },
    data: { label: 'Materiales en sitio', code: 'HIT-002', kind: 'hito', status: 'en_proceso', progress: 60, owner: 'Pedro Lopez', area: 'Compras', due: '28 Feb 2025', description: 'Asegurar recepcion, inspeccion y trazabilidad del acero.', critical: true },
  },
  {
    id: 'installation', type: 'nexus', position: { x: 680, y: 420 },
    data: { label: 'Instalacion completada', code: 'HIT-003', kind: 'hito', status: 'no_iniciado', progress: 0, owner: 'Manuel Garcia', area: 'Construccion', due: '30 Jun 2025', description: 'Montaje, inspeccion final y entrega de la estructura.' },
  },
  {
    id: 'cad', type: 'nexus', position: { x: -80, y: 650 },
    data: { label: 'Diseno CAD', code: 'ACT-001', kind: 'actividad', status: 'terminado', progress: 100, owner: 'Carlos Mendoza', area: 'Ingenieria', due: '22 Ene', description: 'Planos de fabricacion y montaje.' },
  },
  {
    id: 'purchase', type: 'nexus', position: { x: 230, y: 650 },
    data: { label: 'Orden de compra acero', code: 'ACT-005', kind: 'actividad', status: 'terminado', progress: 100, owner: 'Pedro Lopez', area: 'Compras', due: '25 Ene', description: 'Orden de compra liberada con proveedor principal.' },
  },
  {
    id: 'inspection', type: 'nexus', position: { x: 540, y: 650 },
    data: { label: 'Inspeccion de recepcion', code: 'ACT-007', kind: 'actividad', status: 'en_revision', progress: 82, owner: 'Pedro Lopez', area: 'Calidad', due: 'HOY', description: 'Validar certificados, cantidades y condiciones del acero.', critical: true },
  },
  {
    id: 'site', type: 'nexus', position: { x: 850, y: 650 },
    data: { label: 'Preparar sitio', code: 'ACT-008', kind: 'actividad', status: 'bloqueado', progress: 12, owner: 'Manuel Garcia', area: 'Construccion', due: '01 Mar', description: 'Liberar frente de trabajo para iniciar montaje.', blockedBy: 'ACT-007' },
  },
  {
    id: 'evidence', type: 'nexus', position: { x: 520, y: 860 },
    data: { label: 'Certificados de calidad', code: 'ENT-003', kind: 'entregable', status: 'en_revision', progress: 82, owner: 'Pedro Lopez', area: 'Calidad', due: 'HOY', description: 'Evidencia documental de la inspeccion de acero.' },
  },
];

const seedEdges: Edge[] = [
  { id: 'e-project-objective', source: 'project', target: 'objective', type: 'smoothstep', className: 'edge-primary' },
  { id: 'e-objective-engineering', source: 'objective', target: 'engineering', type: 'smoothstep', className: 'edge-primary' },
  { id: 'e-objective-materials', source: 'objective', target: 'materials', type: 'smoothstep', className: 'edge-primary' },
  { id: 'e-objective-installation', source: 'objective', target: 'installation', type: 'smoothstep', className: 'edge-primary' },
  { id: 'e-engineering-cad', source: 'engineering', target: 'cad', type: 'smoothstep' },
  { id: 'e-engineering-purchase', source: 'engineering', target: 'purchase', type: 'smoothstep' },
  { id: 'e-materials-purchase', source: 'materials', target: 'purchase', type: 'smoothstep' },
  { id: 'e-materials-inspection', source: 'materials', target: 'inspection', type: 'smoothstep', className: 'edge-critical' },
  { id: 'e-installation-site', source: 'installation', target: 'site', type: 'smoothstep' },
  { id: 'e-inspection-site', source: 'inspection', target: 'site', type: 'smoothstep', className: 'edge-blocked' },
  { id: 'e-inspection-evidence', source: 'inspection', target: 'evidence', type: 'smoothstep', className: 'edge-critical' },
];

const nodeTypes = { nexus: NexusNodeCard };

function NexusNodeCard({ data, selected }: NodeProps<NexusNode>) {
  return (
    <div className={`nexus-node node-${data.kind} ${selected ? 'is-selected' : ''} ${data.critical ? 'is-critical' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="node-topline">
        <span className="node-kind"><CircleDot size={11} />{nodeKindLabels[data.kind]}</span>
        {data.critical && <span className="critical-mark"><AlertTriangle size={12} /></span>}
      </div>
      <div className="node-code">{data.code}</div>
      <div className="node-title">{data.label}</div>
      <div className="node-progress-row"><span>{data.progress}% avance</span><strong>{statusLabels[data.status]}</strong></div>
      <div className="node-progress"><span style={{ width: `${data.progress}%` }} /></div>
      <div className="node-owner"><span className="owner-avatar">{data.owner.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>{data.owner}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function App() {
  const [activeNodeId, setActiveNodeId] = useState('materials');
  const [kindFilter, setKindFilter] = useState<NodeKind | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<NodeStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const visibleNodes = useMemo(() => seedNodes.filter((node) => {
    const matchesKind = kindFilter === 'all' || node.data.kind === kindFilter;
    const matchesStatus = statusFilter === 'all' || node.data.status === statusFilter;
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${node.data.label} ${node.data.code} ${node.data.owner}`.toLowerCase().includes(needle);
    return matchesKind && matchesStatus && matchesQuery;
  }), [kindFilter, statusFilter, query]);

  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = seedEdges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
  const activeNode = seedNodes.find((node) => node.id === activeNodeId) ?? seedNodes[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Network size={18} /></div><span>NEXUS</span><small>CONSTRUCTION</small></div>
        <div className="workspace-switcher"><span className="switcher-dot" /><div><small>Proyecto activo</small><strong>CEDIS IRAPUATO</strong></div><ChevronDown size={15} /></div>
        <nav className="main-nav">
          <div className="nav-caption">Explorar</div>
          <button className="nav-item is-active"><Network size={18} />Red de nodos<span className="nav-count">24</span></button>
          <button className="nav-item"><Map size={18} />Mapa de dependencias</button>
          <button className="nav-item"><Layers3 size={18} />Entregables<span className="nav-count">8</span></button>
          <button className="nav-item"><Users size={18} />Equipo</button>
          <div className="nav-caption nav-caption-spaced">Sistema</div>
          <button className="nav-item"><Activity size={18} />Indicadores</button>
          <button className="nav-item"><ShieldCheck size={18} />Auditoria</button>
        </nav>
        <div className="sidebar-bottom"><div className="sync-status"><span /><div><strong>Datos sincronizados</strong><small>hace 4 min</small></div></div><button className="help-button"><Command size={15} /> Atajos de trabajo</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Proyectos</span><ChevronDown size={14} /><strong>CEDIS IRAPUATO LALA</strong><span className="project-status">En ejecucion</span></div>
          <div className="top-actions"><div className="global-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en la red..." /><kbd>/</kbd></div><button className="icon-button"><Bell size={18} /><i /></button><div className="user-avatar">JB</div></div>
        </header>

        <div className="page-heading"><div><div className="eyebrow"><Sparkles size={13} />Vista de sistema</div><h1>Red de ejecucion</h1><p>La obra como una red de objetivos, dependencias y evidencias.</p></div><div className="heading-actions"><button className="secondary-button"><ShareIcon /> Compartir</button><button className="primary-button"><Plus size={16} /> Nuevo nodo</button></div></div>

        <section className="signal-strip"><div className="signal-title"><GitBranch size={18} /><div><strong>Salud de la red</strong><span>Lectura en tiempo real del proyecto</span></div></div><div className="signal-item"><span className="signal-label">Avance fisico</span><strong>73%</strong><span className="signal-line"><i style={{ width: '73%' }} /></span></div><div className="signal-item"><span className="signal-label">Nodos activos</span><strong>18 <small>/ 24</small></strong></div><div className="signal-item signal-alert"><span className="signal-label">Bloqueantes</span><strong>02</strong><AlertTriangle size={15} /></div><div className="signal-item"><span className="signal-label">Proxima fecha</span><strong>HOY <small>inspeccion</small></strong></div></section>

        <section className="network-toolbar"><div className="toolbar-title"><Network size={17} /><strong>Mapa de relaciones</strong><span>{visibleNodes.length} nodos visibles</span></div><div className="toolbar-actions"><button className={`filter-button ${showFilters ? 'is-active' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter size={15} /> Filtrar <span>{kindFilter !== 'all' || statusFilter !== 'all' ? '2' : ''}</span></button><button className="toolbar-icon"><ListFilter size={16} /></button><button className="toolbar-icon"><MoreHorizontal size={17} /></button></div></section>
        {showFilters && <div className="filter-panel"><label>Tipo<select value={kindFilter} onChange={(event) => setKindFilter(event.target.value as NodeKind | 'all')}><option value="all">Todos los tipos</option>{Object.entries(nodeKindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Estado<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as NodeStatus | 'all')}><option value="all">Todos los estados</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className="clear-filter" onClick={() => { setKindFilter('all'); setStatusFilter('all'); }}>Limpiar filtros</button></div>}

        <section className="workspace-grid">
          <div className="graph-panel"><ReactFlowProvider><ReactFlow nodes={visibleNodes} edges={visibleEdges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.18 }} minZoom={0.35} maxZoom={1.25} onNodeClick={(_, node) => setActiveNodeId(node.id)} proOptions={{ hideAttribution: true }}><Background color="#dbe2ea" gap={24} size={1} /><Controls showInteractive={false} /><MiniMap nodeColor={(node) => node.data?.kind === 'proyecto' ? '#e4a853' : '#8aa0b9'} maskColor="rgba(12, 23, 38, 0.08)" /></ReactFlow></ReactFlowProvider><div className="graph-legend"><span><i className="legend-project" />Proyecto</span><span><i className="legend-hito" />Hito</span><span><i className="legend-activity" />Actividad</span><span><i className="legend-blocked" />Dependencia critica</span></div></div>
          <NodeInspector node={activeNode} onClose={() => setActiveNodeId('project')} />
        </section>
      </main>
    </div>
  );
}

function NodeInspector({ node, onClose }: { node: NexusNode; onClose: () => void }) {
  const { data } = node;
  return <aside className="inspector"><div className="inspector-header"><span>Detalle del nodo</span><button onClick={onClose} className="close-button"><X size={16} /></button></div><div className={`inspector-hero hero-${data.kind}`}><div className="inspector-icon">{data.kind === 'hito' ? <Target size={20} /> : data.kind === 'actividad' ? <Activity size={20} /> : data.kind === 'entregable' ? <FileCheck2 size={20} /> : <Box size={20} />}</div><span>{nodeKindLabels[data.kind]}</span><strong>{data.code}</strong></div><div className="inspector-body"><h2>{data.label}</h2><p className="inspector-description">{data.description}</p><div className={`status-pill status-${data.status}`}><span />{statusLabels[data.status]}</div><div className="detail-progress"><div><span>Avance del nodo</span><strong>{data.progress}%</strong></div><div className="detail-progress-bar"><span style={{ width: `${data.progress}%` }} /></div></div><div className="detail-list"><div><span><Users size={15} />Responsable</span><strong>{data.owner}</strong></div><div><span><Layers3 size={15} />Area</span><strong>{data.area}</strong></div><div><span><Clock3 size={15} />Fecha objetivo</span><strong className={data.due === 'HOY' ? 'text-alert' : ''}>{data.due}</strong></div>{data.blockedBy && <div><span><Link2 size={15} />Bloqueado por</span><strong className="text-alert">{data.blockedBy}</strong></div>}</div><div className="inspector-section"><div className="section-heading"><strong>Relaciones</strong><span>3</span></div><div className="relation-row"><span className="relation-dot relation-dot-green" /><div><strong>Ingenieria aprobada</strong><small>Prerequisito completado</small></div><ArrowUpRight size={15} /></div><div className="relation-row"><span className="relation-dot relation-dot-amber" /><div><strong>Inspeccion de recepcion</strong><small>En revision</small></div><ArrowUpRight size={15} /></div></div><button className="full-button"><PanelRight size={16} /> Abrir ficha completa</button></div></aside>;
}

function ShareIcon() { return <Link2 size={15} />; }

export default function Root() { return <App />; }
