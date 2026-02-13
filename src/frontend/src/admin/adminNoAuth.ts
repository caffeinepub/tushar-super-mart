/**
 * Temporary no-auth mode configuration for admin portal.
 * When enabled, bypasses all authentication and admin status checks.
 * 
 * This is a temporary measure and should be removed once proper
 * authentication is configured.
 */

// Enable no-auth mode by default (as requested)
// Set to false to restore normal authentication behavior
export const ADMIN_NO_AUTH_MODE = true;

export function isAdminNoAuthEnabled(): boolean {
  return ADMIN_NO_AUTH_MODE;
}
