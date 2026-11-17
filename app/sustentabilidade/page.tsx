'use client'

import { Factory, Leaf, Sprout } from 'lucide-react'
import { BarChart } from '@/components/charts'
import { AnaliseBox, KpiTile, PageIntro, Section } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { co2Semana, sustentabilidade } from '@/lib/data'

export default function SustentabilidadePage() {
  const s = sustentabilidade

  const reducoes = [
    { label: 'Combustível', valor: s.reducaoCombustivel },
    { label: 'CO₂', valor: s.reducaoCo2 },
    { label: 'Marcha lenta', valor: s.reducaoMarchaLenta },
  ]

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          titulo="Sustentabilidade e ODS"
          descricao="Indicadores que conectam a operação logística às metas de eficiência e consumo responsável. A análise dos dados operacionais permite identificar desperdícios e oportunidades de redução do consumo de recursos."
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg border border-primary/25 bg-primary/12 text-primary">
                <Factory className="size-4" aria-hidden />
              </span>
              <div className="flex flex-col">
                <CardTitle>ODS 9</CardTitle>
                <span className="text-xs text-muted-foreground">
                  Indústria, Inovação e Infraestrutura
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed text-foreground/90">
              O LogiSmart aplica tecnologia e análise de dados sobre informações de TMS e telemetria
              para melhorar a eficiência da infraestrutura logística: menos quebras em operação,
              melhor aproveitamento das rotas e decisões baseadas em evidência, não em suposição.
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                'Manutenção preditiva a partir de desvios de temperatura e desgaste',
                'Roteirização apoiada por dados de trânsito e tempo estimado',
                'Padronização de indicadores para toda a frota',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-success/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg border border-success/25 bg-success/12 text-success">
                <Leaf className="size-4" aria-hidden />
              </span>
              <div className="flex flex-col">
                <CardTitle>ODS 12</CardTitle>
                <span className="text-xs text-muted-foreground">
                  Consumo e Produção Responsáveis
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <KpiTile label="Combustível" valor={`-${s.reducaoCombustivel}%`} destaque="positivo" />
              <KpiTile label="CO₂" valor={`-${s.reducaoCo2}%`} destaque="positivo" />
              <KpiTile label="Marcha lenta" valor={`-${s.reducaoMarchaLenta}%`} destaque="positivo" />
            </div>
            <BarChart data={reducoes} tone="success" sufixo="%" height={120} />
          </CardContent>
        </Card>
      </div>

      <Section titulo="Resultado ambiental do período" descricao="Estimativas calculadas para o período semanal.">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiTile
            label="Litros economizados"
            valor={`${s.litrosEconomizados.toLocaleString('pt-BR')} L`}
            nota="vs. semana anterior"
            destaque="positivo"
          />
          <KpiTile
            label="CO₂ evitado"
            valor={`${s.co2Evitado.toLocaleString('pt-BR')} kg`}
            destaque="positivo"
          />
          <KpiTile
            label="Equivalente em árvores"
            valor={`${s.arvoresEquivalentes} árvores/ano`}
            nota="referência didática"
          />
          <KpiTile label="Meta semanal de CO₂" valor="12%" nota="resultado: 15%" destaque="positivo" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Emissões diárias de CO₂</CardTitle>
            <span className="text-xs text-muted-foreground">
              Queda consistente ao longo da semana (kg por dia)
            </span>
          </CardHeader>
          <CardContent>
            <BarChart data={co2Semana} tone="success" />
          </CardContent>
        </Card>
      </Section>

      <Section
        titulo="Motoristas com melhor desempenho"
        descricao="Reconhecimento sugerido pelo sistema — base do programa de eco-condução."
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {s.melhoresMotoristas.map((m, i) => (
            <Card key={m.nome} className="border-success/25">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{m.nome}</span>
                  <Badge tone="success">
                    <Sprout className="size-3" aria-hidden />
                    {i + 1}º lugar
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{m.veiculo}</span>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consumo</span>
                  <span className="font-mono text-success">
                    {m.consumo.toFixed(1).replace('.', ',')} km/L
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Marcha lenta</span>
                  <span className="font-mono">{m.marchaLenta}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <AnaliseBox
        titulo="Leitura de sustentabilidade"
        texto="A frota apresentou melhora ambiental real no período: 8% menos combustível, 15% menos CO₂ e 11% menos tempo em marcha lenta. O maior potencial restante está nos três veículos com consumo abaixo da média — corrigi-los pode adicionar cerca de 4 pontos percentuais à redução de emissões sem trocar nenhum veículo da frota."
      />
    </>
  )
}
