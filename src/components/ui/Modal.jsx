import { useEffect } from 'react';
import { X } from 'lucide-react';

// size: 'md' (default, 480px) or 'lg' (720px) — covers every modal use case
// in this app (confirmation dialogs vs. larger edit forms).
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  // Close on Escape key. useEffect + addEventListener/removeEventListener
  // is the standard React pattern for subscribing to browser events —
  // the returned cleanup function prevents a memory leak / duplicate
  // listeners if this component re-renders while open.
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Clicking the dark overlay closes the modal; clicking inside the
    // panel must NOT close it, hence stopPropagation on the panel itself.
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-panel ${size === 'lg' ? 'modal-panel--lg' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
