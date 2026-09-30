import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, CloudUpload, FileText, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Reveal, SectionHeading } from "./Reveal";

type Fields = {
  full_name: string;
  whatsapp: string;
  email: string;
  specialty: string;
  qualification: string;
  experience: string;
  course: string;
  message: string;
};

const empty: Fields = {
  full_name: "",
  whatsapp: "",
  email: "",
  specialty: "",
  qualification: "",
  experience: "",
  course: "",
  message: "",
};

const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024;

function validate(v: Fields, file: File | null) {
  const e: Partial<Record<keyof Fields | "cv", string>> = {};
  if (v.full_name.trim().length < 3) e.full_name = "يرجى كتابة الاسم الكامل (3 أحرف على الأقل).";
  if (!/^[+]?[0-9\s-]{8,16}$/.test(v.whatsapp.trim()))
    e.whatsapp = "رقم WhatsApp غير صحيح، أدخل رقمًا من 8 إلى 16 خانة مع رمز الدولة.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "البريد الإلكتروني غير صحيح.";
  if (!v.specialty.trim()) e.specialty = "يرجى كتابة التخصص المهني.";
  if (!v.qualification.trim()) e.qualification = "يرجى كتابة المؤهل العلمي.";
  if (!v.experience.trim()) e.experience = "يرجى كتابة سنوات الخبرة.";
  if (!v.course.trim()) e.course = "يرجى كتابة اسم الدورة أو المجال المطلوب.";
  if (file) {
    if (!ALLOWED.includes(file.type)) e.cv = "نوع الملف غير مسموح. الملفات المقبولة: PDF أو DOC أو DOCX.";
    else if (file.size > MAX_SIZE) e.cv = "حجم الملف يتجاوز 5 ميجابايت.";
  }
  return e;
}

export function RegistrationForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<{
    [K in keyof Fields | "cv" | "form"]?: string | undefined;
  }>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof Fields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((p) => ({ ...p, [k]: ev.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const pickFile = (f: File | null) => {
    setErrors((p) => ({ ...p, cv: undefined }));
    if (!f) return setFile(null);
    if (!ALLOWED.includes(f.type)) {
      setErrors((p) => ({ ...p, cv: "نوع الملف غير مسموح. الملفات المقبولة: PDF أو DOC أو DOCX." }));
      return;
    }
    if (f.size > MAX_SIZE) {
      setErrors((p) => ({ ...p, cv: "حجم الملف يتجاوز 5 ميجابايت." }));
      return;
    }
    setFile(f);
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(values, file);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      let cvPath: string | null = null;
      if (file) {
        setStatus("uploading");
        const ext = file.name.split(".").pop() ?? "pdf";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("cvs").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) throw upErr;
        cvPath = path;
      }
      setStatus("saving");
      const { error } = await supabase.from("registrations").insert({
        full_name: values.full_name.trim(),
        whatsapp: values.whatsapp.trim(),
        email: values.email.trim(),
        specialty: values.specialty.trim(),
        qualification: values.qualification.trim(),
        experience: values.experience.trim(),
        course: values.course.trim(),
        message: values.message.trim() || null,
        cv_path: cvPath,
      });
      if (error) throw error;
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setErrors((p) => ({ ...p, form: "تعذّر إرسال الطلب حاليًا، يرجى المحاولة مرة أخرى." }));
    }
  };

  const reset = () => {
    setValues(empty);
    setFile(null);
    setErrors({});
    setStatus("idle");
  };

  const busy = status === "uploading" || status === "saving";

  const field = (
    k: keyof Fields,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div className="space-y-2">
      <Label htmlFor={k}>{label}</Label>
      <Input
        id={k}
        value={values[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        className="h-11 bg-background"
        {...props}
      />
      {errors[k] && <p className="text-xs font-semibold text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <section id="register" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="التسجيل"
          title="سجّل اهتمامك الآن"
          subtitle="أرسل بياناتك وسنتواصل معك عبر WhatsApp لمزيد من التفاصيل."
        />

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-10">
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="py-10 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-soft text-primary"
                  >
                    <CheckCircle2 className="size-10" />
                  </motion.span>
                  <h3 className="mt-6 text-xl sm:text-2xl">تم إرسال طلب التسجيل بنجاح 🎉</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                    شكرًا لاهتمامك. سنراجع بياناتك ونتواصل معك عبر WhatsApp عند الحاجة.
                  </p>
                  <Button onClick={reset} className="mt-7 h-11 px-7">
                    إرسال طلب جديد
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-5 sm:grid-cols-2"
                  noValidate
                >
                  {field("full_name", "الاسم الكامل", { placeholder: "مثال: أحمد محمد" })}
                  {field("whatsapp", "رقم WhatsApp", { placeholder: "+9677xxxxxxx", inputMode: "tel", dir: "ltr" })}
                  {field("email", "البريد الإلكتروني", { placeholder: "name@example.com", type: "email", dir: "ltr" })}
                  {field("specialty", "التخصص المهني", { placeholder: "مثال: تسويق رقمي" })}
                  {field("qualification", "المؤهل العلمي", { placeholder: "مثال: بكالوريوس إدارة أعمال" })}
                  {field("experience", "سنوات الخبرة", { placeholder: "مثال: سنتان" })}
                  <div className="sm:col-span-2">
                    {field("course", "اسم الدورة أو المجال التدريبي المطلوب", {
                      placeholder: "اكتب الدورة التي ترغب بها بحرية",
                    })}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>السيرة الذاتية (PDF أو DOC أو DOCX - حتى 5 ميجابايت)</Label>
                    {file ? (
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <FileText className="size-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {status === "uploading"
                                ? "جارٍ رفع الملف..."
                                : `${(file.size / 1024 / 1024).toFixed(2)} ميجابايت - جاهز للرفع`}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            if (inputRef.current) inputRef.current.value = "";
                          }}
                          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-destructive transition-colors hover:bg-destructive/10"
                          aria-label="حذف الملف"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          pickFile(e.dataTransfer.files?.[0] ?? null);
                        }}
                        onClick={() => inputRef.current?.click()}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                          dragging ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/50"
                        }`}
                      >
                        <CloudUpload className="size-7 text-primary" />
                        <p className="mt-3 text-sm font-semibold">اسحب الملف هنا أو اضغط للاختيار</p>
                        <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                      </div>
                    )}
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                    />
                    {errors.cv && <p className="text-xs font-semibold text-destructive">{errors.cv}</p>}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="message">نبذة مختصرة أو رسالة</Label>
                    <Textarea
                      id="message"
                      value={values.message}
                      onChange={set("message")}
                      rows={4}
                      className="bg-background"
                      placeholder="اكتب نبذة عن خبرتك وهدفك من التدريب"
                    />
                  </div>

                  {errors.form && (
                    <p className="sm:col-span-2 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                      {errors.form}
                    </p>
                  )}

                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={busy} className="h-12 w-full text-base active:scale-[0.99]">
                      {busy && <Loader2 className="size-4 animate-spin" />}
                      {status === "uploading"
                        ? "جارٍ رفع السيرة الذاتية..."
                        : status === "saving"
                          ? "جارٍ إرسال الطلب..."
                          : "إرسال طلب التسجيل"}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
