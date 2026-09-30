import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

const links = [
  { href: "#home", label: "الرئيسية" },
  { href: "#register", label: "التسجيل" },
  { href: "#fields", label: "الدورات" },
  { href: "#register", label: "التواصل" },
];

export function Footer() {
  return (
    <footer className="hero-gradient text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
              <GraduationCap className="size-5" />
            </span>
            <span className="text-lg font-extrabold">منصة التدريب والتطوير</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 opacity-85">
            نساعدك على تطوير مهاراتك والاستعداد لفرص المستقبل.
          </p>
        </div>

        <div>
          <h3 className="text-base">روابط سريعة</h3>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-opacity hover:opacity-70">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base">للإدارة</h3>
          <p className="mt-4 text-sm leading-7 opacity-85">
            لوحة إدارة الطلبات متاحة لفريق العمل فقط.
          </p>
          <Link
            to="/admin"
            className="mt-3 inline-block rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/25"
          >
            لوحة الإدارة
          </Link>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs opacity-80">
        © 2026 منصة التدريب والتطوير - جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
