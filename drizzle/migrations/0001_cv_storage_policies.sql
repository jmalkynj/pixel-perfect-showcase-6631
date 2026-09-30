CREATE POLICY "anyone can upload cv" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "admins read cv" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'cvs' AND public.has_role(auth.uid(), 'admin'));