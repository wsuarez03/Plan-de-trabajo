import { ReactNode } from 'react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function StatsModal({ title, onClose, children }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}