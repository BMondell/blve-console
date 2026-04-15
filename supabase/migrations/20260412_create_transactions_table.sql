-- supabase/migrations/20260412_create_transactions_table.sql

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),

  -- raw KARD data
  kard_transaction_id text not null,
  kard_member_id text,
  kard_merchant_id text,
  amount numeric not null,
  currency text default 'USD',

  -- BLVΞ resolution
  card_owner_id uuid references card_owners(id),
  org_id uuid references orgs(id),

  -- routing + attribution
  offer_assigned boolean default false,
  rule_hit text,

  -- split + payout lifecycle
  split_instructed boolean default false,
  split_confirmed boolean default false,
  split_failed boolean default false,
  split_held boolean default false,

  -- timestamps
  created_at timestamptz default now(),
  attributed_at timestamptz,
  split_instructed_at timestamptz,
  split_confirmed_at timestamptz,
  split_failed_at timestamptz,
  split_held_at timestamptz
);

-- optional: basic index for lookups by KARD transaction id
create index if not exists idx_transactions_kard_tx_id
  on transactions (kard_transaction_id);

-- optional: index for recent activity queries
create index if not exists idx_transactions_created_at
  on transactions (created_at desc);
