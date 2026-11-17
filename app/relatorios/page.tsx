'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { AreaChart, BarChart } from '@/components/charts'
import { AnaliseBox, KpiTile, PageIntro, Section } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared'
import { co2Semana, consumoSemana, CONSUMO_MEDIO_FROTA, periodos } from '@/lib/data'
import { useDemo } from '@/lib/store'

export default function RelatoriosPage() {
  const { veiculos, alertas, resumo, ultimaAtualizacao } = useDemo()
  const [statusDownload, setStatusDownload] = useState<'idle' | 'preparando' | 'pronto'>('idle')
  const p = periodos['7d']
  const consumoMedio = resumo.consumoMedio.toFixed(1).replace('.', ',')
  const kmTotal = resumo.kmTotal.toLocaleString('pt-BR') + ' km'
  const custoKm = `R$ ${resumo.custoKm.toFixed(2).replace('.', ',')}`
  const gerarRelatorio = () => {
    setStatusDownload('preparando')
    window.setTimeout(() => setStatusDownload('pronto'), 900)
  }

  const melhores = [...veiculos]
    .filter((v) => v.consumo !== null)
    .sort((a, b) => (b.consumo ?? 0) - (a.consumo ?? 0))
    .slice(0, 3)

  const piores = [...veiculos]
    .filter((v) => v.consumo !== null)
    .sort((a, b) => (a.consumo ?? 0) - (b.consumo ?? 0))
    .slice(0, 3)

  const linhas = [
    { indicador: 'Consumo médio da frota', valor: `${consumoMedio} km/L`, meta: '8,2 km/L', situacao: 'Acima da meta' },
    { indicador: 'Custo médio por km', valor: custoKm, meta: 'R$ 2,25', situacao: 'Dentro da meta' },
    { indicador: 'Utilização da frota', valor: `${resumo.utilizacao}%`, meta: '85%', situacao: 'Acima da meta' },
    { indicador: 'Quilometragem total', valor: kmTotal, meta: '40.000 km', situacao: 'Acima do previsto' },
    { indicador: 'Redução de CO₂', valor: '15%', meta: '12%', situacao: 'Acima da meta' },
    { indicador: 'Alertas críticos abertos', valor: String(resumo.criticos), meta: '0', situacao: 'Requer ação' },
  ]

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          titulo="Relatório semanal da operação"
          descricao="Resumo consolidado dos principais indicadores da frota nos últimos 7 dias, pronto para apresentação ao gestor."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <KpiTile label="Km rodados" valor={kmTotal} />
        <KpiTile label="Litros consumidos" valor={`${p.litros.toLocaleString('pt-BR')} L`} />
        <KpiTile label="Custo total" valor={`R$ ${(resumo.kmTotal * resumo.custoKm).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} nota={`${custoKm} por km`} />
        <KpiTile label="Entregas no prazo" valor="94%" destaque="positivo" />
        <KpiTile label="Alertas gerados" valor={String(alertas.length)} />
        <KpiTile label="Veículos ativos" valor={`${resumo.emRota + resumo.atencao + resumo.atrasados}/${resumo.total}`} />
      </div>

      <Section titulo="Indicadores versus metas" descricao="Comparação com as metas definidas pela operação.">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">Indicador</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Resultado</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Meta</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Situação</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.indicador} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3">{l.indicador}</td>
                  <td className="px-4 py-3 font-mono">{l.valor}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{l.meta}</td>
                  <td
                    className={
                      l.situacao === 'Requer ação'
                        ? 'px-4 py-3 text-destructive'
                        : 'px-4 py-3 text-success'
                    }
                  >
                    {l.situacao}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consumo da semana</CardTitle>
            <span className="text-xs text-muted-foreground">km/L por dia</span>
          </CardHeader>
          <CardContent>
            <AreaChart data={consumoSemana} tone="primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Emissões da semana</CardTitle>
            <span className="text-xs text-muted-foreground">kg de CO₂ por dia</span>
          </CardHeader>
          <CardContent>
            <BarChart data={co2Semana} tone="success" />
          </CardContent>
        </Card>
      </div>

      <Section titulo="Destaques da frota" descricao={`Média de referência: ${CONSUMO_MEDIO_FROTA.toFixed(1).replace('.', ',')} km/L.`}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Melhores desempenhos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {melhores.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <Link href={`/veiculos/${v.id}`} className="truncate text-sm hover:underline">
                        {v.nome}
                      </Link>
                      <span className="text-xs text-muted-foreground">{v.motorista}</span>
                    </div>
                    <span className="font-mono text-sm text-success">
                      {(v.consumo as number).toFixed(1).replace('.', ',')} km/L
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precisam de atenção</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {piores.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <Link href={`/veiculos/${v.id}`} className="truncate text-sm hover:underline">
                        {v.nome}
                      </Link>
                      <span className="text-xs text-muted-foreground">{v.motorista}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={v.status} />
                      <span className="font-mono text-sm text-destructive">
                        {(v.consumo as number).toFixed(1).replace('.', ',')} km/L
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <AnaliseBox
        titulo="Conclusão do relatório"
        texto="A semana fechou acima da meta em consumo, utilização e redução de emissões, com custo por km 3,6% abaixo do teto planejado. O ponto negativo é a concentração de perdas em três veículos: tratar o Caminhão 02, 03 e 12 elevaria a média da frota para aproximadamente 8,8 km/L sem qualquer investimento adicional."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="default" size="sm" onClick={gerarRelatorio} disabled={statusDownload === 'preparando'}>
          {statusDownload === 'preparando' ? 'Preparando relatório…' : statusDownload === 'pronto' ? 'Relatório preparado' : 'Baixar relatório'}
        </Button>
        <span className="text-xs text-muted-foreground">Atualizado às {ultimaAtualizacao}</span>
        <Button render={<Link href="/analises" />} variant="outline" size="sm">
          <FileText className="size-3.5" data-icon="inline-start" />
          Ver análises detalhadas
        </Button>
        <Button render={<Link href="/sustentabilidade" />} variant="ghost" size="sm">
          Indicadores de sustentabilidade
          <ArrowRight className="size-3.5" data-icon="inline-end" />
        </Button>
      </div>
    </>
  )
}
