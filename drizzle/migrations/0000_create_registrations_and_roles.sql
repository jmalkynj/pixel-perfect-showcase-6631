CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.registration_status AS ENUM ('new','reviewed','contacted','completed','rejected');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  specialty text NOT NULL,
  qualification text NOT NULL,
  experience text NOT NULL,
  course text NOT NULL,
  message text,
  cv_path text,
  status public.registration_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.registrations TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit" ON public.registrations
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admins read" ON public.registrations
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update" ON public.registrations
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete" ON public.registrations
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX registrations_created_at_idx ON public.registrations (created_at DESC);