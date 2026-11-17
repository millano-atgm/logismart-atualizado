'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { ArrowRight, MapPin, Route as RouteIcon } from 'lucide-react'
import {
  AnaliseBox,
  KpiTile,
  PageIntro,
  Section,
  SegmentedControl,
  TransitoBadge,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Rota } from '@/lib/data'
import { useDemo } from '@/lib/store'
import { cn } from '@/lib/utils'

function tempo(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}min` : `${m} min`
}

function corTransito(t: Rota['transito']) {
  return t === 'livre' ? 'bg-success' : t === 'moderado' ? 'bg-warning' : 'bg-destructive'
}

const FleetMap = dynamic(() => import('@/components/fleet-map').then((mod) => mod.FleetMap), { ssr: false })

function RotaCard({ rota }: { rota: Rota }) {
  return (
    <Card className={rota.atrasoMin > 30 ? 'border-warning/40' : undefined}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{rota.nome}</span>
            <span className="text-xs text-muted-foreground">
              {rota.veiculoNome} · {rota.motorista}
            </span>
          </div>
          <TransitoBadge transito={rota.transito} />
        </div>

        {/* Resumo operacional da rota exibido junto ao mapa geográfico */}
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <span className="grid size-5 shrink-0 place-items-center rounded-full border border-border bg-secondary">
              <MapPin className="size-3 text-muted-foreground" aria-hidden />
            </span>
            <div className="relative mx-1 h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn('h-full rounded-full transition-all duration-500', corTransito(rota.transito))}
                style={{ width: `${rota.progresso}%` }}
              />
            </div>
            <span
              className="absolute -translate-x-1/2"
              style={{ left: `calc(${rota.progresso}% * 0.9 + 5%)` }}
            >
              <span className="grid size-5 place-items-center rounded-full border border-primary bg-background">
                <RouteIcon className="size-3 text-primary" aria-hidden />
              </span>
            </span>
            <span className="grid size-5 shrink-0 place-items-center rounded-full border border-border bg-secondary">
              <MapPin className="size-3 text-muted-foreground" aria-hidden />
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Origem</span>
            <span className="font-mono">{rota.progresso}% percorrido</span>
            <span>Destino</span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
          <div className="flex flex-col">
            <dt className="text-muted-foreground">Tempo estimado</dt>
            <dd className="font-mono text-sm">{tempo(rota.etaMin)}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-muted-foreground">Atraso</dt>
            <dd
              className={cn(
                'font-mono text-sm',
                rota.atrasoMin > 30 ? 'text-warning' : rota.atrasoMin > 0 ? 'text-foreground' : 'text-success',
              )}
            >
              {rota.atrasoMin > 0 ? `+${rota.atrasoMin} min` : 'Em dia'}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-muted-foreground">Situação</dt>
            <dd className="text-sm">{rota.observacao.split('.')[0]}</dd>
          </div>
        </dl>

        {rota.alternativa ? (
          <div className="rounded-lg border border-primary/25 bg-primary/8 p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              Rota alternativa sugerida
            </span>
            <p className="mt-1 text-sm leading-relaxed">
              {rota.alternativa} pode reduzir aproximadamente {rota.economiaMin} minutos e diminuir o
              consumo em marcha lenta.
            </p>
          </div>
        ) : null}

        <Button
          render={<Link href={`/veiculos/${rota.veiculoId}`} />}
          variant="outline"
          size="sm"
          className="w-fit"
        >
          Ver veículo
          <ArrowRight className="size-3.5" data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default function RotasPage() {
  const { rotas, veiculos, ultimaAtualizacao } = useDemo()
  const [filtro, setFiltro] = useState<'todas' | 'atrasadas' | 'alternativas'>('todas')
  const [selecionada, setSelecionada] = useState<string | null>(null)

  const lista = rotas.filter((r) =>
    filtro === 'todas'
      ? true
      : filtro === 'atrasadas'
        ? r.atrasoMin > 0
        : Boolean(r.alternativa),
  )

  const atrasadas = rotas.filter((r) => r.atrasoMin > 0)
  const economiaTotal = rotas.reduce((acc, r) => acc + (r.economiaMin ?? 0), 0)

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          titulo="Rotas em andamento"
          descricao="Mapa geográfico das rotas ativas, situação do trânsito e alternativas sugeridas pelo sistema."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Veículos em rota" valor={String(rotas.length)} />
        <KpiTile label="Com atraso" valor={String(atrasadas.length)} destaque="negativo" />
        <KpiTile
          label="Rotas alternativas"
          valor={String(rotas.filter((r) => r.alternativa).length)}
        />
        <KpiTile
          label="Economia potencial"
          valor={`${economiaTotal} min`}
          nota="se as alternativas forem aceitas"
          destaque="positivo"
        />
      </div>

      <Section titulo="Posições da frota">
        <FleetMap rotas={rotas} veiculos={veiculos} selecionada={selecionada} onSelecionar={setSelecionada} ultimaAtualizacao={ultimaAtualizacao} />
      </Section>

      <Section
        titulo="Trechos monitorados"
        acao={
          <SegmentedControl
            ariaLabel="Filtrar rotas"
            value={filtro}
            onChange={setFiltro}
            options={[
              { value: 'todas', label: 'Todas' },
              { value: 'atrasadas', label: 'Atrasadas' },
              { value: 'alternativas', label: 'Com alternativa' },
            ]}
          />
        }
      >
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {lista.map((r) => (
            <RotaCard key={r.id} rota={r} />
          ))}
        </div>
      </Section>

      <AnaliseBox
        titulo="BR-116 — Trânsito intenso"
        texto="Dois veículos estão no mesmo corredor congestionado. A Rota Alternativa B pode reduzir aproximadamente 40 minutos no Veículo 08 e evitar 25 minutos de espera no Caminhão 02 — que também possui alerta de temperatura e deve ser desviado para a oficina mais próxima."
      />

    </>
  )
}
