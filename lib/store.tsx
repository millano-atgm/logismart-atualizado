'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  CONSUMO_MEDIO_FROTA,
  estadoInicial,
  type DemoState,
  type Vehicle,
} from '@/lib/data'

interface DemoContextValue extends DemoState {
  resolverAlerta: (id: string) => void
  restaurarDemo: () => void
  novaSimulacao: () => void
  ultimaAtualizacao: string
  atualizarIndicadores: () => void
  veiculoPorId: (id: string) => Vehicle | undefined
  resumo: {
    total: number
    emManutencao: number
    emRota: number
    atrasados: number
    atencao: number
    alertasSegurancaPendentes: number
    alertasPendentes: number
    criticos: number
    abaixoDaMedia: Vehicle[]
    kmTotal: number
    consumoMedio: number
    custoKm: number
    utilizacao: number
  }
}

const DemoContext = createContext<DemoContextValue | null>(null)

function horaAgora() {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(() => estadoInicial())
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('09:42')

  const novaSimulacao = useCallback(() => {
    setState((base) => {
      const variacao = (valor: number, amplitude: number) =>
        Math.max(0, Number((valor + (Math.random() - 0.5) * amplitude).toFixed(1)))
      const rotas = base.rotas.map((r) => {
        const veiculo = base.veiculos.find((v) => v.id === r.veiculoId)
        const incremento = veiculo?.status === 'atrasado' ? 1 : veiculo?.status === 'atencao' ? 2 : 3
        const progresso = Math.min(100, r.progresso + incremento)
        return {
          ...r,
          progresso,
          etaMin: progresso >= 100 ? 0 : Math.max(20, r.etaMin - incremento * 2 + Math.round((Math.random() - 0.5) * 4)),
          posicao: { x: Math.min(92, Math.max(8, (r.posicao?.x ?? 30) + incremento * 0.35)), y: r.posicao?.y ?? 50 },
        }
      })
      const veiculos = base.veiculos.map((v) => {
        const rota = rotas.find((r) => r.veiculoId === v.id)
        const concluido = rota?.progresso === 100
        return {
          ...v,
          consumo: v.consumo === null ? null : variacao(v.consumo, 0.12),
          velocidadeMedia: v.status === 'manutencao' || concluido ? 0 : Math.round(variacao(v.velocidadeMedia, 4)),
          kmTotal: v.kmTotal + (v.status === 'manutencao' || concluido ? 0 : Math.round((v.velocidadeMedia || 1) * 0.5)),
          marchaLenta: v.status === 'manutencao' ? 0 : Math.round(variacao(v.marchaLenta, 1)),
          co2: v.status === 'manutencao' ? 0 : Math.round(variacao(v.co2, 18)),
          eta: concluido ? 'Chegou ao destino' : v.eta,
        }
      })
      return { ...base, veiculos, rotas }
    })
    setUltimaAtualizacao(horaAgora())
  }, [])

  useEffect(() => {
    const timer = window.setInterval(novaSimulacao, 30000)
    return () => window.clearInterval(timer)
  }, [novaSimulacao])

  const resolverAlerta = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      alertas: s.alertas.map((a) => (a.id === id ? { ...a, resolvido: !a.resolvido } : a)),
    }))
    setUltimaAtualizacao(horaAgora())
  }, [])

  const restaurarDemo = useCallback(() => {
    setState(estadoInicial())
    setUltimaAtualizacao('09:42')
  }, [])

  const atualizarIndicadores = useCallback(() => {
    setUltimaAtualizacao(horaAgora())
  }, [])

  const value = useMemo<DemoContextValue>(() => {
    const ativos = state.veiculos.filter((v) => v.consumo !== null)
    const consumoMedio =
      ativos.reduce((acc, v) => acc + (v.consumo ?? 0), 0) / (ativos.length || 1)
    const custoKm = ativos.reduce((acc, v) => acc + v.custoKm, 0) / (ativos.length || 1)
    const pendentes = state.alertas.filter((a) => !a.resolvido)

    return {
      ...state,
      resolverAlerta,
      restaurarDemo,
      novaSimulacao,
      atualizarIndicadores,
      ultimaAtualizacao,
      veiculoPorId: (id: string) => state.veiculos.find((v) => v.id === id),
      resumo: {
        total: state.veiculos.length,
        emManutencao: state.veiculos.filter((v) => v.status === 'manutencao').length,
        emRota: state.veiculos.filter((v) => v.status === 'em_rota').length,
        atrasados: state.veiculos.filter((v) => v.status === 'atrasado').length,
        atencao: state.veiculos.filter((v) => v.status === 'atencao').length,
        alertasSegurancaPendentes: pendentes.filter((a) => a.categoria === 'seguranca').length,
        alertasPendentes: pendentes.length,
        criticos: pendentes.filter((a) => a.severidade === 'critico').length,
        abaixoDaMedia: ativos.filter((v) => (v.consumo ?? 0) < CONSUMO_MEDIO_FROTA * 0.9),
        kmTotal: Math.round(state.veiculos.reduce((acc, v) => acc + v.kmTotal, 0) / 1000),
        consumoMedio,
        custoKm,
        utilizacao: Math.round((state.veiculos.filter((v) => v.status !== 'manutencao').length / (state.veiculos.length || 1)) * 100),
      },
    }
  }, [state, resolverAlerta, restaurarDemo, atualizarIndicadores, ultimaAtualizacao])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo deve ser usado dentro de DemoProvider')
  return ctx
}
