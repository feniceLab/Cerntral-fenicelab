// ------------------------------------------------------------
// Mapa de assets do @fenice/shared usados nas telas do Portal.
// O kit de fotos disponivel no shared cobre 4 imagens; os nomes
// dos prototipos (foto-40, foto-50, foto-60, foto-01) sao
// reaproveitados para manter a composicao visual original.
// ------------------------------------------------------------
import foto01 from '@fenice/shared/assets/photos/foto-01.jpg';
import foto40 from '@fenice/shared/assets/photos/foto-40.jpg';
import foto50 from '@fenice/shared/assets/photos/foto-50.jpg';
import foto60 from '@fenice/shared/assets/photos/foto-60.jpg';
import florSvg from '@fenice/shared/assets/fenice-flor.svg';

const PHOTOS: Record<string, string> = {
  '01': foto01,
  '40': foto40,
  '50': foto50,
  '60': foto60,
};

/** Retorna a URL da foto pelo "numero" do prototipo (fallback foto-01). */
export const photo = (n: string): string => PHOTOS[n] ?? foto01;

/** Flor da Fenice (assinatura), usada como ornamento dos heros escuros. */
export const florFenice = florSvg;
