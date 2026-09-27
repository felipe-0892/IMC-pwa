import { Info } from 'lucide-react';

export function MedicalNotice() {
  return (
    <aside className="notice notice--info" aria-label="Aviso importante">
      <Info size={20} aria-hidden="true" />
      <p>
        <strong>Importante:</strong> as informações apresentadas têm finalidade educativa e não
        substituem avaliação médica ou nutricional. O IMC é apenas um indicador geral e pode não
        representar adequadamente a composição corporal de todas as pessoas.
      </p>
    </aside>
  );
}
