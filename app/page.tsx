'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Truck, TriangleAlert, Wifi } from 'lucide-react'
import { AreaChart, BarChart, Gauge, RankBar } from '@/components/charts'
import {
  AnaliseBox,
  InsightCard,
  KpiTile,
  MetricCard,
  PageIntro,
  Section,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VehicleTable } from '@/components/vehicle-table'
import { CONSUMO_MEDIO_FROTA, co2Semana, consumoSemana, utilizacaoSemana } from '@/lib/data'
import { useDemo } from '@/lib/store'

export default function VisaoGeralPage() {
  const { veiculos, insights, resumo, ultimaAtualizacao } = useDemo()

  const destaque = veiculos.filter((v) =>
    ['cam-02', 'vei-08', 'cam-11', 'cam-05', 'vei-14'].includes(v.id),
  )

  const eficiencia = veiculos
    .filter((v) => v.consumo !== null)
    .sort((a, b) => (b.consumo ?? 0) - (a.consumo ?? 0))
    .slice(0, 8)
    .map((v) => ({
      label: v.nome,
      valor: v.consumo as number,
      tone: ((v.consumo as number) < CONSUMO_MEDIO_FROTA * 0.9 ? 'warning' : 'primary') as
        | 'warning'
        | 'primary',
    }))

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          titulo="Como está a frota agora"
          descricao="O LogiSmart lê os dados operacionais de TMS e telemetria, interpreta os desvios e sugere a próxima ação para o gestor."
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          titulo="Frota Total"
          valor={`${resumo.total} ativos`}
          detalhe={`${resumo.emManutencao} em manutenção · ${resumo.emRota} em rota`}
          icone={Truck}
          tone="primary"
        />
        <MetricCard
          titulo="Economia de Combustível"
          valor="8%"
          detalhe="de redução esta semana"
          icone={Leaf}
          tone="success"
        />
        <MetricCard
          titulo="Alertas de Segurança"
          valor={`${resumo.alertasSegurancaPendentes} pendentes`}
          detalhe={`${resumo.alertasPendentes} alertas abertos no total`}
          icone={TriangleAlert}
          tone="danger"
        />
        <MetricCard
          titulo="Status do Sistema"
          valor="Online"
          detalhe={`Integrado · atualizado ${ultimaAtualizacao}`}
          icone={Wifi}
          tone="success"
          pulse
        />
      </div>

      <Section
        titulo="Indicadores da Frota"
        descricao="Últimos 7 dias — dados consolidados de telemetria."
        acao={
          <Button render={<Link href="/analises" />} variant="ghost" size="sm">
            Abrir análises
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <KpiTile label="Consumo médio" valor="8,4 km/L" nota="+8% vs. semana anterior" destaque="positivo" />
          <KpiTile label="Custo médio por km" valor="R$ 2,17" nota="meta: R$ 2,25" destaque="positivo" />
          <KpiTile label="Utilização da frota" valor="87%" nota="13 de 15 veículos ativos" />
          <KpiTile label="Redução de CO₂" valor="15%" nota="vs. semana anterior" destaque="positivo" />
          <KpiTile label="Quilometragem total" valor="42.850 km" nota="somatório da semana" />
          <KpiTile
            label="Abaixo da média"
            valor={`${resumo.abaixoDaMedia.length} veículos`}
            nota={resumo.abaixoDaMedia.map((v) => v.nome).join(', ')}
            destaque="negativo"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Consumo de combustível — últimos 7 dias</CardTitle>
              <span className="text-xs text-muted-foreground">Média diária em km/L</span>
            </CardHeader>
            <CardContent>
              <AreaChart data={consumoSemana} tone="primary" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilização da frota</CardTitle>
              <span className="text-xs text-muted-foreground">Média da semana</span>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Gauge valor={87} label="13 de 15 veículos em operação" tone="primary" />
              <div className="w-full">
                <BarChart data={utilizacaoSemana} tone="info" sufixo="%" height={92} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emissões de CO₂</CardTitle>
              <span className="text-xs text-muted-foreground">Quilos por dia (estimado)</span>
            </CardHeader>
            <CardContent>
              <BarChart data={co2Semana} tone="success" />
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Comparação de eficiência entre veículos</CardTitle>
              <span className="text-xs text-muted-foreground">
                km/L — referência da frota: 8,4 km/L
              </span>
            </CardHeader>
            <CardContent>
              <RankBar items={eficiencia} sufixo=" km/L" referencia={CONSUMO_MEDIO_FROTA * 0.9} />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        titulo="Insights e Sugestões Inteligentes"
        descricao="O sistema interpreta os dados e recomenda a ação — a decisão final é do gestor."
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {insights.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      </Section>

      <Section
        titulo="Status dos Veículos"
        descricao="Clique em um veículo para abrir os detalhes e a análise completa."
        acao={
          <Button render={<Link href="/veiculos" />} variant="ghost" size="sm">
            Ver todos os {resumo.total}
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Button>
        }
      >
        <VehicleTable veiculos={destaque} />
      </Section>

      <AnaliseBox
        titulo="Leitura do período"
        texto="A frota opera com 87% de utilização e consumo médio de 8,4 km/L. Três veículos estão consumindo acima do esperado (Caminhão 02, 03 e 12) e concentram a maior parte do custo extra de combustível. O ponto mais urgente é a temperatura do Caminhão 02 — tratá-lo hoje evita uma parada não programada na BR-116."
      />

    </>
  )
}
