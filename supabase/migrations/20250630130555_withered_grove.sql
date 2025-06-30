/*
  # Disable Email Confirmation Requirement

  This migration disables the email confirmation requirement for new user registrations.
  This addresses the "email_not_confirmed" error that occurs when users try to sign in
  without confirming their email first.
*/

-- Update auth.users to set email_confirmed_at for existing users
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;

-- Modify auth settings to disable email confirmation requirement
UPDATE auth.config
SET email_confirmation_required = false
WHERE email_confirmation_required = true;

-- Create a trigger to automatically confirm emails for new users
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS trigger AS $$
BEGIN
  -- Set email_confirmed_at to current timestamp if it's null
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically confirm emails for new users
DROP TRIGGER IF EXISTS on_auth_user_created_confirm_email ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm_email
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_email();