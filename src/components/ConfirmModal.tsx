import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modal acessível baseado em <dialog>: foco preso, Esc fecha, fundo inerte. */
export function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel(); // clique no fundo
      }}
    >
      <div className="modal__body">
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>
        <p id="modal-desc">{message}</p>
        <div className="modal__actions">
          <button type="button" className="button button--ghost" onClick={onCancel} autoFocus>
            Cancelar
          </button>
          <button type="button" className="button button--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
