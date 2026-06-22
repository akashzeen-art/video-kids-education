import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const COUNTRY_CODE = "+225";

interface PhoneNumberFormProps {
  onSubmit: (phoneDigits: string) => void;
  isLoading?: boolean;
  submitLabel?: string;
  title?: string;
  description?: string;
  error?: string | null;
}

export default function PhoneNumberForm({
  onSubmit,
  isLoading = false,
  submitLabel = "Continuer",
  title = "Entrez votre numéro",
  description = "Saisissez votre numéro pour continuer",
  error,
}: PhoneNumberFormProps) {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return;
    onSubmit(digits);
  };

  return (
    <div>
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Phone className="w-8 h-8 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-black text-center text-foreground mb-2">{title}</h2>
      <p className="text-center text-foreground/60 text-sm mb-6 font-medium">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-sm font-medium text-destructive text-center bg-destructive/10 rounded-xl py-2 px-3">
            {error}
          </p>
        )}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-primary/20 bg-muted font-bold text-foreground shrink-0">
            <span className="text-lg">{COUNTRY_CODE}</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="07 XX XX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
            disabled={isLoading}
            autoFocus
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-primary/20 bg-white dark:bg-muted text-foreground font-bold text-lg focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || phone.replace(/\D/g, "").length < 10}
          className="w-full rounded-full font-bold py-6 text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Chargement...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </div>
  );
}
