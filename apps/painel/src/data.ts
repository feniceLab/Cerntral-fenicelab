// ============================================================
// Painel Fenice — dados MOCKADOS (gastronomia BR)
// Tipos + fixtures realistas. Sem backend; tudo estatico/simulado.
// ============================================================

export interface Cliente {
  letter: string;
  nome: string;
  seg: string;
  plano: 'Pro' | 'Essencial';
  /** [label, bg, color] da pilula de status. */
  status: [string, string, string];
  posts: number;
  pend: number;
}

export interface QueueItem {
  cliente: string;
  letter: string;
  formato: string;
  img: string;
  legenda: string;
  quando: string;
  tempo: string;
}

export interface TriageItem {
  cliente: string;
  letter: string;
  arq: string;
  img: string;
  nota: string;
  quando: string;
}

// ---------- Clientes (Dashboard / tabela) ----------
export const CLIENTS: Cliente[] = [
  {
    letter: 'S',
    nome: 'Suprema Pizza',
    seg: 'Pizzaria · Blumenau',
    plano: 'Pro',
    status: ['Ativo', 'var(--fen-success-bg)', '#3c5232'],
    posts: 14,
    pend: 1,
  },
  {
    letter: 'A',
    nome: 'Arena Gourmet',
    seg: 'Restaurante · Blumenau',
    plano: 'Essencial',
    status: ['Em setup', 'var(--fen-warning-bg)', '#7a4520'],
    posts: 6,
    pend: 0,
  },
  {
    letter: 'O',
    nome: 'Oca Restaurante',
    seg: 'Comida de casa · grill',
    plano: 'Essencial',
    status: ['Ativo', 'var(--fen-success-bg)', '#3c5232'],
    posts: 9,
    pend: 2,
  },
];

// ---------- Fila de aprovacoes ----------
export const QUEUE: QueueItem[] = [
  {
    cliente: 'Suprema Pizza',
    letter: 'S',
    formato: 'Reel',
    img: '40',
    legenda: 'Aquela fome de fim de tarde tem nome… Pepperoni recheada saindo do forno.',
    quando: 'Qua 11 · 18h30',
    tempo: 'há 2h',
  },
  {
    cliente: 'Oca Restaurante',
    letter: 'O',
    formato: 'Foto',
    img: '01',
    legenda: 'Almoço completo, sabor de verdade e aquele tempero de casa.',
    quando: 'Qui 12 · 11h00',
    tempo: 'há 5h',
  },
  {
    cliente: 'Oca Restaurante',
    letter: 'O',
    formato: 'Carrossel',
    img: '50',
    legenda: 'Buffet fresquinho todo dia. Vem conhecer o novo espaço!',
    quando: 'Sex 13 · 11h30',
    tempo: 'há 1d',
  },
];

// ---------- Triagem (uploads dos clientes) ----------
export const TRIAGE: TriageItem[] = [
  {
    cliente: 'Suprema Pizza',
    letter: 'S',
    arq: 'IMG_0421.jpg',
    img: '60',
    nota: 'Foto nova da pepperoni — usar no Reel?',
    quando: 'há 20min',
  },
  {
    cliente: 'Arena Gourmet',
    letter: 'A',
    arq: 'bastidores.mp4',
    img: '50',
    nota: 'Bastidores da cozinha (vídeo 0:45).',
    quando: 'há 1h',
  },
  {
    cliente: 'Oca Restaurante',
    letter: 'O',
    arq: 'buffet-2.jpg',
    img: '01',
    nota: '',
    quando: 'há 3h',
  },
];

// ---------- Calendario geral ----------
export const CLIENT_COLOR: Record<string, string> = {
  S: 'var(--fen-terra)',
  O: 'var(--fen-cotta)',
  A: 'var(--fen-success)',
};
export const CLIENT_SHORT: Record<string, string> = { S: 'Suprema', O: 'Oca', A: 'Arena' };
export const CALENDAR_EVENTS: Record<number, string[]> = {
  2: ['S'],
  4: ['O', 'S'],
  9: ['S'],
  11: ['S', 'O'],
  12: ['O'],
  13: ['O', 'S'],
  16: ['S', 'A'],
  18: ['S'],
  20: ['O'],
  23: ['S', 'A'],
  25: ['O'],
  27: ['S'],
};

// ============================================================
// Submodulo TRAFEGO PAGO — dados Meta Ads (gastronomia)
// ============================================================

export interface TPCliente {
  letter: string;
  nome: string;
  gasto: number;
  roas: number;
  vendas: number;
  ativas: number;
  total: number;
  alerta: 'pacing' | 'setup' | 'budget' | null;
  tend: number[];
}

export interface TPAnuncio {
  id: string;
  nome: string;
  formato: string;
  img: string;
  status: boolean;
  gasto: number;
  resultados: number;
}

export interface TPConjunto {
  id: string;
  nome: string;
  status: boolean;
  budget: string;
  gasto: number;
  resultados: number;
  roas: number;
  anuncios: TPAnuncio[];
}

export interface TPCampanha {
  id: string;
  nome: string;
  objetivo: 'Vendas' | 'Alcance' | 'Mensagens';
  status: boolean;
  budget: string;
  gasto: number;
  resultados: number;
  roas: number;
  vendas: number;
  conjuntos: TPConjunto[];
}

// ⚠️ MOCK legado (placeholder do submódulo de Tráfego). Só clientes Fenice Lab —
// nada de Starken aqui. Será substituído por dados reais na consolidação do serviço de tráfego.
export const TP_CLIENTES: TPCliente[] = [
  { letter: 'S', nome: 'Suprema Pizza', gasto: 412.8, roas: 4.8, vendas: 1980, ativas: 2, total: 3, alerta: null, tend: [8, 12, 9, 15, 14, 22, 28] },
  { letter: 'O', nome: 'Restaurante Oca', gasto: 168.4, roas: 3.1, vendas: 522, ativas: 1, total: 2, alerta: 'pacing', tend: [5, 6, 8, 7, 9, 11, 10] },
  { letter: 'A', nome: 'Arena Gourmet', gasto: 0, roas: 0, vendas: 0, ativas: 0, total: 1, alerta: 'setup', tend: [0, 0, 0, 0, 0, 0, 0] },
];

export const TP_CAMPANHAS: TPCampanha[] = [
  {
    id: 'c1', nome: 'Vendas Delivery · Junho', objetivo: 'Vendas', status: true,
    budget: '30/dia', gasto: 318.4, resultados: 41, roas: 5.2, vendas: 1656,
    conjuntos: [
      {
        id: 's1', nome: 'Blumenau · 25-45 · Pizza', status: true, budget: '18/dia', gasto: 196.2, resultados: 26, roas: 5.4,
        anuncios: [
          { id: 'a1', nome: 'Reel — Pepperoni no forno', formato: 'Reel', img: '40', status: true, gasto: 121.0, resultados: 17 },
          { id: 'a2', nome: 'Foto — Combo 2 pizzas', formato: 'Imagem', img: '50', status: true, gasto: 75.2, resultados: 9 },
        ],
      },
      {
        id: 's2', nome: 'Remarketing · 30 dias', status: true, budget: '12/dia', gasto: 122.2, resultados: 15, roas: 4.9,
        anuncios: [{ id: 'a3', nome: 'Carrossel — Cardápio', formato: 'Carrossel', img: '01', status: true, gasto: 122.2, resultados: 15 }],
      },
    ],
  },
  {
    id: 'c2', nome: 'Alcance · Novo Espaço', objetivo: 'Alcance', status: true,
    budget: '15/dia', gasto: 94.4, resultados: 8120, roas: 0, vendas: 0,
    conjuntos: [
      {
        id: 's3', nome: 'Blumenau · 5km · Amplo', status: true, budget: '15/dia', gasto: 94.4, resultados: 8120, roas: 0,
        anuncios: [{ id: 'a4', nome: 'Vídeo — Tour do salão', formato: 'Reel', img: '60', status: true, gasto: 94.4, resultados: 8120 }],
      },
    ],
  },
  {
    id: 'c3', nome: 'Mensagens · WhatsApp', objetivo: 'Mensagens', status: false,
    budget: '10/dia', gasto: 0, resultados: 0, roas: 0, vendas: 0,
    conjuntos: [
      {
        id: 's4', nome: 'Interesse · Delivery', status: false, budget: '10/dia', gasto: 0, resultados: 0, roas: 0,
        anuncios: [{ id: 'a5', nome: 'Foto — Peça pelo zap', formato: 'Imagem', img: '50', status: false, gasto: 0, resultados: 0 }],
      },
    ],
  },
];

// ---------- Formatadores BRL ----------
export const brl = (n: number): string =>
  'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const brl0 = (n: number): string =>
  'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
