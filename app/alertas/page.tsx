'use client'

import Link from 'next/link'
import { ArrowRight, Check, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { KpiTile, PageIntro, SeveridadeBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Alerta, Severidade } from '@/lib/data'
import { useDemo } from '@/lib/store'
import { cn } from '@/lib/utils'

const grupos: {
  severidade: Severidade
  titulo: string
  descricao: string
  icone: React.ComponentType<{ className?: string }>
  cor: string
}[] = [
  {
    severidade: 'critico',
    titulo: 'Críticos',
    descricao: 'Exigem decisão imediata do gestor.',
    icone: TriangleAlert,
    cor: 'text-destructive',
  },
  {
    severidade: 'atencao',
    titulo: 'Atenção',
    descricao: 'Impactam custo ou prazo se não tratados.',
    icone: Info,
    cor: 'text-warning',
  },
  {
    severidade: 'info',
    titulo: 'Informativos',
    descricao: 'Resultados positivos e avisos de acompanhamento.',
    icone: CircleCheck,
    cor: 'text-success',
  },
]

function AlertaCard({ alerta, onResolver }: { alerta: Alerta; onResolver: () => void }) {
  const borda =
    alerta.severidade === 'critico'
      ? 'border-destructive/40'
      : alerta.severidade === 'atencao'
        ? 'border-warning/40'
        : 'border-success/35'

  return (
    <Card className={cn(borda, alerta.resolvido && 'opacity-60')}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{alerta.titulo}</span>
            <span className="text-xs text-muted-foreground">
              {alerta.veiculoNome} · {alerta.dataHora}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {alerta.resolvido ? <span className="text-xs text-success">Tratado</span> : null}
            <SeveridadeBadge severidade={alerta.severidade} />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Problema identificado
            </dt>
            <dd className="text-sm leading-relaxed">{alerta.problema}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Possível impacto
            </dt>
            <dd className="text-sm leading-relaxed">{alerta.impacto}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              Recomendação do sistema
            </dt>
            <dd className="text-sm leading-relaxed">{alerta.recomendacao}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2">
          {alerta.veiculoId ? (
            <Button
              render={<Link href={`/veiculos/${alerta.veiculoId}`} />}
              variant="outline"
              size="sm"
            >
              Ver detalhes do veículo
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </Button>
          ) : (
            <Button render={<Link href="/sustentabilidade" />} variant="outline" size="sm">
              Ver indicadores
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onResolver}>
            <Check className="size-3.5" data-icon="inline-start" />
            {alerta.resolvido ? 'Reabrir alerta' : 'Marcar como tratado'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AlertasPage() {
  const { alertas, resolverAlerta, resumo } = useDemo()

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          titulo="Central de alertas"
          descricao="Ocorrências identificadas pelo LogiSmart a partir dos dados de telemetria, organizadas por prioridade."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Alertas abertos" valor={String(resumo.alertasPendentes)} />
        <KpiTile label="Críticos" valor={String(resumo.criticos)} destaque="negativo" />
        <KpiTile label="Segurança" valor={String(resumo.alertasSegurancaPendentes)} destaque="negativo" />
        <KpiTile
          label="Tratados nesta sessão"
          valor={String(alertas.filter((a) => a.resolvido).length)}
          destaque="positivo"
        />
      </div>

      {grupos.map((grupo) => {
        const lista = alertas.filter((a) => a.severidade === grupo.severidade)
        const Icone = grupo.icone
        return (
          <section key={grupo.severidade} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Icone className={cn('size-4', grupo.cor)} aria-hidden />
              <h3 className="text-base font-semibold tracking-tight">{grupo.titulo}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {lista.length}
              </span>
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">{grupo.descricao}</p>
            <div className="flex flex-col gap-3">
              {lista.map((a) => (
                <AlertaCard key={a.id} alerta={a} onResolver={() => resolverAlerta(a.id)} />
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
