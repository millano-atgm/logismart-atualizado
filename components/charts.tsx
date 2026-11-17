'use client'

import type { Ponto } from '@/lib/data'
import { cn } from '@/lib/utils'

const TONES = {
  primary: 'var(--chart-1)',
  success: 'var(--chart-2)',
  warning: 'var(--chart-3)',
  info: 'var(--chart-4)',
} as const

type Tone = keyof typeof TONES

/** Gráfico de área/linha em SVG. Rótulos são renderizados em HTML para manter a legibilidade. */
export function AreaChart({
  data,
  tone = 'primary',
  sufixo = '',
  height = 168,
}: {
  data: Ponto[]
  tone?: Tone
  sufixo?: string
  height?: number
}) {
  const w = 100
  const h = 40
  const valores = data.map((d) => d.valor)
  const max = Math.max(...valores)
  const min = Math.min(...valores)
  const span = max - min || 1
  const pad = span * 0.35
  const top = max + pad
  const bottom = Math.max(0, min - pad)

  const pontos = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * w
    const y = h - ((d.valor - bottom) / (top - bottom || 1)) * h
    return { x, y, ...d }
  })

  const linha = pontos.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' L ')
  const area = `M ${linha} L ${w},${h} L 0,${h} Z`
  const cor = TONES[tone]
  const gradId = `grad-${tone}`

  return (
    <div className="flex flex-col gap-2">
      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Gráfico de linha"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={cor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1="0"
              x2={w}
              y1={h * g}
              y2={h * g}
              stroke="currentColor"
              strokeWidth="0.15"
              className="text-border"
            />
          ))}
          <path d={area} fill={`url(#${gradId})`} />
          <path
            d={`M ${linha}`}
            fill="none"
            stroke={cor}
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pontos.map((p) => (
            <circle
              key={p.label}
              cx={p.x}
              cy={p.y}
              r="0.8"
              fill="var(--background)"
              stroke={cor}
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="flex items-start justify-between gap-1">
        {data.map((d) => (
          <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
            <span className="truncate font-mono text-[11px] text-foreground">
              {d.valor.toLocaleString('pt-BR')}
              {sufixo}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Gráfico de barras verticais em HTML — sempre legível e responsivo. */
export function BarChart({
  data,
  tone = 'primary',
  sufixo = '',
  height = 168,
}: {
  data: Ponto[]
  tone?: Tone
  sufixo?: string
  height?: number
}) {
  const max = Math.max(...data.map((d) => d.valor))
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-1.5 sm:gap-2" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col justify-end gap-1">
            <span className="text-center font-mono text-[11px] text-muted-foreground">
              {d.valor.toLocaleString('pt-BR')}
              {sufixo}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${Math.max(6, (d.valor / (max || 1)) * 100)}%`,
                background: `linear-gradient(to top, ${TONES[tone]}, color-mix(in oklab, ${TONES[tone]} 55%, transparent))`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 sm:gap-2">
        {data.map((d) => (
          <span
            key={d.label}
            className="min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Lista de barras horizontais para comparações (ex.: eficiência por veículo). */
export function RankBar({
  items,
  sufixo = '',
  referencia,
}: {
  items: { label: string; valor: number; tone?: Tone }[]
  sufixo?: string
  referencia?: number
}) {
  const max = Math.max(...items.map((i) => i.valor))
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-xs text-muted-foreground sm:w-28">
            {item.label}
          </span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.valor / (max || 1)) * 100}%`,
                background: TONES[item.tone ?? 'primary'],
              }}
            />
          </div>
          <span
            className={cn(
              'w-16 shrink-0 text-right font-mono text-xs',
              referencia !== undefined && item.valor < referencia
                ? 'text-warning'
                : 'text-foreground',
            )}
          >
            {item.valor.toLocaleString('pt-BR')}
            {sufixo}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Medidor circular para percentuais (ex.: utilização da frota). */
export function Gauge({
  valor,
  label,
  tone = 'primary',
}: {
  valor: number
  label: string
  tone?: Tone
}) {
  const r = 42
  const c = 2 * Math.PI * r
  const preenchido = (Math.min(100, valor) / 100) * c
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-32">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={TONES[tone]}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${preenchido} ${c}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold text-foreground">{valor}%</span>
        </div>
      </div>
      <span className="text-center text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
