import React from 'react';

type Props = {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
};

const Modal: React.FC<Props> = ({ open, title, children, onClose, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl bg-[#1f0c05] border border-golden-orange rounded-sm shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-serif text-lg text-cream">{title}</h3>
          <button onClick={onClose} className="text-cream/60 hover:text-golden-orange">Close</button>
        </div>
        <div className="p-6 text-cream text-sm">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-white/5 bg-black/5">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
