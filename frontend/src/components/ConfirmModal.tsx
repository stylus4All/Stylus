import React from 'react';
import Modal from './Modal';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmModal: React.FC<Props> = ({ open, title = 'Confirm', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, onConfirm, onCancel }) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 rounded text-cream/60 hover:text-golden-orange">{cancelLabel}</button>
          <button onClick={onConfirm} className={`px-3 py-1 rounded ${danger ? 'bg-red-600 text-white' : 'bg-golden-orange text-espresso'}`}>{confirmLabel}</button>
        </div>
      }
    >
      <div className="text-cream/80">{message}</div>
    </Modal>
  );
};

export default ConfirmModal;
