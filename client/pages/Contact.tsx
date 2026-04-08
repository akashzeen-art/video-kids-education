import Header from "@/components/header";
import { Plus } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Plus className="w-16 h-16 text-accent/30 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
          <p className="text-foreground/60 mb-8">
            Get in touch with our team
          </p>
          <p className="text-sm text-foreground/40">
            Continue building this page by providing more details about what you'd like to see here
          </p>
        </div>
      </main>
    </div>
  );
}
