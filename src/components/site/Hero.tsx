import { motion } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero.png";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      <div className="soft-gradient absolute inset-0 -z-20" />
      <motion.div
        aria-hidden
        className="absolute -top-24 -start-24 -z-10 size-80 rounded-full bg-primary/15 blur-3xl"
        animate={{ y: [0, 24, 0], x: [0, 14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -end-16 -z-10 size-96 rounded-full bg-accent/20 blur-3xl"
        animate={{ y: [0, -28, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 text-xs font-bold text-primary shadow-soft">
            <Sparkles className="size-4" />
            تدريب مهني حديث يواكب سوق العمل
          </span>
          <h1 className="mt-6 text-3xl leading-[1.25] sm:text-5xl sm:leading-[1.2]">
            طوّر مهاراتك... وابدأ طريقك نحو{" "}
            <span className="text-gradient">فرص أفضل</span>
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
            نساعدك على اكتساب المهارات العملية التي تحتاجها لتطوير مسارك المهني والاستفادة من فرص
            العمل والتدريب الحديثة.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" className="h-12 px-8 text-base shadow-lift active:scale-[0.97]">
              <a href="#register">
                سجّل الآن
                <ArrowLeft className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-primary/30 bg-card px-8 text-base text-primary hover:bg-primary-soft active:scale-[0.97]"
            >
              <a href="#article">اكتشف المزيد</a>
            </Button>
          </div>

          <dl className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 lg:mx-0">
            {[
              { k: "٨+", v: "مجالات تدريب" },
              { k: "١٠٠٪", v: "محتوى عملي" },
              { k: "٢٤س", v: "متابعة الطلبات" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-border bg-card/70 p-4 text-center">
                <dt className="text-xl font-extrabold text-primary">{s.k}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.img
            src={heroImage}
            alt="التدريب والتطوير المهني"
            width={1200}
            height={1008}
            className="mx-auto w-full max-w-lg drop-shadow-2xl"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
