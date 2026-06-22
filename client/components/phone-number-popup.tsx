import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PhoneNumberForm from "@/components/phone-number-form";

interface PhoneNumberPopupProps {
  open: boolean;
  isChecking: boolean;
  onClose: () => void;
  onSubmit: (phoneDigits: string) => void;
  error?: string | null;
}

export default function PhoneNumberPopup({
  open,
  isChecking,
  onClose,
  onSubmit,
  error,
}: PhoneNumberPopupProps) {
  const handleClose = () => {
    if (isChecking) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10 bg-background border-2 border-primary/20 p-8 pt-10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isChecking}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <PhoneNumberForm
              onSubmit={onSubmit}
              isLoading={isChecking}
              error={error}
              submitLabel="Vérifier et accéder"
              title="Entrez votre numéro"
              description="Saisissez votre numéro (+225) pour vérifier votre abonnement"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
