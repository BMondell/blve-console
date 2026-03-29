/**
 * BLVΞ Routing Table Migration
 * 
 * Creates the routing table to store all transaction routing and attribution data.
 * This table is the core data store for the BLVΞ Routing + Attribution Engine.
 */

-- Create routing table
CREATE TABLE IF NOT EXISTS public.routing (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sub_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,

  -- Transaction data
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  routed_amount DECIMAL(15, 2) NOT NULL CHECK (routed_amount >= 0),

  -- Timestamps
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Indexes for common queries
  CONSTRAINT valid_routed_amount CHECK (routed_amount <= amount)
);

-- Create indexes for common queries
CREATE INDEX idx_routing_member_id ON public.routing(member_id);
CREATE INDEX idx_routing_merchant_id ON public.routing(merchant_id);
CREATE INDEX idx_routing_org_id ON public.routing(org_id);
CREATE INDEX idx_routing_sub_org_id ON public.routing(sub_org_id);
CREATE INDEX idx_routing_timestamp ON public.routing(timestamp);
CREATE INDEX idx_routing_created_at ON public.routing(created_at);

-- Create composite indexes for common queries
CREATE INDEX idx_routing_member_timestamp ON public.routing(member_id, timestamp DESC);
CREATE INDEX idx_routing_org_timestamp ON public.routing(org_id, timestamp DESC);
CREATE INDEX idx_routing_merchant_timestamp ON public.routing(merchant_id, timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.routing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can view routing records for their organization
CREATE POLICY "Users can view org routing records"
  ON public.routing
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.members WHERE id = auth.uid()
    )
  );

-- Policy: Service role can insert routing records
CREATE POLICY "Service role can insert routing records"
  ON public.routing
  FOR INSERT
  WITH CHECK (true);

-- Create view for routing summary by member
CREATE OR REPLACE VIEW public.routing_summary_by_member AS
SELECT
  member_id,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  SUM(routed_amount) as total_routed,
  AVG(routed_amount / amount) * 100 as avg_routing_percentage,
  MIN(timestamp) as first_transaction,
  MAX(timestamp) as last_transaction
FROM public.routing
GROUP BY member_id;

-- Create view for routing summary by organization
CREATE OR REPLACE VIEW public.routing_summary_by_org AS
SELECT
  org_id,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  SUM(routed_amount) as total_routed,
  AVG(routed_amount / amount) * 100 as avg_routing_percentage,
  MIN(timestamp) as first_transaction,
  MAX(timestamp) as last_transaction
FROM public.routing
GROUP BY org_id;

-- Create view for routing summary by merchant
CREATE OR REPLACE VIEW public.routing_summary_by_merchant AS
SELECT
  merchant_id,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  SUM(routed_amount) as total_routed,
  AVG(routed_amount / amount) * 100 as avg_routing_percentage,
  MIN(timestamp) as first_transaction,
  MAX(timestamp) as last_transaction
FROM public.routing
GROUP BY merchant_id;
