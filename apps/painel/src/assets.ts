// Reexporta os assets da marca usados pelo Painel a partir de @fenice/shared.
// Centraliza os imports estaticos (Vite resolve via alias ./assets/*).
import seloTerra from '@fenice/shared/assets/fenice-selo-terra.svg';
import flor from '@fenice/shared/assets/fenice-flor.svg';
import foto01 from '@fenice/shared/assets/photos/foto-01.jpg';
import foto40 from '@fenice/shared/assets/photos/foto-40.jpg';
import foto50 from '@fenice/shared/assets/photos/foto-50.jpg';
import foto60 from '@fenice/shared/assets/photos/foto-60.jpg';

export const SELO_TERRA = seloTerra;
export const FLOR = flor;

// Apenas 4 fotos existem no pacote; mapeamos os "ids" do prototipo para elas.
const PHOTOS: Record<string, string> = {
  '01': foto01,
  '40': foto40,
  '50': foto50,
  '60': foto60,
};

/** Resolve a foto pelo id do prototipo (cai em foto-01 se nao existir). */
export const photo = (id: string): string => PHOTOS[id] ?? foto01;
