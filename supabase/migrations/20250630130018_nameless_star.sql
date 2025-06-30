/*
  # Disable email confirmation requirement

  This migration disables the email confirmation requirement for new users,
  allowing them to sign in immediately after registration without confirming
  their email address.
*/

-- Update auth.users to not require email confirmation
UPDATE auth.config
SET value = 'false'
WHERE parameter = 'ENABLE_EMAIL_SIGNUP_AUTO_CONFIRM';

-- Set email confirmation to not be required
ALTER TABLE auth.users
ALTER COLUMN email_confirmed_at
SET DEFAULT now();

-- Update existing users to have confirmed emails
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;