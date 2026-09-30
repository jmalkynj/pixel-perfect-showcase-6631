import { Reveal, SectionHeading } from "./Reveal";
import {
  Briefcase,
  Megaphone,
  PenTool,
  Code2,
  BrainCircuit,
  ShoppingCart,
  Video,
  BadgeCheck,
} from "lucide-react";

const fields = [
  { icon: Briefcase, title: "العمل الحر", text: "أساسيات بناء ملفك الشخصي والتعامل مع العملاء." },
  { icon: Megaphone, title: "التسويق الرقمي", text: "إعلانات، محتوى، وتحليل نتائج الحملات." },
  { icon: PenTool, title: "التصميم", text: "الهوية البصرية وتصميم الواجهات والمحتوى." },
  { icon: Code2, title: "البرمجة", text: "بناء المواقع والتطبيقات بأدوات حديثة." },
  { icon: BrainCircuit, title: "الذكاء الاصطناعي", text: "توظيف أدوات الذكاء الاصطناعي في عملك." },
  { icon: ShoppingCart, title: "التجارة الإلكترونية", text: "إدارة المتاجر والمنتجات والمبيعات." },
  { icon: Video, title: "صناعة المحتوى", text: "الكتابة والتصوير والمونتاج والنشر." },
  { icon: BadgeCheck, title: "المهارات المهنية", text: "التواصل وإدارة الوقت والعمل ضمن فريق." },
];

export function Fields() {
  return (
    <section id="fields" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="مجالات التدريب"
          title="اختر المجال الذي يناسب طموحك"
          subtitle="هذه أمثلة على المجالات المتاحة، ويمكنك كتابة أي دورة أو مجال تريده داخل نموذج التسجيل."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.07}>
              <div className="lift-card group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="absolute -top-10 -end-10 size-24 rounded-full bg-primary-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="relative mt-4 text-base">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-7 text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
