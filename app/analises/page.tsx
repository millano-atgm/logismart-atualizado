'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { AreaChart, BarChart, Gauge, RankBar } from '@/components/charts'
import {
  AnaliseBox,
  KpiTile,
  PageIntro,
  Section,
  SegmentedControl,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONSUMO_MEDIO_FROTA, periodos, type PeriodoId } from '@/lib/data'
import { useDemo } from '@/lib/store'

const moeda = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export default function AnalisesPage() {
  const { veiculos, atualizarIndicadores, ultimaAtualizacao } = useDemo()
  const [periodoId, setPeriodoId] = useState<PeriodoId>('7d')
  const p = periodos[periodoId]

  const eficiencia = veiculos
    .filter((v) => v.consumo !== null)
    .sort((a, b) => (b.consumo ?? 0) - (a.consumo ?? 0))
    .map((v) => ({
      label: v.nome,
      valor: v.consumo as number,
      tone: ((v.consumo as number) < CONSUMO_MEDIO_FROTA * 0.9 ? 'warning' : 'primary') as
        | 'warning'
        | 'primary',
    }))

  const custoPorVeiculo = veiculos
    .filter((v) => v.custoKm > 0)
    .sort((a, b) => b.custoKm - a.custoKm)
    .slice(0, 6)
    .map((v) => ({ label: v.nome, valor: v.custoKm, tone: 'info' as const }))

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          titulo="Análises da operação"
          descricao="Compare consumo, custos, quilometragem, utilização e emissões em diferentes períodos para identificar a origem dos desvios."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <SegmentedControl
          ariaLabel="Selecionar período de análise"
          value={periodoId}
          onChange={setPeriodoId}
          options={[
            { value: 'hoje', label: 'Hoje' },
            { value: '7d', label: 'Últimos 7 dias' },
            { value: '30d', label: 'Últimos 30 dias' },
          ]}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Atualizado às {ultimaAtualizacao}</span>
          <Button variant="outline" size="sm" onClick={atualizarIndicadores}>
            <RefreshCw className="size-3.5" data-icon="inline-start" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <KpiTile
          label="Consumo médio"
          valor={`${p.consumoMedio.toFixed(1).replace('.', ',')} km/L`}
          nota={`+${p.variacaoConsumo.toString().replace('.', ',')}% de melhora`}
          destaque="positivo"
        />
        <KpiTile label="Custo por km" valor={`R$ ${p.custoKm.toFixed(2).replace('.', ',')}`} />
        <KpiTile label="Custo total" valor={moeda(p.custoTotal)} nota={`${p.litros.toLocaleString('pt-BR')} litros`} />
        <KpiTile label="Quilometragem" valor={`${p.km.toLocaleString('pt-BR')} km`} />
        <KpiTile label="Utilização" valor={`${p.utilizacao}%`} />
        <KpiTile label="Redução de CO₂" valor={`${p.reducaoCo2}%`} destaque="positivo" />
      </div>

      <Section titulo={`Evolução — ${p.label}`} descricao="Evolução dos indicadores no período selecionado.">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Consumo de combustível</CardTitle>
              <span className="text-xs text-muted-foreground">km/L</span>
            </CardHeader>
            <CardContent>
              <AreaChart data={p.serieConsumo} tone="primary" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilização da frota</CardTitle>
              <span className="text-xs text-muted-foreground">% dos veículos em operação</span>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <Gauge valor={p.utilizacao} label={`Média do período — ${p.label}`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emissões de CO₂</CardTitle>
              <span className="text-xs text-muted-foreground">kg estimados</span>
            </CardHeader>
            <CardContent>
              <BarChart data={p.serieCo2} tone="success" />
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Utilização por intervalo</CardTitle>
              <span className="text-xs text-muted-foreground">%</span>
            </CardHeader>
            <CardContent>
              <BarChart data={p.serieUtilizacao} tone="info" sufixo="%" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section titulo="Eficiência por veículo" descricao="Referência da frota: 8,4 km/L. Barras em amarelo indicam desempenho abaixo da média.">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Consumo (km/L)</CardTitle>
            </CardHeader>
            <CardContent>
              <RankBar items={eficiencia} sufixo=" km/L" referencia={CONSUMO_MEDIO_FROTA * 0.9} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Maiores custos por km</CardTitle>
              <span className="text-xs text-muted-foreground">R$ por quilômetro rodado</span>
            </CardHeader>
            <CardContent>
              <RankBar items={custoPorVeiculo} sufixo=" R$/km" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <AnaliseBox titulo="Insight do período" texto={p.insight} />
    </>
  )
}
