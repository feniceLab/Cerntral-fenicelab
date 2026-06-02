// ============================================================
// Dados MOCKADOS — gastronomia BR (Suprema Pizza, Arena, Oca).
// Sem backend: alimentam os textos do painel de marca e os
// campos pré-preenchidos do formulário por papel.
// ============================================================

export type Role = 'cliente' | 'agencia';

export interface RoleProfile {
  title: string;
  sub: string;
  email: string;
  portalHref: string;
}

export const ROLE_PROFILES: Record<Role, RoleProfile> = {
  cliente: {
    title: 'Entrar no portal',
    sub: 'Acesse o conteúdo da sua marca e aprove seus posts.',
    email: 'contato@supremapizza.com.br',
    portalHref: '../portal/index.html',
  },
  agencia: {
    title: 'Entrar no painel',
    sub: 'Acesse o cockpit da agência e a fila de aprovações.',
    email: 'dante@fenicelab.com.br',
    portalHref: '../painel/index.html',
  },
};

// Marcas-piloto da Fenice (gastronomia BR) — alimentam o carrossel de prova social.
export interface Testimonial {
  quote: string;
  source: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Conteúdo profissional, organizado e com resultado que dá pra ver.',
    source: '— Cliente Fenice · piloto Suprema Pizza',
  },
  {
    quote: 'A agenda de posts encheu a casa nas terças — antes nosso dia mais fraco.',
    source: '— Arena Hamburgueria · São Paulo',
  },
  {
    quote: 'Cada aprovação leva 30 segundos. O resto a Fenice resolve.',
    source: '— Oca Cozinha Brasileira · Belo Horizonte',
  },
];

export const INITIAL_PASSWORD = 'senha-inicial';

// Requisitos de senha avaliados ao vivo no 1º acesso.
export interface PasswordReq {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_REQS: PasswordReq[] = [
  { id: 'len', label: 'Pelo menos 8 caracteres', test: (v) => v.length >= 8 },
  { id: 'num', label: 'Um número', test: (v) => /[0-9]/.test(v) },
  { id: 'up', label: 'Uma letra maiúscula', test: (v) => /[A-Z]/.test(v) },
];
