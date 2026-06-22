import { Link } from "react-router-dom";
import { BookOpen, Menu, X, Sparkles, Gamepad2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const GAMES = [
  { label: "🃏 Mémoire", path: "/memory-game" },
  { label: "✏️ Quiz Français", path: "/quiz" },
  { label: "🔀 Mots Mêlés", path: "/word-scramble" },
  { label: "💬 Épelle-le !", path: "/spell-it" },
];

const navLinks = [
  { label: "Accueil",   path: "/" },
  { label: "Vidéos", path: "/browse" },
  { label: "Mon Compte", path: "/account" },
  { label: "À propos",  path: "/about" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [mobileGamesOpen, setMobileGamesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-card rounded-b-xl border-x-0 border-t-0 border-b-2 border-primary/20">
      {/* French flag stripe */}
      <div className="h-1 french-stripe w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 font-black text-2xl hover:scale-105 transition-transform"
          >
            <img 
              src="/logo/kidzbuzz.png" 
              alt="Univers des Enfants" 
              className="h-16 w-auto object-contain transform hover:rotate-3 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-bold text-foreground hover:text-primary transition-all relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}

            {/* Games Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGamesOpen(true)}
              onMouseLeave={() => setGamesOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-primary transition-all relative group py-2">
                <Gamepad2 className="w-4 h-4" />
                Jeux
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${gamesOpen ? "rotate-180" : ""}`} />
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300 rounded-full" />
              </button>

              {gamesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48">
                  <div className="bg-background border-2 border-primary/20 rounded-2xl shadow-xl overflow-hidden">
                    {GAMES.map((game) => (
                      <Link
                        key={game.path}
                        to={game.path}
                        className="block px-4 py-3 text-sm font-bold text-foreground hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        {game.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CTA & Theme Button */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/browse" className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Commencer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary/10 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 text-primary" />
            ) : (
              <Menu className="w-7 h-7 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-3 text-sm font-bold text-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Games accordion */}
            <button
              onClick={() => setMobileGamesOpen(!mobileGamesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
            >
              <span className="flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> Jeux</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileGamesOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileGamesOpen && (
              <div className="pl-4 space-y-1">
                {GAMES.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    className="block px-4 py-2.5 text-sm font-bold text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {game.label}
                  </Link>
                ))}
              </div>
            )}

            <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="w-full mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Commencer
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
