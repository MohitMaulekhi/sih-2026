-- The previous "Users update relevant bookings" policy only let a professional
-- update a booking they were ALREADY assigned to (auth.uid() = professional_id).
-- But accepting a fresh request is exactly the update that assigns them —
-- professional_id is still NULL on the row at that point, so every accept was
-- silently rejected by RLS (0 rows updated, no error surfaced to the app).
--
-- USING now also allows any authenticated professional to claim an unassigned
-- pending booking. WITH CHECK ensures the resulting row still belongs to the
-- customer or the (now-assigned) professional, so a professional can't hijack
-- someone else's booking or reassign it to a third party.

DROP POLICY IF EXISTS "Users update relevant bookings" ON public.bookings;

CREATE POLICY "Users update relevant bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = customer_id
    OR auth.uid() = professional_id
    OR (
      professional_id IS NULL
      AND status = 'pending'
      AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'professional'
      )
    )
  )
  WITH CHECK (
    auth.uid() = customer_id OR auth.uid() = professional_id
  );
