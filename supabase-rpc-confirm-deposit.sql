-- ============================================================
-- Supabase RPC: confirm_deposit (atomic wallet credit)
-- Run this in Supabase SQL Editor → Dashboard → SQL
-- ============================================================
--
-- This stored procedure atomically:
--   1. Reads the user's current wallet balance
--   2. Adds the deposit amount
--   3. Updates the wallet balance + timestamp
--   4. Marks the wallet_transaction as 'confirmed'
--
-- Using a SECURITY DEFINER function allows the service-role
-- admin to bypass RLS and perform the credit in one transaction,
-- eliminating the race condition of 2 separate client queries.
-- ============================================================

CREATE OR REPLACE FUNCTION public.confirm_deposit(
  p_transaction_id UUID,
  p_user_id        UUID,
  p_amount         BIGINT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance BIGINT;
  v_new_balance     BIGINT;
  v_already_confirmed TEXT;
BEGIN
  -- 1. Guard: check the transaction exists, belongs to this user, and is still pending
  SELECT status INTO v_already_confirmed
  FROM public.wallet_transactions
  WHERE id = p_transaction_id
    AND user_id = p_user_id
    AND type = 'deposit'
  FOR UPDATE;  -- lock the row to prevent double-processing

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction not found or unauthorized');
  END IF;

  IF v_already_confirmed != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction is already ' || v_already_confirmed);
  END IF;

  -- 2. Read current balance (lock the wallet row)
  SELECT balance INTO v_current_balance
  FROM public.wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found for user');
  END IF;

  v_new_balance := COALESCE(v_current_balance, 0) + p_amount;

  -- 3. Update wallet balance
  UPDATE public.wallets
  SET
    balance    = v_new_balance,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- 4. Mark transaction as confirmed, record balance_after
  UPDATE public.wallet_transactions
  SET
    status        = 'confirmed',
    balance_after = v_new_balance,
    updated_at    = NOW()
  WHERE id = p_transaction_id;

  RETURN jsonb_build_object(
    'success',      true,
    'new_balance',  v_new_balance,
    'transaction_id', p_transaction_id
  );

EXCEPTION WHEN OTHERS THEN
  -- Roll back implicitly; return error detail
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute to authenticated users (admin will call it via service role)
GRANT EXECUTE ON FUNCTION public.confirm_deposit(UUID, UUID, BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_deposit(UUID, UUID, BIGINT) TO service_role;

-- ============================================================
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Paste this entire file and click "Run"
-- 3. The admin/deposits/page.js will call this via:
--    supabase.rpc('confirm_deposit', { p_transaction_id, p_user_id, p_amount })
-- ============================================================
