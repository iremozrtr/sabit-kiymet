import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.scss";

interface ModalProps {
  baslik: string;
  onClose: () => void;
  genislik?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Modal({ baslik, onClose, genislik = "md", children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onceki = document.activeElement as HTMLElement | null;
    overlayRef.current?.focus();
    return () => onceki?.focus?.();
  }, []);

  return createPortal(
    <div
      ref={overlayRef}
      className="modal-overlay"
      tabIndex={-1}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div className={`modal modal--${genislik}`} role="dialog" aria-modal="true" aria-label={baslik}>
        <header className="modal__head">
          <h2>{baslik}</h2>
          <button className="modal__x" onClick={onClose} aria-label="Kapat">
            × 
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
