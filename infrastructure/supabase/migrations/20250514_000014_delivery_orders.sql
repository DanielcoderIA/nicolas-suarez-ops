-- ==============================================================================
-- Migration: 20250514_000014_delivery_orders
-- Description: Creates the delivery_orders table for tracking WhatsApp delivery carts.
-- ==============================================================================

-- Create the short_id generation function if it doesn't exist
CREATE OR REPLACE FUNCTION generate_short_id(size INT) RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  bytes BYTEA := gen_random_bytes(size);
  l INT := length(characters);
  i INT := 0;
  output TEXT := '';
BEGIN
  WHILE i < size LOOP
    output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Create the delivery_orders table
CREATE TABLE IF NOT EXISTS public.delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_id TEXT NOT NULL DEFAULT generate_short_id(6),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_address TEXT NOT NULL,
    client_neighborhood TEXT,
    payment_method TEXT NOT NULL,
    items_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending_whatsapp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying by short_id and restaurant
CREATE INDEX IF NOT EXISTS idx_delivery_orders_short_id ON public.delivery_orders(short_id);
CREATE INDEX IF NOT EXISTS idx_delivery_orders_restaurant ON public.delivery_orders(restaurant_id);

-- Add update trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.delivery_orders
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- RLS Policies
ALTER TABLE public.delivery_orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT new orders (from the website)
CREATE POLICY "Public users can insert delivery orders" 
ON public.delivery_orders FOR INSERT 
TO public
WITH CHECK (true);

-- Allow authenticated admin users to read their restaurant's orders
CREATE POLICY "Admins can view their restaurant orders" 
ON public.delivery_orders FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.restaurant_id = delivery_orders.restaurant_id
  )
);
