// ============================================================
// Trafego Pago — dados MOCKADOS (Meta Ads · gastronomia BR) + helpers.
// Sem backend: tudo ficticio, so para o visual pixel-perfect.
// ============================================================
import floraFlorUrl from '@fenice/shared/assets/fenice-flor.svg';
import seloTerraUrl from '@fenice/shared/assets/fenice-selo-terra.svg';
import foto01 from '@fenice/shared/assets/photos/foto-01.jpg';
import foto40 from '@fenice/shared/assets/photos/foto-40.jpg';
import foto50 from '@fenice/shared/assets/photos/foto-50.jpg';
import foto60 from '@fenice/shared/assets/photos/foto-60.jpg';

export const FENICE_FLOR = floraFlorUrl;
export const FENICE_SELO_TERRA = seloTerraUrl;

const PHOTO_MAP: Record<string, string> = {
  '01': foto01,
  '40': foto40,
  '50': foto50,
  '60': foto60,
};
/** Resolve o id de foto do prototipo ('40', '50'...) para a URL do bundle. */
export const photo = (n: string): string => PHOTO_MAP[n] ?? foto40;

export const brl = (n: number): string =>
  'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const brl0 = (n: number): string =>
  'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

// ---------- Tipos ----------
export type AlertaTipo = 'pacing' | 'setup' | 'budget' | null;

export interface Cliente {
  letter: string;
  nome: string;
  gasto: number;
  roas: number;
  vendas: number;
  ativas: number;
  total: number;
  alerta: AlertaTipo;
  tend: number[];
}

export interface Anuncio {
  id: string;
  nome: string;
  formato: string;
  img: string;
  status: boolean;
  gasto: number;
  resultados: number;
}
export interface Conjunto {
  id: string;
  nome: string;
  status: boolean;
  budget: string;
  gasto: number;
  resultados: number;
  roas: number;
  anuncios: Anuncio[];
}
export interface Campanha {
  id: string;
  nome: string;
  objetivo: 'Vendas' | 'Alcance' | 'Mensagens';
  status: boolean;
  budget: string;
  gasto: number;
  resultados: number;
  roas: number;
  vendas: number;
  conjuntos: Conjunto[];
}

// ---------- Clientes (cross-client) ----------
export const CLIENTES: Cliente[] = [
  { letter: 'S', nome: 'Suprema Pizza', gasto: 412.8, roas: 4.8, vendas: 1980, ativas: 2, total: 3, alerta: null, tend: [8, 12, 9, 15, 14, 22, 28] },
  { letter: 'O', nome: 'Oca Restaurante', gasto: 168.4, roas: 3.1, vendas: 522, ativas: 1, total: 2, alerta: 'pacing', tend: [5, 6, 8, 7, 9, 11, 10] },
  { letter: 'A', nome: 'Arena Gourmet', gasto: 0, roas: 0, vendas: 0, ativas: 0, total: 1, alerta: 'setup', tend: [0, 0, 0, 0, 0, 0, 0] },
  { letter: 'F', nome: 'Feio Burguer', gasto: 286.1, roas: 5.6, vendas: 1602, ativas: 2, total: 2, alerta: 'budget', tend: [10, 14, 13, 18, 20, 24, 26] },
];

// ---------- Campanhas (hierarquia da Suprema) ----------
export const CAMPANHAS: Campanha[] = [
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
        anuncios: [{ id: 'a3', nome: 'Carrossel — Cardapio', formato: 'Carrossel', img: '01', status: true, gasto: 122.2, resultados: 15 }],
      },
    ],
  },
  {
    id: 'c2', nome: 'Alcance · Novo Espaco', objetivo: 'Alcance', status: true,
    budget: '15/dia', gasto: 94.4, resultados: 8120, roas: 0, vendas: 0,
    conjuntos: [
      {
        id: 's3', nome: 'Blumenau · 5km · Amplo', status: true, budget: '15/dia', gasto: 94.4, resultados: 8120, roas: 0,
        anuncios: [{ id: 'a4', nome: 'Video — Tour do salao', formato: 'Reel', img: '60', status: true, gasto: 94.4, resultados: 8120 }],
      },
    ],
  },
  {
    id: 'c3', nome: 'Mensagens · WhatsApp', objetivo: 'Mensagens', status: false,
    budget: '10/dia', gasto: 0, resultados: 0, roas: 0, vendas: 0,
    conjuntos: [
      {
        id: 's4', nome: 'Interesse · Delivery', status: false, budget: '10/dia', gasto: 0, resultados: 0, roas: 0,
        anuncios: [{ id: 'a5', nome: 'Foto — Peca pelo zap', formato: 'Imagem', img: '50', status: false, gasto: 0, resultados: 0 }],
      },
    ],
  },
];
