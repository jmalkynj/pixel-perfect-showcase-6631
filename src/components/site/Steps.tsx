import { Reveal, SectionHeading } from "./Reveal";
import { FileText, PencilLine, Send, MessageCircle } from "lucide-react";

const steps = [
  { icon: FileText, title: "اقرأ التفاصيل", text: "تعرّف على المجالات وطريقة التدريب قبل التسجيل." },
  { icon: PencilLine, title: "عبّئ بياناتك", text: "املأ نموذج التسجيل وأرفق سيرتك الذاتية." },
  { icon: Send, title: "أرسل طلب التسجيل", text: "يصلنا طلبك مباشرة ويُحفظ لدى فريق القبول." },
  { icon: MessageCircle, title: "سنتواصل معك عبر WhatsApp", text: "نراجع بياناتك ونرسل لك التفاصيل النهائية." },
];

export function Steps() {
  return (
    <section id="steps" className="soft-gradient py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="خطوات بسيطة" title="كيف تسجل؟" />
        <div className="relative mt-14">
          <div className="absolute inset-x-0 top-7 hidden h-px bg-border lg:block" />
          <ol className="grid gap-6 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.14}>
                <li className="lift-card relative h-full rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                  <span className="hero-gradient mx-auto flex size-14 items-center justify-center rounded-2xl text-primary-foreground shadow-soft">
                    <s.icon className="size-6" />
                  </span>
                  <span className="gold-gradient mx-auto mt-4 flex size-7 items-center justify-center rounded-full text-xs font-extrabold text-accent-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-base">{s.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
