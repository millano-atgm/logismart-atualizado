'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Clock3, ExternalLink, Factory, Package, Wrench } from 'lucide-react'
import { AnaliseBox, KpiTile, PageIntro, Section } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDemo } from '@/lib/store'

type OsStatus = 'Aguardando avaliação' | 'Agendado' | 'Em manutenção' | 'Aguardando peça' | 'Concluído'
type Prioridade = 'Alta' | 'Média' | 'Baixa'

type OrdemServico = {
  id: string
  veiculoId: string
  tipo: 'Corretiva' | 'Preventiva' | 'Inspeção'
  motivo: string
  servico: string
  pecas: string[]
  prioridade: Prioridade
  status: OsStatus
  km: string
  previsao: string
  custo: number
}

const oficinas = [
  { id: 'of-01', nome: 'Centro Diesel Vale', local: 'Campinas · 18 km', especialidade: 'Veículos pesados e arrefecimento', disponibilidade: 'Hoje, 15:30', prazo: '2 dias', custo: 980 },
  { id: 'of-02', nome: 'Rota Norte Serviços', local: 'São Paulo · 24 km', especialidade: 'Freios, suspensão e revisão preventiva', disponibilidade: 'Amanhã, 08:00', prazo: '1 dia', custo: 720 },
  { id: 'of-03', nome: 'Ponto Truck Oficina', local: 'Santos · 72 km', especialidade: 'Pneus, alinhamento e filtros', disponibilidade: '29/08, 09:00', prazo: '1 dia', custo: 540 },
]

const ordensIniciais: OrdemServico[] = [
  { id: 'os-001', veiculoId: 'cam-02', tipo: 'Corretiva', motivo: 'Oscilação de temperatura detectada', servico: 'Inspeção do sistema de arrefecimento', pecas: ['Líquido de arrefecimento', 'Mangueiras', 'Termostato'], prioridade: 'Alta', status: 'Aguardando avaliação', km: '412.850 km', previsao: 'Hoje', custo: 980 },
  { id: 'os-002', veiculoId: 'vei-14', tipo: 'Preventiva', motivo: 'Revisão preventiva próxima dos 90.000 km', servico: 'Revisão preventiva completa', pecas: ['Óleo do motor', 'Filtros', 'Checklist de segurança'], prioridade: 'Média', status: 'Em manutenção', km: '88.740 km', previsao: 'Em 2 dias úteis', custo: 720 },
  { id: 'os-003', veiculoId: 'cam-15', tipo: 'Corretiva', motivo: 'Desgaste do sistema de freios', servico: 'Inspeção e ajuste do sistema de freios', pecas: ['Pastilhas', 'Fluido de freio'], prioridade: 'Alta', status: 'Aguardando peça', km: '341.990 km', previsao: 'Em 4 dias úteis', custo: 1850 },
  { id: 'os-004', veiculoId: 'cam-12', tipo: 'Preventiva', motivo: 'Consumo abaixo da média da frota', servico: 'Verificação de pneus e alinhamento', pecas: ['Válvulas', 'Balanceamento'], prioridade: 'Média', status: 'Agendado', km: '233.610 km', previsao: '29/08', custo: 540 },
]

const statusTone: Record<OsStatus, 'primary' | 'warning' | 'neutral' | 'success'> = {
  'Aguardando avaliação': 'warning',
  Agendado: 'primary',
  'Em manutenção': 'primary',
  'Aguardando peça': 'warning',
  Concluído: 'success',
}

function moeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ManutencaoPage() {
  const { veiculos, manutencoes } = useDemo()
  const [ordens, setOrdens] = useState(ordensIniciais)
  const [aba, setAba] = useState<'visao' | 'ordens' | 'oficinas' | 'agenda' | 'historico'>('visao')
  const [ordemAberta, setOrdemAberta] = useState<string | null>(null)
  const [oficinaSelecionada, setOficinaSelecionada] = useState('of-01')
  const [mensagem, setMensagem] = useState('')

  const nomeVeiculo = (id: string) => veiculos.find((v) => v.id === id)?.nome ?? id
  const abertas = ordens.filter((o) => o.status !== 'Concluído')
  const agendadas = ordens.filter((o) => o.status === 'Agendado')
  const concluidas = ordens.filter((o) => o.status === 'Concluído')
  const custoEstimado = abertas.reduce((total, o) => total + o.custo, 0)
  const recomendadas = manutencoes.filter((item) => item.situacao === 'recomendada').length

  const ordemSelecionada = useMemo(() => ordens.find((o) => o.id === ordemAberta), [ordens, ordemAberta])

  function atualizarOrdem(id: string, status: OsStatus) {
    setOrdens((atual) => atual.map((ordem) => (ordem.id === id ? { ...ordem, status } : ordem)))
    setMensagem(status === 'Concluído' ? 'Serviço concluído e registrado no histórico.' : `Ordem atualizada para “${status}”.`)
  }

  function agendar(ordem: OrdemServico) {
    const oficina = oficinas.find((item) => item.id === oficinaSelecionada) ?? oficinas[0]
    atualizarOrdem(ordem.id, 'Agendado')
    setAba('agenda')
    setMensagem(`${ordem.servico} agendado na ${oficina.nome} para ${oficina.disponibilidade}.`)
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro titulo="Central de manutenção" descricao="Planeje revisões, acompanhe ordens de serviço e transforme alertas da telemetria em ações operacionais." />
      </div>

      {mensagem ? <div role="status" className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary"><CheckCircle2 className="size-4 shrink-0" /><span className="min-w-0 flex-1">{mensagem}</span><button className="shrink-0 text-xs underline" onClick={() => setMensagem('')}>Fechar</button></div> : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiTile label="Em manutenção" valor={String(ordens.filter((o) => o.status === 'Em manutenção').length)} nota="fora de operação" />
        <KpiTile label="Preventivas próximas" valor={String(recomendadas)} destaque="negativo" />
        <KpiTile label="Ordens pendentes" valor={String(abertas.length)} />
        <KpiTile label="Agendadas" valor={String(agendadas.length)} />
        <KpiTile label="Custo estimado" valor={moeda(custoEstimado)} />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2" role="tablist" aria-label="Seções da manutenção">
        {([['visao', 'Visão geral'], ['ordens', 'Ordens de serviço'], ['oficinas', 'Oficinas parceiras'], ['agenda', 'Agendamentos'], ['historico', 'Histórico']] as const).map(([id, label]) => <button key={id} role="tab" aria-selected={aba === id} onClick={() => setAba(id)} className={`rounded-lg px-3 py-2 text-sm transition-colors ${aba === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>{label}</button>)}
      </div>

      {aba === 'visao' ? <>
        <Section titulo="Ordens que exigem atenção" descricao="Registros derivados das condições atuais da frota.">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{ordens.slice(0, 4).map((ordem) => <OrdemCard key={ordem.id} ordem={ordem} nomeVeiculo={nomeVeiculo} abrir={() => setOrdemAberta(ordem.id)} />)}</div>
        </Section>
        <Section titulo="Próximas revisões" descricao="Veículos ordenados pela quilometragem restante.">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{veiculos.filter((v) => v.status !== 'manutencao').sort((a, b) => a.kmAteManutencao - b.kmAteManutencao).slice(0, 6).map((v) => <Card key={v.id}><CardContent className="flex flex-col gap-2"><div className="flex justify-between gap-2"><Link href={`/veiculos/${v.id}`} className="text-sm font-medium hover:underline">{v.nome}</Link><Wrench className="size-4 text-muted-foreground" /></div><span className="font-mono text-xs text-muted-foreground">{v.kmAteManutencao.toLocaleString('pt-BR')} km até a revisão</span><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(8, 100 - Math.min(100, v.kmAteManutencao / 80))}%` }} /></div></CardContent></Card>)}</div>
        </Section>
      </> : null}

      {aba === 'ordens' ? <Section titulo="Ordens de serviço" descricao="Acompanhe prioridade, peças previstas e andamento de cada serviço."><div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{ordens.map((ordem) => <OrdemCard key={ordem.id} ordem={ordem} nomeVeiculo={nomeVeiculo} abrir={() => setOrdemAberta(ordem.id)} />)}</div></Section> : null}

      {aba === 'oficinas' ? <Section titulo="Oficinas parceiras" descricao="Disponibilidade, prazo e custo estimados para cada serviço."><div className="grid grid-cols-1 gap-3 lg:grid-cols-3">{oficinas.map((oficina) => <Card key={oficina.id}><CardContent className="flex flex-col gap-3"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{oficina.nome}</h3><p className="text-xs text-muted-foreground">{oficina.local}</p></div><Factory className="size-5 text-primary" /></div><p className="text-sm text-foreground/90">{oficina.especialidade}</p><div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground"><span>Disponível<br /><strong className="text-foreground">{oficina.disponibilidade}</strong></span><span>Prazo<br /><strong className="text-foreground">{oficina.prazo}</strong></span></div><span className="text-sm font-medium">Estimativa: {moeda(oficina.custo)}</span><Button size="sm" variant="outline" onClick={() => { setOficinaSelecionada(oficina.id); setMensagem(`${oficina.nome} selecionada como recomendação para o próximo serviço.`) }}>Selecionar oficina</Button></CardContent></Card>)}</div></Section> : null}

      {aba === 'agenda' ? <Section titulo="Agendamentos" descricao="Serviços confirmados para atendimento.">{agendadas.length ? <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{agendadas.map((ordem) => <OrdemCard key={ordem.id} ordem={ordem} nomeVeiculo={nomeVeiculo} abrir={() => setOrdemAberta(ordem.id)} />)}</div> : <Empty text="Nenhum serviço agendado no momento." />}</Section> : null}

      {aba === 'historico' ? <Section titulo="Histórico de manutenção" descricao="Serviços concluídos permanecem registrados para consulta.">{concluidas.length ? <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{concluidas.map((ordem) => <OrdemCard key={ordem.id} ordem={ordem} nomeVeiculo={nomeVeiculo} abrir={() => setOrdemAberta(ordem.id)} />)}</div> : <Empty text="Ainda não há serviços concluídos nesta sessão." />}</Section> : null}

      {ordemSelecionada ? <div className="fixed inset-0 z-40 grid place-items-center bg-background/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Detalhes da ${ordemSelecionada.id}`}><Card className="max-h-[90vh] w-full max-w-2xl overflow-auto"><CardContent className="flex flex-col gap-4"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs text-muted-foreground">{ordemSelecionada.id}</p><h2 className="text-lg font-semibold">{ordemSelecionada.servico}</h2><p className="text-sm text-muted-foreground">{nomeVeiculo(ordemSelecionada.veiculoId)} · {ordemSelecionada.tipo}</p></div><button className="text-sm text-muted-foreground underline" onClick={() => setOrdemAberta(null)}>Fechar</button></div><div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"><div><span className="text-xs text-muted-foreground">Prioridade</span><p className="font-medium">{ordemSelecionada.prioridade}</p></div><div><span className="text-xs text-muted-foreground">Quilometragem</span><p className="font-mono">{ordemSelecionada.km}</p></div><div><span className="text-xs text-muted-foreground">Previsão</span><p>{ordemSelecionada.previsao}</p></div><div><span className="text-xs text-muted-foreground">Estimativa</span><p>{moeda(ordemSelecionada.custo)}</p></div></div><p className="rounded-lg bg-secondary/60 p-3 text-sm">{ordemSelecionada.motivo}</p><div><h3 className="mb-2 text-sm font-semibold">Peças e itens a verificar</h3><ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">{ordemSelecionada.pecas.map((peca) => <li key={peca} className="flex items-center gap-2"><Package className="size-3.5 text-primary" />{peca}</li>)}</ul></div><div className="flex flex-wrap gap-2"><Button onClick={() => agendar(ordemSelecionada)} disabled={ordemSelecionada.status === 'Concluído'}><CalendarDays className="size-4" />Programar serviço</Button><Button variant="outline" onClick={() => atualizarOrdem(ordemSelecionada.id, ordemSelecionada.status === 'Concluído' ? 'Aguardando avaliação' : 'Concluído')}><CheckCircle2 className="size-4" />{ordemSelecionada.status === 'Concluído' ? 'Reabrir ordem' : 'Registrar conclusão'}</Button></div></CardContent></Card></div> : null}

      <AnaliseBox titulo="Análise do LogiSmart" texto="A central prioriza o Caminhão 02 porque a anomalia de temperatura combina risco operacional e possibilidade de parada não programada. A recomendação considera os alertas existentes, os veículos atuais e a disponibilidade das oficinas parceiras." />
    </>
  )
}

function OrdemCard({ ordem, nomeVeiculo, abrir }: { ordem: OrdemServico; nomeVeiculo: (id: string) => string; abrir: () => void }) {
  return <Card><CardContent className="flex flex-col gap-3"><div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{nomeVeiculo(ordem.veiculoId)}</p><p className="text-xs text-muted-foreground">{ordem.tipo} · {ordem.id}</p></div><Badge tone={statusTone[ordem.status]}>{ordem.status}</Badge></div><p className="text-sm">{ordem.servico}</p><p className="text-xs text-muted-foreground">{ordem.motivo}</p><div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{ordem.previsao}</span><span className="font-mono">{moeda(ordem.custo)}</span><span>Prioridade {ordem.prioridade}</span></div><Button size="sm" variant="outline" className="w-fit" onClick={abrir}>Visualizar ordem <ExternalLink className="size-3.5" /></Button></CardContent></Card>
}

function Empty({ text }: { text: string }) { return <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{text}</div> }
