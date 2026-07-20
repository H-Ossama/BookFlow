
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Dialog/modal component */
export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {children}
        <button onClick={onClose} className="mt-4 w-full bg-gray-100 py-2 rounded">Close</button>
      </div>
    </div>
  );
}
export default Modal;
