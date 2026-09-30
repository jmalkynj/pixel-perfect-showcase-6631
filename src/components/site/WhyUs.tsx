import { Reveal, SectionHeading } from "./Reveal";
import { Rocket, Wrench, Compass, Users } from "lucide-react";

const items = [
  { icon: Rocket, title: "تطوير المهارات", text: "اكتسب مهارات عملية تساعدك على تطوير مستقبلك المهني." },
  { icon: Wrench, title: "تعلم عملي", text: "محتوى تدريبي يركز على المعرفة القابلة للتطبيق." },
  { icon: Compass, title: "فرص جديدة", text: "طوّر قدراتك لتكون أكثر استعدادًا للفرص المهنية." },
  { icon: Users, title: "مجتمع متطور", text: "كن جزءًا من مجتمع يهتم بالتعلم والتطوير المستمر." },
];

export function WhyUs() {
  return (
    <section id="why" className="soft-gradient py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="مزايا المنصة" title="لماذا تختار منصة التدريب والتطوير؟" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div className="lift-card group h-full rounded-2xl border border-border bg-card p-7 text-center shadow-soft">
                <span className="hero-gradient mx-auto flex size-14 items-center justify-center rounded-2xl text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                  <it.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg">{it.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
