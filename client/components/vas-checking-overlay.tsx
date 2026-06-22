import { Loader2 } from "lucide-react";

interface VasCheckingOverlayProps {
  show: boolean;
  message?: string;
}

export default function VasCheckingOverlay({
  show,
  message = "Vérification de l'abonnement...",
}: VasCheckingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-background px-8 py-6 shadow-xl">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-foreground">{message}</p>
      </div>
    </div>
  );
}
