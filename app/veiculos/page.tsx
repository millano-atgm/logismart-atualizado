'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { KpiTile, PageIntro, Section } from '@/components/shared'
import { Input, Select } from '@/components/ui/field'
import { VehicleTable } from '@/components/vehicle-table'
import { CONSUMO_MEDIO_FROTA, statusLabel, type VehicleStatus } from '@/lib/data'
import { useDemo } from '@/lib/store'

type FiltroEficiencia = 'todas' | 'acima' | 'media' | 'abaixo'

export default function VeiculosPage() {
  const { veiculos, resumo } = useDemo()
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<'todos' | VehicleStatus>('todos')
  const [eficiencia, setEficiencia] = useState<FiltroEficiencia>('todas')

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return veiculos.filter((v) => {
      const casaBusca =
        termo.length === 0 ||
        [v.nome, v.placa, v.motorista, v.rota, v.modelo].some((campo) =>
          campo.toLowerCase().includes(termo),
        )
      const casaStatus = status === 'todos' || v.status === status
      const c = v.consumo
      const casaEficiencia =
        eficiencia === 'todas' ||
        (eficiencia === 'acima' && c !== null && c >= CONSUMO_MEDIO_FROTA) ||
        (eficiencia === 'media' &&
          c !== null &&
          c < CONSUMO_MEDIO_FROTA &&
          c >= CONSUMO_MEDIO_FROTA * 0.9) ||
        (eficiencia === 'abaixo' && c !== null && c < CONSUMO_MEDIO_FROTA * 0.9)
      return casaBusca && casaStatus && casaEficiencia
    })
  }, [veiculos, busca, status, eficiencia])

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          titulo="Veículos da frota"
          descricao="Pesquise, filtre e abra o detalhamento de cada veículo com a análise gerada pelo sistema."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Total de veículos" valor={String(resumo.total)} />
        <KpiTile label="Em rota" valor={String(resumo.emRota)} destaque="positivo" />
        <KpiTile
          label="Precisam de atenção"
          valor={String(resumo.atencao + resumo.atrasados)}
          destaque="negativo"
        />
        <KpiTile label="Em manutenção" valor={String(resumo.emManutencao)} />
      </div>

      <Section titulo="Filtros" descricao="Combine pesquisa, status e faixa de eficiência.">
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              className="pl-9"
              placeholder="Pesquisar veículo, placa ou motorista"
              aria-label="Pesquisar veículo"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select
            aria-label="Filtrar por status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'todos' | VehicleStatus)}
          >
            <option value="todos">Todos os status</option>
            {(Object.keys(statusLabel) as VehicleStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filtrar por eficiência"
            value={eficiencia}
            onChange={(e) => setEficiencia(e.target.value as FiltroEficiencia)}
          >
            <option value="todas">Toda a eficiência</option>
            <option value="acima">Acima da média (≥ 8,4 km/L)</option>
            <option value="media">Na faixa média (7,6 – 8,4 km/L)</option>
            <option value="abaixo">Abaixo da média (&lt; 7,6 km/L)</option>
          </Select>
        </div>
      </Section>

      <Section
        titulo={`${lista.length} ${lista.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}`}
        descricao="Consumo destacado em vermelho indica desempenho abaixo da média da frota."
      >
        <VehicleTable veiculos={lista} />
      </Section>
    </>
  )
}
