import { Modal } from "./Modal";

interface ConfirmModalProps {
  baslik: string;
  mesaj: React.ReactNode;
  onayEtiketi?: string;
  onOnay: () => void;
  onVazgec: () => void;
}

export function ConfirmModal({ baslik, mesaj, onayEtiketi = "Evet", onOnay, onVazgec }: ConfirmModalProps) {
  return (
    <Modal baslik={baslik} genislik="sm" onClose={onVazgec}>
      <p style={{ marginTop: 0 }}>{mesaj}</p>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onVazgec}>
          Vazgeç
        </button>
        <button type="button" className="btn btn--danger-solid" onClick={onOnay}>
          {onayEtiketi}
        </button>
      </div>
    </Modal>
  );
}
