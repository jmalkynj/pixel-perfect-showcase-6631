import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import {
  Download,
  Loader2,
  LogOut,
  MessageCircle,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type Registration = Database["public"]["Tables"]["registrations"]["Row"];
type Status = Database["public"]["Enums"]["registration_status"];

const STATUSES: { value: Status; label: string }[] = [
  { value: "new", label: "جديد" },
  { value: "reviewed", label: "تمت المراجعة" },
  { value: "contacted", label: "تم التواصل" },
  { value: "completed", label: "مكتمل" },
  { value: "rejected", label: "مرفوض" },
];

const statusLabel = (s: Status) => STATUSES.find((x) => x.value === s)?.label ?? s;

const statusClass: Record<Status, string> = {
  new: "bg-primary-soft text-primary",
  reviewed: "bg-secondary text-secondary-foreground",
  contacted: "bg-accent/25 text-accent-foreground",
  completed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-destructive/10 text-destructive",
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | منصة التدريب والتطوير" },
      { name: "description", content: "إدارة طلبات التسجيل في منصة التدريب والتطوير." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة الإدارة | منصة التدريب والتطوير" },
      { property: "og:description", content: "إدارة طلبات التسجيل في منصة التدريب والتطوير." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <LoginCard />;
  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) return <NoAccess email={session.user.email ?? ""} />;

  return <Dashboard email={session.user.email ?? ""} />;
}

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setBusy(false);
    if (res.error) {
      setMsg(
        res.error.message.includes("Invalid login")
          ? "بيانات الدخول غير صحيحة."
          : "تعذّر إتمام العملية: " + res.error.message,
      );
      return;
    }
    if (mode === "up" && !res.data.session) {
      setMsg("تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.");
    }
  };

  return (
    <div className="soft-gradient flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift">
        <h1 className="text-center text-2xl">لوحة الإدارة</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          الدخول متاح لفريق العمل المصرّح له فقط.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>
          {msg && <p className="rounded-xl bg-secondary p-3 text-sm font-semibold">{msg}</p>}
          <Button type="submit" disabled={busy} className="h-11 w-full">
            {busy && <Loader2 className="size-4 animate-spin" />}
            {mode === "in" ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setMsg(null);
          }}
          className="mt-4 w-full text-center text-sm font-semibold text-primary hover:underline"
        >
          {mode === "in" ? "ليس لديك حساب؟ إنشاء حساب" : "لديك حساب؟ تسجيل الدخول"}
        </button>
        <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:underline">
          العودة إلى الموقع
        </Link>
      </div>
    </div>
  );
}

function NoAccess({ email }: { email: string }) {
  return (
    <div className="soft-gradient flex min-h-screen items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift">
        <ShieldAlert className="mx-auto size-10 text-destructive" />
        <h1 className="mt-4 text-xl">لا تملك صلاحية الوصول</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          الحساب <span className="font-semibold" dir="ltr">{email}</span> غير مضاف إلى قائمة
          المشرفين. تواصل مع مسؤول المنصة لمنحك الصلاحية.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => supabase.auth.signOut()}>
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}

function Dashboard({ email }: { email: string }) {
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Registration | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const okStatus = filter === "all" || r.status === filter;
      const okQuery =
        !q ||
        [r.full_name, r.whatsapp, r.email, r.specialty, r.course].some((v) =>
          (v ?? "").toLowerCase().includes(q),
        );
      return okStatus && okQuery;
    });
  }, [rows, query, filter]);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
    if (error) return console.error(error);
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((p) => (p && p.id === id ? { ...p, status } : p));
  };

  const downloadCv = async (path: string) => {
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(path, 120);
    if (error || !data) return console.error(error);
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const waLink = (n: string) => `https://wa.me/${n.replace(/[^0-9]/g, "")}`;
  const fmt = (d: string) => new Date(d).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" });

  const counts = useMemo(
    () => ({
      total: rows.length,
      newOnes: rows.filter((r) => r.status === "new").length,
      completed: rows.filter((r) => r.status === "completed").length,
    }),
    [rows],
  );

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg sm:text-xl">لوحة إدارة طلبات التسجيل</h1>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">الموقع</Link>
            </Button>
            <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}>
              <LogOut className="size-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "إجمالي المتقدمين", value: counts.total },
            { label: "طلبات جديدة", value: counts.newOnes },
            { label: "طلبات مكتملة", value: counts.completed },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Users className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-extrabold">{c.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <div className="relative flex-1 min-w-52">
              <Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الرقم أو التخصص..."
                className="h-11 pe-10"
              />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as Status | "all")}>
              <SelectTrigger className="h-11 w-44">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">لا توجد طلبات مطابقة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl text-right text-sm">
                <thead className="bg-secondary/60 text-xs text-muted-foreground">
                  <tr>
                    {["الاسم", "WhatsApp", "التخصص", "الدورة المطلوبة", "تاريخ التسجيل", "الحالة", ""].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 font-bold">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-border transition-colors hover:bg-secondary/40">
                      <td className="px-4 py-3 font-semibold">{r.full_name}</td>
                      <td className="px-4 py-3" dir="ltr">
                        {r.whatsapp}
                      </td>
                      <td className="px-4 py-3">{r.specialty}</td>
                      <td className="px-4 py-3">{r.course}</td>
                      <td className="px-4 py-3 text-muted-foreground">{fmt(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[r.status]}`}>
                          {statusLabel(r.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
                          عرض
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">{selected?.full_name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ["رقم WhatsApp", selected.whatsapp],
                  ["البريد الإلكتروني", selected.email],
                  ["التخصص المهني", selected.specialty],
                  ["المؤهل العلمي", selected.qualification],
                  ["سنوات الخبرة", selected.experience],
                  ["الدورة المطلوبة", selected.course],
                  ["تاريخ التسجيل", fmt(selected.created_at)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-secondary/50 p-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 font-semibold break-words">{v}</dd>
                  </div>
                ))}
              </dl>

              {selected.message && (
                <div className="rounded-xl bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">الرسالة</p>
                  <p className="mt-1 leading-7">{selected.message}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>حالة الطلب</Label>
                <Select
                  value={selected.status}
                  onValueChange={(v) => updateStatus(selected.id, v as Status)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild className="flex-1">
                  <a href={waLink(selected.whatsapp)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" />
                    محادثة WhatsApp
                  </a>
                </Button>
                {selected.cv_path ? (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => downloadCv(selected.cv_path!)}
                  >
                    <Download className="size-4" />
                    تحميل السيرة الذاتية
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1" disabled>
                    لا توجد سيرة ذاتية
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
