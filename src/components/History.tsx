import { Lock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { IMCHistory } from '../types/imc';
import { formatDate, formatHeight, formatIMC, formatTime, formatWeight } from '../utils/formatting';
import { ConfirmModal } from './ConfirmModal';

interface HistoryProps {
  items: IMCHistory[];
  onClear: () => void;
}

export function History({ items, onClear }: HistoryProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="section" aria-labelledby="history-title">
      <div className="section__head">
        <h2 id="history-title" className="section__title">
          Histórico
        </h2>
        {items.length > 0 ? (
          <button type="button" className="button button--ghost button--small" onClick={() => setConfirming(true)}>
            <Trash2 size={16} aria-hidden="true" />
            Limpar histórico
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="empty">Seus últimos 10 cálculos aparecem aqui depois que você calcular o IMC.</p>
      ) : (
        <ol className="history">
          {items.map((item) => (
            <li key={item.id} className="history__item">
              <div className="history__when">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <span className="history__time">{formatTime(item.date)}</span>
              </div>
              <p className="history__data">
                {formatWeight(item.weight)} <span aria-hidden="true">•</span>
                <span className="sr-only">,</span> {formatHeight(item.height)}
              </p>
              <p className="history__imc">
                <span className="sr-only">IMC </span>
                {formatIMC(item.imc)}
              </p>
              <p className="history__class">{item.classification}</p>
            </li>
          ))}
        </ol>
      )}

      <p className="privacy">
        <Lock size={16} aria-hidden="true" />
        Seus dados são processados localmente neste dispositivo. Nenhuma informação pessoal é
        armazenada em um servidor.
      </p>

      <ConfirmModal
        open={confirming}
        title="Limpar histórico?"
        message="Todos os cálculos salvos serão removidos."
        confirmLabel="Limpar"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          onClear();
          setConfirming(false);
        }}
      />
    </section>
  );
}
