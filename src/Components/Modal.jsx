import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 w-full max-w-lg -mt-[150px] transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
export default Modal;