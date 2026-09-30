import { Reveal, SectionHeading } from "./Reveal";
import { BookOpen, Repeat, FolderKanban, Clock, Handshake, ShieldCheck, Quote } from "lucide-react";

const pillars = [
  { icon: BookOpen, title: "تعلّم مهارة مطلوبة", text: "ابدأ بمهارة واحدة يحتاجها السوق فعلًا، وتعمّق فيها قبل الانتقال لغيرها." },
  { icon: Repeat, title: "ممارسة مستمرة", text: "التدريب وحده لا يكفي؛ التطبيق اليومي هو ما يحوّل المعرفة إلى إتقان." },
  { icon: FolderKanban, title: "ابنِ معرض أعمال", text: "نفّذ مشاريع حقيقية ولو تطوعية في البداية، فهي دليلك أمام العملاء." },
  { icon: Clock, title: "الصبر والالتزام", text: "النتائج الأولى قد تتأخر، والاستمرار المنتظم أهم من الحماس المؤقت." },
  { icon: Handshake, title: "تواصل مع العملاء", text: "تعلّم كيف تعرض خدمتك، وتتفق على النطاق والسعر، وتسلّم في الوقت." },
  { icon: ShieldCheck, title: "سمعة تُبنى بالجودة", text: "الالتزام بالمواعيد والوضوح في التعامل يصنعان تقييمات تفتح لك أبوابًا." },
];

export function Article() {
  return (
    <section id="article" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="مقال تحفيزي"
          title="كيف تبدأ طريقك نحو النجاح والعمل الحر من المنزل؟"
          subtitle="نظرة واقعية على العمل عبر الإنترنت: فرصة حقيقية، لكنها تحتاج إلى مهارة وممارسة وصبر."
        />

        <div className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-9 text-muted-foreground">
          <Reveal>
            <p>
              العمل الحر والعمل عبر الإنترنت أصبحا اليوم بابًا واسعًا لكثير من الناس لتطوير دخلهم
              وخبراتهم دون الارتباط بمكان واحد. لكن الصورة التي تُعرض أحيانًا على أنها «ربح سريع»
              بعيدة عن الواقع. الحقيقة أبسط وأصدق: من يتعلم مهارة مطلوبة، ويمارسها باستمرار، ويقدّم
              عملًا جيدًا، تزداد فرصه بشكل ملحوظ.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              ابدأ بتحديد المجال الذي يناسب ميولك وسوق العمل معًا، ثم خصّص وقتًا ثابتًا للتعلّم
              والتطبيق. أنجز مشاريع صغيرة تجمعها في معرض أعمال يوضح مستواك، وتعلّم كيف تتواصل مع
              العملاء بوضوح واحترافية. بعض الأشخاص يحققون بالفعل دخلًا جيدًا من العمل الحر، لكن لا
              يوجد أي ضمان للثراء أو للنجاح السريع، والنتائج تختلف من شخص لآخر حسب الجهد والسوق
              والوقت المتاح.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <article className="lift-card h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <p.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <figure className="hero-gradient mt-12 rounded-3xl p-8 text-center text-primary-foreground shadow-lift sm:p-12">
            <Quote className="mx-auto size-8 opacity-70" />
            <blockquote className="mt-4 text-xl font-extrabold leading-relaxed sm:text-2xl">
              «النجاح لا يبدأ عندما تصبح جاهزًا، بل عندما تقرر أن تبدأ.»
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
