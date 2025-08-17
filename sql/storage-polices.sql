-- Allow authenticated users to read files from uploads bucket
CREATE POLICY "Authenticated users can read from uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'uploads'::text
);

-- Allow authenticated users to insert files into uploads bucket
CREATE POLICY "Authenticated users can insert into uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads'::text
);
