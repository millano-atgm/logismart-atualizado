'use client'

import Link from 'next/link'
import { ArrowRight, CircleCheck, CircleDot, TriangleAlert, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  statusLabel,
  transitoLabel,
  type Insight,
  type Severidade,
  type Transito,
  type VehicleStatus,
} from '@/lib/data'
import { cn } from '@/lib/utils'

// ---------- Status ----------

const statusTone: Record<VehicleStatus, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  em_rota: 'success',
  atencao: 'danger',
  atrasado: 'warning',
  manutencao: 'primary',
}

export function StatusBadge({ status }: { status: VehicleStatus }) {
  const Icon =
    status === 'manutencao'
      ? Wrench
      : status === 'em_rota'
        ? CircleCheck
        : status === 'atrasado'
          ? CircleDot
          : TriangleAlert
  return (
    <Badge tone={statusTone[status]}>
      <Icon className="size-3" aria-hidden />
      {statusLabel[status]}
    </Badge>
  )
}

export function SeveridadeBadge({ severidade }: { severidade: Severidade }) {
  const map = {
    critico: { tone: 'danger', label: 'Crítico' },
    atencao: { tone: 'warning', label: 'Atenção' },
    info: { tone: 'success', label: 'Informativo' },
  } as const
  const item = map[severidade]
  return <Badge tone={item.tone}>{item.label}</Badge>
}

export function TransitoBadge({ transito }: { transito: Transito }) {
  const tone = transito === 'livre' ? 'success' : transito === 'moderado' ? 'warning' : 'danger'
  return <Badge tone={tone}>{transitoLabel[transito]}</Badge>
}

// ---------- Estrutura de página ----------

export function PageIntro({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">{titulo}</h2>
      <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
        {descricao}
      </p>
    </div>
  )
}

export function Section({
  titulo,
  descricao,
  acao,
  children,
  className,
}: {
  titulo: string
  descricao?: string
  acao?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-semibold tracking-tight">{titulo}</h3>
          {descricao ? <p className="text-xs text-muted-foreground">{descricao}</p> : null}
        </div>
        {acao}
      </div>
      {children}
    </section>
  )
}

// ---------- Cartões ----------

export function MetricCard({
  titulo,
  valor,
  detalhe,
  icone: Icone,
  tone = 'primary',
  pulse,
}: {
  titulo: string
  valor: string
  detalhe: string
  icone: React.ComponentType<{ className?: string }>
  tone?: 'primary' | 'success' | 'warning' | 'danger'
  pulse?: boolean
}) {
  const toneClass = {
    primary: 'text-primary bg-primary/12 border-primary/25',
    success: 'text-success bg-success/12 border-success/25',
    warning: 'text-warning bg-warning/12 border-warning/25',
    danger: 'text-destructive bg-destructive/12 border-destructive/25',
  }[tone]

  return (
    <Card className="ls-rise transition-colors hover:border-primary/30">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">{titulo}</span>
          <span className={cn('grid size-8 place-items-center rounded-lg border', toneClass)}>
            <Icone className="size-4" />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-2xl font-semibold tracking-tight">{valor}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {pulse ? (
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
            ) : null}
            {detalhe}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiTile({
  label,
  valor,
  nota,
  destaque,
}: {
  label: string
  valor: string
  nota?: string
  destaque?: 'positivo' | 'negativo'
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          'font-mono text-lg font-semibold',
          destaque === 'positivo' && 'text-success',
          destaque === 'negativo' && 'text-warning',
        )}
      >
        {valor}
      </span>
      {nota ? <span className="text-[11px] text-muted-foreground">{nota}</span> : null}
    </div>
  )
}

export function InsightCard({ insight }: { insight: Insight }) {
  const map = {
    critico: {
      borda: 'border-destructive/40',
      dot: 'bg-destructive',
      badge: 'danger' as const,
      texto: 'Crítico',
    },
    atencao: {
      borda: 'border-warning/40',
      dot: 'bg-warning',
      badge: 'warning' as const,
      texto: 'Atenção',
    },
    positivo: {
      borda: 'border-success/40',
      dot: 'bg-success',
      badge: 'success' as const,
      texto: 'Positivo',
    },
  }[insight.tom]

  return (
    <Card className={cn('ls-rise flex flex-col', map.borda)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn('size-2 rounded-full', map.dot)} aria-hidden />
            <CardTitle>{insight.titulo}</CardTitle>
          </div>
          <Badge tone={map.badge}>{map.texto}</Badge>
        </div>
        <CardDescription>{insight.alvo}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-sm leading-relaxed text-foreground/90">{insight.observacao}</p>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sugestão do LogiSmart
          </span>
          <p className="mt-1 text-sm leading-relaxed text-pretty">{insight.sugestao}</p>
        </div>
        <Button
          render={<Link href={insight.acaoHref} />}
          variant="outline"
          size="sm"
          className="mt-auto w-fit"
        >
          {insight.acaoLabel}
          <ArrowRight className="size-3.5" data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  ariaLabel: string
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            value === o.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function AnaliseBox({ texto, titulo = 'Análise do LogiSmart' }: { texto: string; titulo?: string }) {
  return (
    <div className="rounded-xl border border-primary/25 bg-primary/8 p-4">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-primary" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">{titulo}</span>
      </div>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/90">{texto}</p>
    </div>
  )
}
