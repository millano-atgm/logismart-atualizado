// ============================================================
// LogiSmart — Base de dados SIMULADA (protótipo acadêmico)
// Em uma aplicação real estes dados viriam de um TMS + telemetria.
// ============================================================

export type VehicleStatus = 'em_rota' | 'atencao' | 'atrasado' | 'manutencao'
export type Severidade = 'critico' | 'atencao' | 'info'
export type Transito = 'livre' | 'moderado' | 'intenso'

export interface Vehicle {
  id: string
  nome: string
  placa: string
  modelo: string
  motorista: string
  rota: string
  consumo: number | null // km/L
  status: VehicleStatus
  kmTotal: number
  velocidadeMedia: number // km/h
  horasOperacao: number // horas na semana
  marchaLenta: number // % do tempo ligado
  co2: number // kg estimados na semana
  custoKm: number // R$
  ultimaManutencao: string
  proximaManutencaoKm: number
  kmAteManutencao: number
  eta?: string
  analise: string
}

export interface Alerta {
  id: string
  severidade: Severidade
  categoria: 'seguranca' | 'operacional' | 'manutencao' | 'ambiental'
  titulo: string
  veiculoId: string | null
  veiculoNome: string
  dataHora: string
  problema: string
  impacto: string
  recomendacao: string
  resolvido: boolean
}

export interface Insight {
  id: string
  tom: 'critico' | 'atencao' | 'positivo'
  titulo: string
  alvo: string
  observacao: string
  sugestao: string
  acaoLabel: string
  acaoHref: string
}

export interface Rota {
  id: string
  nome: string
  veiculoId: string
  veiculoNome: string
  motorista: string
  transito: Transito
  progresso: number // %
  etaMin: number
  atrasoMin: number
  alternativa?: string
  economiaMin?: number
  observacao: string
  posicao?: { x: number; y: number }
}

export interface ManutencaoItem {
  id: string
  veiculoId: string
  veiculoNome: string
  tipo: 'corretiva' | 'preventiva' | 'inspecao'
  situacao: 'em_oficina' | 'agendada' | 'recomendada'
  descricao: string
  kmRestante: number | null
  prazo: string
}

export interface Ponto {
  label: string
  valor: number
}

export const CONSUMO_MEDIO_FROTA = 8.4

export const veiculos: Vehicle[] = [
  {
    id: 'cam-02',
    nome: 'Caminhão 02',
    placa: 'FZK-2E41',
    modelo: 'Volvo FH 460',
    motorista: 'João Silva',
    rota: 'BR-116',
    consumo: 7.1,
    status: 'atencao',
    kmTotal: 412850,
    velocidadeMedia: 63,
    horasOperacao: 46,
    marchaLenta: 21,
    co2: 1240,
    custoKm: 2.68,
    ultimaManutencao: '12/07 — 408.100 km',
    proximaManutencaoKm: 418000,
    kmAteManutencao: 5150,
    eta: '14:40',
    analise:
      'O Caminhão 02 apresenta consumo 15% acima da média da frota e aumento no tempo de marcha lenta. Recomenda-se verificar o comportamento de condução e realizar inspeção preventiva.',
  },
  {
    id: 'vei-08',
    nome: 'Veículo 08',
    placa: 'RQT-7B22',
    modelo: 'Mercedes Atego 1719',
    motorista: 'Carlos Souza',
    rota: 'SP → RJ',
    consumo: 8.2,
    status: 'atrasado',
    kmTotal: 198430,
    velocidadeMedia: 48,
    horasOperacao: 44,
    marchaLenta: 17,
    co2: 980,
    custoKm: 2.31,
    ultimaManutencao: '02/08 — 195.900 km',
    proximaManutencaoKm: 205000,
    kmAteManutencao: 6570,
    eta: '17:25 (+52 min)',
    analise:
      'O Veículo 08 acumula 52 minutos de atraso por congestionamento na BR-116. O tempo parado com motor ligado elevou o consumo em 6% no trecho.',
  },
  {
    id: 'cam-11',
    nome: 'Caminhão 11',
    placa: 'GHP-1D08',
    modelo: 'Scania R 450',
    motorista: 'Pedro Lima',
    rota: 'SP → Campinas',
    consumo: 9.1,
    status: 'em_rota',
    kmTotal: 143220,
    velocidadeMedia: 71,
    horasOperacao: 42,
    marchaLenta: 9,
    co2: 720,
    custoKm: 1.94,
    ultimaManutencao: '28/07 — 140.500 km',
    proximaManutencaoKm: 150000,
    kmAteManutencao: 6780,
    eta: '11:10',
    analise:
      'Desempenho acima da média da frota. Padrão de condução estável e baixo tempo em marcha lenta — bom referencial de eco-condução.',
  },
  {
    id: 'cam-05',
    nome: 'Caminhão 05',
    placa: 'JLM-9C55',
    modelo: 'Volvo FM 420',
    motorista: 'Lucas Santos',
    rota: 'SP → Santos',
    consumo: 8.7,
    status: 'em_rota',
    kmTotal: 256900,
    velocidadeMedia: 66,
    horasOperacao: 41,
    marchaLenta: 11,
    co2: 810,
    custoKm: 2.05,
    ultimaManutencao: '19/07 — 252.300 km',
    proximaManutencaoKm: 262000,
    kmAteManutencao: 5100,
    eta: '10:55',
    analise:
      'Operação dentro do esperado. Consumo 4% acima da média da frota, sem alertas ativos no período.',
  },
  {
    id: 'vei-14',
    nome: 'Veículo 14',
    placa: 'BTX-4H90',
    modelo: 'Iveco Daily 35-150',
    motorista: 'Rafael Costa',
    rota: 'Campinas → SP',
    consumo: null,
    status: 'manutencao',
    kmTotal: 88740,
    velocidadeMedia: 0,
    horasOperacao: 0,
    marchaLenta: 0,
    co2: 0,
    custoKm: 0,
    ultimaManutencao: '05/06 — 84.200 km',
    proximaManutencaoKm: 89590,
    kmAteManutencao: 850,
    analise:
      'Veículo recolhido para revisão preventiva de 90.000 km. Retorno previsto em 2 dias úteis — a rota foi redistribuída para o Veículo 10.',
  },
  {
    id: 'cam-01',
    nome: 'Caminhão 01',
    placa: 'CDE-3F17',
    modelo: 'Scania P 320',
    motorista: 'Marcos Dias',
    rota: 'SP → Sorocaba',
    consumo: 8.9,
    status: 'em_rota',
    kmTotal: 311470,
    velocidadeMedia: 69,
    horasOperacao: 43,
    marchaLenta: 10,
    co2: 760,
    custoKm: 1.99,
    ultimaManutencao: '30/07 — 308.000 km',
    proximaManutencaoKm: 318000,
    kmAteManutencao: 6530,
    eta: '09:40',
    analise: 'Consumo consistente há 3 semanas. Nenhum desvio relevante identificado.',
  },
  {
    id: 'cam-03',
    nome: 'Caminhão 03',
    placa: 'NOP-6K73',
    modelo: 'Volvo FH 440',
    motorista: 'Anderson Rocha',
    rota: 'SP → S. J. dos Campos',
    consumo: 7.5,
    status: 'atencao',
    kmTotal: 367310,
    velocidadeMedia: 58,
    horasOperacao: 45,
    marchaLenta: 19,
    co2: 1150,
    custoKm: 2.54,
    ultimaManutencao: '10/07 — 362.800 km',
    proximaManutencaoKm: 372000,
    kmAteManutencao: 4690,
    eta: '13:05',
    analise:
      'Tempo em marcha lenta 19% acima do ideal e consumo 11% abaixo da média. Indício de longas esperas com motor ligado em carga/descarga.',
  },
  {
    id: 'vei-04',
    nome: 'Veículo 04',
    placa: 'STU-8L21',
    modelo: 'Mercedes Sprinter 416',
    motorista: 'Bruno Alves',
    rota: 'Guarulhos → SP',
    consumo: 8.5,
    status: 'em_rota',
    kmTotal: 121060,
    velocidadeMedia: 52,
    horasOperacao: 39,
    marchaLenta: 13,
    co2: 640,
    custoKm: 2.12,
    ultimaManutencao: '22/07 — 118.400 km',
    proximaManutencaoKm: 128000,
    kmAteManutencao: 6940,
    eta: '08:50',
    analise: 'Rota urbana com muitas paradas. Consumo compatível com o perfil de operação.',
  },
  {
    id: 'cam-06',
    nome: 'Caminhão 06',
    placa: 'VWX-5M64',
    modelo: 'Scania R 500',
    motorista: 'Felipe Moura',
    rota: 'SP → Ribeirão Preto',
    consumo: 9.4,
    status: 'em_rota',
    kmTotal: 174950,
    velocidadeMedia: 73,
    horasOperacao: 44,
    marchaLenta: 7,
    co2: 690,
    custoKm: 1.87,
    ultimaManutencao: '05/08 — 172.100 km',
    proximaManutencaoKm: 182000,
    kmAteManutencao: 7050,
    eta: '15:30',
    analise:
      'Melhor eficiência da frota (+12% sobre a média). Referência para o programa de eco-condução.',
  },
  {
    id: 'vei-07',
    nome: 'Veículo 07',
    placa: 'YZA-2N38',
    modelo: 'Iveco Tector 11-190',
    motorista: 'Diego Nunes',
    rota: 'Santos → SP',
    consumo: 8.1,
    status: 'em_rota',
    kmTotal: 209880,
    velocidadeMedia: 61,
    horasOperacao: 40,
    marchaLenta: 14,
    co2: 870,
    custoKm: 2.22,
    ultimaManutencao: '16/07 — 205.600 km',
    proximaManutencaoKm: 215000,
    kmAteManutencao: 5120,
    eta: '12:15',
    analise: 'Consumo levemente abaixo da média, dentro da faixa aceitável para o trecho.',
  },
  {
    id: 'cam-09',
    nome: 'Caminhão 09',
    placa: 'BCD-7P95',
    modelo: 'Volvo FH 500',
    motorista: 'Tiago Ferreira',
    rota: 'SP → Curitiba',
    consumo: 7.9,
    status: 'em_rota',
    kmTotal: 288140,
    velocidadeMedia: 79,
    horasOperacao: 47,
    marchaLenta: 12,
    co2: 1080,
    custoKm: 2.34,
    ultimaManutencao: '25/07 — 284.900 km',
    proximaManutencaoKm: 295000,
    kmAteManutencao: 6860,
    eta: '18:05',
    analise:
      'Registrados 4 eventos de excesso de velocidade na BR-376. Velocidade média elevada impacta consumo e segurança.',
  },
  {
    id: 'vei-10',
    nome: 'Veículo 10',
    placa: 'EFG-4Q12',
    modelo: 'Mercedes Accelo 1016',
    motorista: 'Renato Barros',
    rota: 'SP → Bauru',
    consumo: 8.6,
    status: 'em_rota',
    kmTotal: 156730,
    velocidadeMedia: 64,
    horasOperacao: 42,
    marchaLenta: 12,
    co2: 780,
    custoKm: 2.08,
    ultimaManutencao: '01/08 — 153.900 km',
    proximaManutencaoKm: 164000,
    kmAteManutencao: 7270,
    eta: '16:20',
    analise: 'Assumiu a rota do Veículo 14 durante a manutenção. Desempenho estável.',
  },
  {
    id: 'cam-12',
    nome: 'Caminhão 12',
    placa: 'HIJ-9R57',
    modelo: 'Volvo FM 380',
    motorista: 'Igor Pereira',
    rota: 'Campinas → Santos',
    consumo: 7.4,
    status: 'atencao',
    kmTotal: 233610,
    velocidadeMedia: 56,
    horasOperacao: 45,
    marchaLenta: 20,
    co2: 1190,
    custoKm: 2.59,
    ultimaManutencao: '08/07 — 229.000 km',
    proximaManutencaoKm: 239000,
    kmAteManutencao: 5390,
    eta: '14:00',
    analise:
      'Consumo 12% abaixo da média da frota há duas semanas consecutivas. Verificar pressão dos pneus e perfil de aceleração.',
  },
  {
    id: 'vei-13',
    nome: 'Veículo 13',
    placa: 'KLM-1S83',
    modelo: 'Iveco Daily 70-170',
    motorista: 'Sérgio Ramos',
    rota: 'SP → Jundiaí',
    consumo: 9.0,
    status: 'em_rota',
    kmTotal: 97260,
    velocidadeMedia: 59,
    horasOperacao: 38,
    marchaLenta: 8,
    co2: 520,
    custoKm: 1.96,
    ultimaManutencao: '03/08 — 94.700 km',
    proximaManutencaoKm: 105000,
    kmAteManutencao: 7740,
    eta: '10:05',
    analise: 'Bom aproveitamento de rota curta. Sem desvios identificados no período.',
  },
  {
    id: 'cam-15',
    nome: 'Caminhão 15',
    placa: 'NPQ-6T29',
    modelo: 'Scania G 410',
    motorista: 'Vitor Melo',
    rota: 'Pátio — São Paulo',
    consumo: null,
    status: 'manutencao',
    kmTotal: 341990,
    velocidadeMedia: 0,
    horasOperacao: 0,
    marchaLenta: 0,
    co2: 0,
    custoKm: 0,
    ultimaManutencao: '11/06 — 336.500 km',
    proximaManutencaoKm: 346000,
    kmAteManutencao: 4010,
    analise:
      'Em oficina para troca do sistema de freios detectada por desgaste acima do previsto na telemetria.',
  },
]

export const alertas: Alerta[] = [
  {
    id: 'alt-01',
    severidade: 'critico',
    categoria: 'seguranca',
    titulo: 'Temperatura crítica do motor',
    veiculoId: 'cam-02',
    veiculoNome: 'Caminhão 02',
    dataHora: 'Hoje, 09:42',
    problema: 'Oscilação de temperatura no motor detectada via telemetria (picos de 104 °C).',
    impacto: 'Risco de quebra em operação e parada não programada da carga na BR-116.',
    recomendacao:
      'Redirecionar o veículo para a oficina mais próxima para evitar uma possível quebra durante a operação.',
    resolvido: false,
  },
  {
    id: 'alt-02',
    severidade: 'critico',
    categoria: 'seguranca',
    titulo: 'Excesso de velocidade recorrente',
    veiculoId: 'cam-09',
    veiculoNome: 'Caminhão 09',
    dataHora: 'Hoje, 08:15',
    problema: '4 eventos acima de 95 km/h registrados no trecho da BR-376.',
    impacto: 'Aumento do risco de acidente e consumo até 9% maior no trecho.',
    recomendacao:
      'Acionar o motorista pelo canal de bordo e incluí-lo no próximo ciclo de treinamento de eco-condução.',
    resolvido: false,
  },
  {
    id: 'alt-03',
    severidade: 'atencao',
    categoria: 'operacional',
    titulo: 'Atraso por trânsito',
    veiculoId: 'vei-08',
    veiculoNome: 'Veículo 08',
    dataHora: 'Hoje, 10:05',
    problema: 'Congestionamento intenso detectado na BR-116.',
    impacto: 'Previsão de 52 minutos de atraso na entrega e consumo extra em marcha lenta.',
    recomendacao:
      'Alterar para a Rota Alternativa B para economizar aproximadamente 40 minutos e reduzir o consumo de combustível.',
    resolvido: false,
  },
  {
    id: 'alt-04',
    severidade: 'atencao',
    categoria: 'operacional',
    titulo: 'Consumo acima da média',
    veiculoId: 'cam-12',
    veiculoNome: 'Caminhão 12',
    dataHora: 'Ontem, 18:20',
    problema: 'Consumo de 7,4 km/L — 12% pior que a média da frota (8,4 km/L).',
    impacto: 'Custo por km 19% acima do padrão da operação.',
    recomendacao:
      'Verificar pressão dos pneus, carga transportada e perfil de aceleração do motorista.',
    resolvido: false,
  },
  {
    id: 'alt-05',
    severidade: 'atencao',
    categoria: 'ambiental',
    titulo: 'Tempo em marcha lenta elevado',
    veiculoId: 'cam-03',
    veiculoNome: 'Caminhão 03',
    dataHora: 'Ontem, 15:47',
    problema: '19% do tempo ligado sem deslocamento durante carga e descarga.',
    impacto: 'Desperdício estimado de 34 litros por semana e emissões evitáveis.',
    recomendacao:
      'Orientar o desligamento do motor em esperas acima de 3 minutos nos pontos de carga.',
    resolvido: false,
  },
  {
    id: 'alt-06',
    severidade: 'atencao',
    categoria: 'manutencao',
    titulo: 'Revisão preventiva próxima',
    veiculoId: 'vei-14',
    veiculoNome: 'Veículo 14',
    dataHora: 'Ontem, 11:30',
    problema: 'Faltam 850 km para a revisão preventiva de 90.000 km.',
    impacto: 'Ultrapassar o intervalo aumenta o risco de manutenção corretiva mais custosa.',
    recomendacao: 'Manter o veículo em oficina e liberar somente após a revisão concluída.',
    resolvido: false,
  },
  {
    id: 'alt-07',
    severidade: 'info',
    categoria: 'ambiental',
    titulo: 'Meta de redução de emissões alcançada',
    veiculoId: null,
    veiculoNome: 'Frota',
    dataHora: 'Hoje, 07:00',
    problema: 'A frota reduziu as emissões de CO₂ em 15% em relação à semana anterior.',
    impacto: 'Meta semanal da ODS 12 atingida com folga de 3 pontos percentuais.',
    recomendacao:
      'Manter os limites atuais de velocidade controlada e reconhecer os três motoristas com melhor desempenho.',
    resolvido: false,
  },
  {
    id: 'alt-08',
    severidade: 'info',
    categoria: 'operacional',
    titulo: 'Melhor eficiência da semana',
    veiculoId: 'cam-06',
    veiculoNome: 'Caminhão 06',
    dataHora: 'Hoje, 07:00',
    problema: 'Consumo de 9,4 km/L, 12% acima da média da frota.',
    impacto: 'Economia estimada de R$ 410 no período.',
    recomendacao: 'Usar o padrão de condução como referência no treinamento dos demais motoristas.',
    resolvido: false,
  },
]

export const insights: Insight[] = [
  {
    id: 'ins-01',
    tom: 'critico',
    titulo: 'Temperatura Crítica',
    alvo: 'Caminhão 02',
    observacao: 'Oscilação de temperatura no motor detectada via telemetria.',
    sugestao:
      'Redirecionar o veículo para a oficina mais próxima para evitar uma possível quebra durante a operação.',
    acaoLabel: 'Ver veículo',
    acaoHref: '/veiculos/cam-02',
  },
  {
    id: 'ins-02',
    tom: 'atencao',
    titulo: 'Atraso por Trânsito',
    alvo: 'Veículo 08',
    observacao: 'Congestionamento intenso detectado na BR-116.',
    sugestao:
      'Alterar para a Rota Alternativa B para economizar aproximadamente 40 minutos e reduzir o consumo de combustível.',
    acaoLabel: 'Ver rota',
    acaoHref: '/rotas',
  },
  {
    id: 'ins-03',
    tom: 'positivo',
    titulo: 'Meta de Eco-Condução',
    alvo: 'Frota completa',
    observacao: 'A frota reduziu as emissões de CO₂ em 15% esta semana.',
    sugestao:
      'Manter os limites atuais de velocidade controlada e reconhecer os três motoristas com melhor desempenho.',
    acaoLabel: 'Ver desempenho',
    acaoHref: '/sustentabilidade',
  },
]

export const rotas: Rota[] = [
  {
    id: 'rot-01',
    nome: 'BR-116 — São Paulo → Registro',
    veiculoId: 'cam-02',
    veiculoNome: 'Caminhão 02',
    motorista: 'João Silva',
    transito: 'intenso',
    progresso: 62,
    etaMin: 95,
    atrasoMin: 18,
    alternativa: 'Rota Alternativa B (SP-160)',
    economiaMin: 25,
    observacao: 'Trânsito intenso somado a alerta de temperatura do motor no mesmo trecho.',
  },
  {
    id: 'rot-02',
    nome: 'SP → RJ (Dutra)',
    veiculoId: 'vei-08',
    veiculoNome: 'Veículo 08',
    motorista: 'Carlos Souza',
    transito: 'intenso',
    progresso: 44,
    etaMin: 187,
    atrasoMin: 52,
    alternativa: 'Rota Alternativa B (Rio-Santos parcial)',
    economiaMin: 40,
    observacao: 'Congestionamento intenso na BR-116; desvio pode recuperar ~40 minutos.',
  },
  {
    id: 'rot-03',
    nome: 'SP → Campinas (Anhanguera)',
    veiculoId: 'cam-11',
    veiculoNome: 'Caminhão 11',
    motorista: 'Pedro Lima',
    transito: 'livre',
    progresso: 78,
    etaMin: 26,
    atrasoMin: 0,
    observacao: 'Fluxo livre. Entrega dentro da janela programada.',
  },
  {
    id: 'rot-04',
    nome: 'SP → Santos (Imigrantes)',
    veiculoId: 'cam-05',
    veiculoNome: 'Caminhão 05',
    motorista: 'Lucas Santos',
    transito: 'moderado',
    progresso: 55,
    etaMin: 48,
    atrasoMin: 6,
    observacao: 'Lentidão pontual na descida da serra, sem impacto relevante na janela.',
  },
  {
    id: 'rot-05',
    nome: 'SP → Curitiba (BR-376)',
    veiculoId: 'cam-09',
    veiculoNome: 'Caminhão 09',
    motorista: 'Tiago Ferreira',
    transito: 'moderado',
    progresso: 31,
    etaMin: 264,
    atrasoMin: 0,
    observacao: 'Dentro do prazo, porém com eventos de excesso de velocidade registrados.',
  },
  {
    id: 'rot-06',
    nome: 'SP → Ribeirão Preto (Bandeirantes)',
    veiculoId: 'cam-06',
    veiculoNome: 'Caminhão 06',
    motorista: 'Felipe Moura',
    transito: 'livre',
    progresso: 67,
    etaMin: 82,
    atrasoMin: 0,
    observacao: 'Melhor eficiência de combustível do dia neste trecho.',
  },
]

export const manutencoes: ManutencaoItem[] = [
  {
    id: 'man-01',
    veiculoId: 'vei-14',
    veiculoNome: 'Veículo 14',
    tipo: 'preventiva',
    situacao: 'em_oficina',
    descricao: 'Revisão preventiva em 850 km (marco de 90.000 km) — veículo já recolhido.',
    kmRestante: 850,
    prazo: 'Retorno em 2 dias úteis',
  },
  {
    id: 'man-02',
    veiculoId: 'cam-15',
    veiculoNome: 'Caminhão 15',
    tipo: 'corretiva',
    situacao: 'em_oficina',
    descricao: 'Troca do sistema de freios por desgaste acima do previsto na telemetria.',
    kmRestante: null,
    prazo: 'Retorno em 4 dias úteis',
  },
  {
    id: 'man-03',
    veiculoId: 'cam-02',
    veiculoNome: 'Caminhão 02',
    tipo: 'inspecao',
    situacao: 'recomendada',
    descricao: 'Inspeção recomendada devido à temperatura anormal do motor.',
    kmRestante: 5150,
    prazo: 'Imediata — redirecionar ainda hoje',
  },
  {
    id: 'man-04',
    veiculoId: 'cam-03',
    veiculoNome: 'Caminhão 03',
    tipo: 'preventiva',
    situacao: 'agendada',
    descricao: 'Revisão de injeção e filtro de ar por consumo abaixo da média.',
    kmRestante: 4690,
    prazo: 'Agendada para 29/08',
  },
  {
    id: 'man-05',
    veiculoId: 'cam-12',
    veiculoNome: 'Caminhão 12',
    tipo: 'inspecao',
    situacao: 'recomendada',
    descricao: 'Verificar pressão dos pneus e alinhamento — consumo 12% abaixo da média.',
    kmRestante: 5390,
    prazo: 'Próxima parada operacional',
  },
  {
    id: 'man-06',
    veiculoId: 'cam-05',
    veiculoNome: 'Caminhão 05',
    tipo: 'preventiva',
    situacao: 'agendada',
    descricao: 'Troca de óleo e filtros no marco de 262.000 km.',
    kmRestante: 5100,
    prazo: 'Agendada para 02/09',
  },
  {
    id: 'man-07',
    veiculoId: 'vei-07',
    veiculoNome: 'Veículo 07',
    tipo: 'preventiva',
    situacao: 'agendada',
    descricao: 'Revisão de suspensão no marco de 215.000 km.',
    kmRestante: 5120,
    prazo: 'Agendada para 05/09',
  },
]

// ---------- Séries temporais simuladas ----------

export const consumoSemana: Ponto[] = [
  { label: 'Seg', valor: 7.8 },
  { label: 'Ter', valor: 7.9 },
  { label: 'Qua', valor: 8.1 },
  { label: 'Qui', valor: 8.0 },
  { label: 'Sex', valor: 8.3 },
  { label: 'Sáb', valor: 8.5 },
  { label: 'Dom', valor: 8.4 },
]

export const utilizacaoSemana: Ponto[] = [
  { label: 'Seg', valor: 82 },
  { label: 'Ter', valor: 85 },
  { label: 'Qua', valor: 88 },
  { label: 'Qui', valor: 84 },
  { label: 'Sex', valor: 91 },
  { label: 'Sáb', valor: 89 },
  { label: 'Dom', valor: 87 },
]

export const co2Semana: Ponto[] = [
  { label: 'Seg', valor: 1420 },
  { label: 'Ter', valor: 1380 },
  { label: 'Qua', valor: 1310 },
  { label: 'Qui', valor: 1340 },
  { label: 'Sex', valor: 1250 },
  { label: 'Sáb', valor: 1190 },
  { label: 'Dom', valor: 1210 },
]

export type PeriodoId = 'hoje' | '7d' | '30d'

export interface Periodo {
  id: PeriodoId
  label: string
  consumoMedio: number
  custoKm: number
  utilizacao: number
  reducaoCo2: number
  km: number
  custoTotal: number
  litros: number
  variacaoConsumo: number
  serieConsumo: Ponto[]
  serieUtilizacao: Ponto[]
  serieCo2: Ponto[]
  insight: string
}

export const periodos: Record<PeriodoId, Periodo> = {
  hoje: {
    id: 'hoje',
    label: 'Hoje',
    consumoMedio: 8.6,
    custoKm: 2.11,
    utilizacao: 89,
    reducaoCo2: 4,
    km: 6120,
    custoTotal: 12913,
    litros: 712,
    variacaoConsumo: 2.4,
    serieConsumo: [
      { label: '00h', valor: 8.2 },
      { label: '04h', valor: 8.9 },
      { label: '08h', valor: 8.1 },
      { label: '12h', valor: 8.4 },
      { label: '16h', valor: 8.8 },
      { label: '20h', valor: 9.0 },
    ],
    serieUtilizacao: [
      { label: '00h', valor: 41 },
      { label: '04h', valor: 63 },
      { label: '08h', valor: 94 },
      { label: '12h', valor: 88 },
      { label: '16h', valor: 91 },
      { label: '20h', valor: 72 },
    ],
    serieCo2: [
      { label: '00h', valor: 180 },
      { label: '04h', valor: 240 },
      { label: '08h', valor: 320 },
      { label: '12h', valor: 290 },
      { label: '16h', valor: 270 },
      { label: '20h', valor: 210 },
    ],
    insight:
      'No dia de hoje o consumo médio está 2,4% melhor que a média das últimas semanas. O melhor desempenho ocorre nos períodos de madrugada, quando o trânsito reduz o tempo em marcha lenta.',
  },
  '7d': {
    id: '7d',
    label: 'Últimos 7 dias',
    consumoMedio: 8.4,
    custoKm: 2.17,
    utilizacao: 87,
    reducaoCo2: 15,
    km: 42850,
    custoTotal: 92985,
    litros: 5101,
    variacaoConsumo: 8,
    serieConsumo: consumoSemana,
    serieUtilizacao: utilizacaoSemana,
    serieCo2: co2Semana,
    insight:
      'O consumo médio da frota melhorou 8% nos últimos 7 dias. Os principais fatores identificados foram redução do tempo em marcha lenta e melhor aproveitamento das rotas.',
  },
  '30d': {
    id: '30d',
    label: 'Últimos 30 dias',
    consumoMedio: 8.1,
    custoKm: 2.29,
    utilizacao: 84,
    reducaoCo2: 11,
    km: 178400,
    custoTotal: 408536,
    litros: 22025,
    variacaoConsumo: 5.2,
    serieConsumo: [
      { label: 'Sem 1', valor: 7.6 },
      { label: 'Sem 2', valor: 7.9 },
      { label: 'Sem 3', valor: 8.1 },
      { label: 'Sem 4', valor: 8.4 },
    ],
    serieUtilizacao: [
      { label: 'Sem 1', valor: 79 },
      { label: 'Sem 2', valor: 82 },
      { label: 'Sem 3', valor: 85 },
      { label: 'Sem 4', valor: 87 },
    ],
    serieCo2: [
      { label: 'Sem 1', valor: 9800 },
      { label: 'Sem 2', valor: 9410 },
      { label: 'Sem 3', valor: 8960 },
      { label: 'Sem 4', valor: 8430 },
    ],
    insight:
      'Em 30 dias a frota apresentou melhora contínua de 5,2% no consumo. A curva sobe semana a semana, indicando que as ações de eco-condução tiveram efeito acumulado e não pontual.',
  },
}

export const sustentabilidade = {
  reducaoCombustivel: 8,
  reducaoCo2: 15,
  reducaoMarchaLenta: 11,
  litrosEconomizados: 1240,
  co2Evitado: 3210,
  arvoresEquivalentes: 146,
  melhoresMotoristas: [
    { nome: 'Felipe Moura', veiculo: 'Caminhão 06', consumo: 9.4, marchaLenta: 7 },
    { nome: 'Pedro Lima', veiculo: 'Caminhão 11', consumo: 9.1, marchaLenta: 9 },
    { nome: 'Sérgio Ramos', veiculo: 'Veículo 13', consumo: 9.0, marchaLenta: 8 },
  ],
}

export const statusLabel: Record<VehicleStatus, string> = {
  em_rota: 'Em rota',
  atencao: 'Atenção',
  atrasado: 'Atrasado',
  manutencao: 'Manutenção',
}

export const transitoLabel: Record<Transito, string> = {
  livre: 'Fluxo livre',
  moderado: 'Trânsito moderado',
  intenso: 'Trânsito intenso',
}

export const severidadeLabel: Record<Severidade, string> = {
  critico: 'Crítico',
  atencao: 'Atenção',
  info: 'Informativo',
}

export interface DemoState {
  veiculos: Vehicle[]
  alertas: Alerta[]
  insights: Insight[]
  rotas: Rota[]
  manutencoes: ManutencaoItem[]
}

export function estadoInicial(): DemoState {
  return {
    veiculos: veiculos.map((v) => ({ ...v })),
    alertas: alertas.map((a) => ({ ...a })),
    insights: insights.map((i) => ({ ...i })),
    rotas: rotas.map((r, index) => ({
      ...r,
      posicao: { x: 18 + (index % 4) * 21, y: 24 + (index % 3) * 25 },
    })),
    manutencoes: manutencoes.map((m) => ({ ...m })),
  }
}
