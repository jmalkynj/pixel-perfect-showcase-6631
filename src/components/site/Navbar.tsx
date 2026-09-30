import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#home", label: "الرئيسية" },
  { href: "#why", label: "لماذا نحن؟" },
  { href: "#fields", label: "الدورات" },
  { href: "#steps", label: "خطوات التسجيل" },
  { href: "#register", label: "التسجيل" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 shadow-soft backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="hero-gradient flex size-10 items-center justify-center rounded-xl text-primary-foreground shadow-soft">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-base font-extrabold sm:text-lg">منصة التدريب والتطوير</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden shadow-soft sm:inline-flex">
            <a href="#register">سجّل الآن</a>
          </Button>
          <button
            type="button"
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-card lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Button asChild className="mt-2 w-full">
                  <a href="#register" onClick={() => setOpen(false)}>
                    سجّل الآن
                  </a>
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
