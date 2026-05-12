-- Hardening indexes for webhook idempotency and billing safety.

PRAGMA foreign_keys = ON;

CREATE UNIQUE INDEX IF NOT EXISTS uq_webhook_events_provider_external
  ON webhook_events(provider, external_event_id)
  WHERE external_event_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_credits_history_add_order
  ON credits_history(user_id, creem_order_id, type)
  WHERE creem_order_id IS NOT NULL AND type = 'add';

CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_creem_customer_id
  ON customers(creem_customer_id)
  WHERE creem_customer_id IS NOT NULL;
