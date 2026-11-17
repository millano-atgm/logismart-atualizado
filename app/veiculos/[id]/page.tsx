'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowRight, ChevronRight, Route as RouteIcon, Wrench } from 'lucide-react'
import { AnaliseBox, KpiTile, SeveridadeBadge, Section, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONSUMO_MEDIO_FROTA } from '@/lib/data'
import { useDemo } from '@/lib/store'

export default function VeiculoDetalhePage() {
  const params = useParams<{ id: string }>()
  const { veiculoPorId, alertas, rotas, manutencoes } = useDemo()
  const veiculo = veiculoPorId(params.id)

  if (!veiculo) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border p-8">
        <p className="text-sm text-muted-foreground">Veículo não encontrado.</p>
        <Button render={<Link href="/veiculos" />} variant="outline" size="sm">
          Voltar para a lista
        </Button>
      </div>
    )
  }

  const alertasVeiculo = alertas.filter((a) => a.veiculoId === veiculo.id && !a.resolvido)
  const rotaAtual = rotas.find((r) => r.veiculoId === veiculo.id)
  const manutencaoVeiculo = manutencoes.filter((m) => m.veiculoId === veiculo.id)
  const desvio = veiculo.consumo
    ? Math.round(((veiculo.consumo - CONSUMO_MEDIO_FROTA) / CONSUMO_MEDIO_FROTA) * 100)
    : null

  return (
    <>
      <nav aria-label="Trilha de navegação" className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/veiculos" className="hover:text-foreground">
          Veículos
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-foreground">{veiculo.nome}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{veiculo.nome}</h2>
            <StatusBadge status={veiculo.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {veiculo.modelo} · Placa <span className="font-mono">{veiculo.placa}</span> · Motorista{' '}
            {veiculo.motorista}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <KpiTile label="Quilometragem" valor={`${veiculo.kmTotal.toLocaleString('pt-BR')} km`} />
        <KpiTile
          label="Consumo médio"
          valor={veiculo.consumo ? `${veiculo.consumo.toFixed(1).replace('.', ',')} km/L` : '—'}
          nota={desvio !== null ? `${desvio > 0 ? '+' : ''}${desvio}% vs. frota` : 'veículo parado'}
          destaque={desvio === null ? undefined : desvio < 0 ? 'negativo' : 'positivo'}
        />
        <KpiTile
          label="Velocidade média"
          valor={veiculo.velocidadeMedia ? `${veiculo.velocidadeMedia} km/h` : '—'}
        />
        <KpiTile
          label="Tempo em operação"
          valor={veiculo.horasOperacao ? `${veiculo.horasOperacao} h` : '—'}
          nota="na semana"
        />
        <KpiTile
          label="Marcha lenta"
          valor={veiculo.marchaLenta ? `${veiculo.marchaLenta}%` : '—'}
          nota="do tempo ligado"
          destaque={veiculo.marchaLenta > 15 ? 'negativo' : undefined}
        />
        <KpiTile
          label="Emissões estimadas"
          valor={veiculo.co2 ? `${veiculo.co2.toLocaleString('pt-BR')} kg` : '—'}
          nota="CO₂ na semana"
        />
      </div>

      <AnaliseBox texto={veiculo.analise} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manutenção</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Última manutenção</span>
              <span className="text-right">{veiculo.ultimaManutencao}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Próxima manutenção</span>
              <span className="font-mono text-right">
                {veiculo.proximaManutencaoKm.toLocaleString('pt-BR')} km
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Quilometragem restante</span>
              <span
                className={
                  veiculo.kmAteManutencao < 1500
                    ? 'font-mono text-warning'
                    : 'font-mono text-foreground'
                }
              >
                {veiculo.kmAteManutencao.toLocaleString('pt-BR')} km
              </span>
            </div>
            {manutencaoVeiculo.length > 0 ? (
              <ul className="flex flex-col gap-2 border-t border-border pt-3">
                {manutencaoVeiculo.map((m) => (
                  <li key={m.id} className="flex items-start gap-2 text-xs">
                    <Wrench className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                    <span className="text-muted-foreground">
                      {m.descricao} <span className="text-foreground">({m.prazo})</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <Button render={<Link href="/manutencao" />} variant="outline" size="sm" className="w-fit">
              Abrir manutenção
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rota atual</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Trecho</span>
              <span className="text-right">{veiculo.rota}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Previsão de chegada</span>
              <span className="font-mono text-right">{veiculo.eta ?? '—'}</span>
            </div>
            {rotaAtual ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progresso da rota</span>
                    <span className="font-mono">{rotaAtual.progresso}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${rotaAtual.progresso}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {rotaAtual.observacao}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Veículo sem rota ativa no momento da coleta.
              </p>
            )}
            <Button render={<Link href="/rotas" />} variant="outline" size="sm" className="w-fit">
              <RouteIcon className="size-3.5" data-icon="inline-start" />
              Ver rotas
            </Button>
          </CardContent>
        </Card>
      </div>

      <Section
        titulo="Alertas ativos"
        descricao={
          alertasVeiculo.length > 0
            ? 'Ocorrências abertas para este veículo.'
            : 'Nenhum alerta aberto para este veículo.'
        }
      >
        {alertasVeiculo.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {alertasVeiculo.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">{a.titulo}</span>
                  <SeveridadeBadge severidade={a.severidade} />
                </div>
                <p className="text-xs text-muted-foreground">{a.dataHora} · {a.problema}</p>
                <p className="text-sm leading-relaxed">
                  <span className="text-muted-foreground">Recomendação: </span>
                  {a.recomendacao}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            Operação normal — nenhuma ocorrência registrada no período.
          </div>
        )}
      </Section>
    </>
  )
}
