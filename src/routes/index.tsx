import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Article } from "@/components/site/Article";
import { WhyUs } from "@/components/site/WhyUs";
import { Fields } from "@/components/site/Fields";
import { Steps } from "@/components/site/Steps";
import { RegistrationForm } from "@/components/site/RegistrationForm";
import { Footer } from "@/components/site/Footer";

const title = "منصة التدريب والتطوير | طوّر مهاراتك وابدأ مستقبلك";
const description =
  "منصة للتدريب والتطوير المهني تساعدك على اكتساب المهارات والاستعداد للفرص المهنية والعمل الحر.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Article />
        <WhyUs />
        <Fields />
        <Steps />
        <RegistrationForm />
      </main>
      <Footer />
    </div>
  );
}
