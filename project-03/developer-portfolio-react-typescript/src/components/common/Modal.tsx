import React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * Generic modal/dialog component.
 * - Renders children inside a centered dialog.
 * - Handles ESC key to close, focus trap is simplified for brevity.
 * - Supports reduced motion preference.
 */
export interface ModalProps {
  /** Content of the modal */
  children: ReactNode;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Optional aria label for the dialog */
  ariaLabel?: string;
  /** Optional additional class names */
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  ariaLabel = 'Dialog',
  className = '',
}) => {
  const reduced = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
      onClick={e => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <motion.div
        className={cn('bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full mx-4', className)}
        initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
        animate={reduced ? {} : { opacity: 1, scale: 1 }}
        exit={reduced ? {} : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
