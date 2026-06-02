import { Sidebar } from './components/Sidebar';
import { Clientes } from './screens/Clientes';
import './styles.css';

/** Painel reduzido: SÓ o menu Clientes (lista os clientes reais via /api/clients).
 *  Clicar num card com portal (Arena/Suprema) abre o portal do cliente embutido.
 *  (CI: deploy por app — validado.) */
export function App() {
  return (
    <div className="fen-pn-stage">
      <div className="fen-pn-frame">
        <Sidebar view="clientes" go={() => {}} />
        <div className="fen-pn-main">
          <Clientes />
        </div>
      </div>
    </div>
  );
}
