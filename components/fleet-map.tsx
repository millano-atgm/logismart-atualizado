'use client'

import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Rota, Vehicle } from '@/lib/data'
import { cn } from '@/lib/utils'
import 'leaflet/dist/leaflet.css'

type FleetMapProps = {
  rotas: Rota[]
  veiculos: Vehicle[]
  selecionada: string | null
  onSelecionar: (id: string) => void
  ultimaAtualizacao: string
}

const stops: Record<string, [number, number][]> = {
  'SP → Campinas': [[-23.5505, -46.6333], [-22.9056, -47.0608]],
  'SP → Santos': [[-23.5505, -46.6333], [-23.9608, -46.3336]],
  'Campinas → SP': [[-22.9056, -47.0608], [-23.5505, -46.6333]],
  'SP → RJ': [[-23.5505, -46.6333], [-22.9068, -43.1729]],
  BR: [[-23.5505, -46.6333], [-22.9068, -43.1729]],
}

const fallbackRoute: [number, number][] = [[-23.5505, -46.6333], [-22.9068, -43.1729]]

function routePoints(route: Rota) {
  const key = route.nome.includes('BR-116') ? 'BR' : route.nome
  const points = stops[key] ?? fallbackRoute
  const [start, end] = points
  const bend: [number, number] = [(start[0] + end[0]) / 2 + 0.18, (start[1] + end[1]) / 2 - 0.18]
  return [start, bend, end]
}

function interpolate(points: [number, number][], progress: number): [number, number] {
  const t = Math.max(0.05, Math.min(0.95, progress / 100))
  const start = t < 0.5 ? points[0] : points[1]
  const end = t < 0.5 ? points[1] : points[2]
  const segmentProgress = t < 0.5 ? t * 2 : (t - 0.5) * 2
  return [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress,
  ]
}

function markerIcon(status: Vehicle['status'], selected: boolean) {
  const color = status === 'atrasado' ? '#f59e0b' : status === 'atencao' ? '#ef4444' : status === 'manutencao' ? '#94a3b8' : '#22c55e'
  return L.divIcon({
    className: 'fleet-marker-wrapper',
    html: `<span class="fleet-marker ${selected ? 'fleet-marker-selected' : ''}" style="--marker-color:${color}"><span>●</span></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function MapViewport() {
  const map = useMap()
  useEffect(() => {
    map.setView([-23.15, -46.65], 7.2)
  }, [map])
  return null
}

export function FleetMap({ rotas, veiculos, selecionada, onSelecionar, ultimaAtualizacao }: FleetMapProps) {
  const routeById = new Map(rotas.map((route) => [route.veiculoId, route]))
  const activeVehicles = veiculos.filter((vehicle) => routeById.has(vehicle.id))

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-xl border border-border bg-muted sm:h-[520px]">
      <MapContainer center={[-23.15, -46.65]} zoom={7.2} minZoom={5} maxZoom={14} scrollWheelZoom className="h-full w-full">
        <MapViewport />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {rotas.map((route) => {
          const points = routePoints(route)
          const selected = selecionada === route.id
          return <Polyline key={route.id} positions={points} pathOptions={{ color: route.transito === 'intenso' ? '#f59e0b' : '#0ea5e9', weight: selected ? 6 : 4, opacity: selected ? 0.95 : 0.7, dashArray: route.alternativa ? '10 8' : undefined }} />
        })}
        {activeVehicles.map((vehicle) => {
          const route = routeById.get(vehicle.id)
          if (!route) return null
          const position = interpolate(routePoints(route), route.progresso)
          return (
            <Marker key={vehicle.id} position={position} icon={markerIcon(vehicle.status, selecionada === route.id)} eventHandlers={{ click: () => onSelecionar(route.id) }}>
              <Popup>
                <div className="min-w-[210px] space-y-2 text-sm">
                  <div><strong>{vehicle.nome}</strong><p className="text-xs text-slate-500">{vehicle.motorista} · {route.nome}</p></div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs"><span><dt className="text-slate-500">Status</dt><dd className="font-medium">{vehicle.status === 'em_rota' ? 'Em rota' : vehicle.status === 'atrasado' ? 'Atrasado' : vehicle.status === 'atencao' ? 'Atenção' : 'Manutenção'}</dd></span><span><dt className="text-slate-500">Velocidade</dt><dd className="font-medium">{vehicle.velocidadeMedia} km/h</dd></span><span><dt className="text-slate-500">Consumo</dt><dd className="font-medium">{vehicle.consumo ? `${vehicle.consumo.toFixed(1)} km/L` : '—'}</dd></span><span><dt className="text-slate-500">Atualização</dt><dd className="font-medium">{ultimaAtualizacao}</dd></span></dl>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-lg border border-border/80 bg-background/90 px-3 py-2 shadow-sm backdrop-blur"><p className="text-sm font-semibold">Mapa operacional</p><p className="text-xs text-muted-foreground">São Paulo · Campinas · Santos · Rio de Janeiro</p></div>
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] flex flex-wrap gap-2 rounded-lg border border-border/80 bg-background/90 px-3 py-2 text-[11px] shadow-sm backdrop-blur"><span className="font-medium">Veículos:</span><span className="text-success">● Em rota</span><span className="text-warning">● Atrasado</span><span className="text-destructive">● Atenção</span></div>
    </div>
  )
}

