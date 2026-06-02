import { Card, Kicker } from '@fenice/shared';
import { PhoneHeader } from '../components/PhoneHeader';
import { ScreenIcon } from '../lib/ScreenIcon';
import { photo } from '../lib/assets';

const GRID = ['01', '40', '50', '60', '01', '50', '40', '60'];

export function Galeria() {
  return (
    <div>
      <PhoneHeader kicker="Materiais" title="Galeria" />
      <div style={{ padding: 18 }}>
        {/* zona de upload */}
        <div className="fen-pt-drop">
          <div className="fen-pt-drop__ico">
            <ScreenIcon name="upload" size={22} sw={2} color="#fff" />
          </div>
          <div className="fen-pt-drop__title">Enviar fotos &amp; videos</div>
          <div className="fen-pt-drop__sub">
            Arraste aqui ou toque para escolher. A equipe Fenice cuida do resto.
          </div>
        </div>

        {/* upload em progresso */}
        <Card className="fen-pt-upload" pad={12}>
          <img className="fen-pt-upload__thumb" src={photo('60')} alt="" />
          <div style={{ flex: 1 }}>
            <div className="fen-pt-upload__name">IMG_0421.jpg</div>
            <div className="fen-pt-progress">
              <div className="fen-pt-progress__bar" style={{ width: '72%' }} />
            </div>
          </div>
          <span className="fen-pt-upload__pct">72%</span>
        </Card>

        <Kicker>Enviados · 24</Kicker>
        <div className="fen-pt-gallery">
          {GRID.map((n, i) => (
            <img key={i} src={photo(n)} alt="" />
          ))}
        </div>
      </div>
    </div>
  );
}
