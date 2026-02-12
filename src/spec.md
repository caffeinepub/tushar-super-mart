# Specification

## Summary
**Goal:** Restore reliable production access to the `/admin` portal and make the app fully end-to-end functional (no “dummy” flows), with automated frontend+backend tests gating builds/releases.

**Planned changes:**
- Diagnose and fix routing/auth issues so `/admin` reliably shows Admin Login when logged out, Admin Dashboard when authenticated/authorized, and a clear Access Denied experience for non-admins (including hard refresh on `/admin/*` in production).
- Persist the `caffeineAdminToken` after the first URL-based initialization (store in browser storage) and reuse it across reloads; show a clear UI state when the token is missing or invalid.
- Ensure commerce flows are fully functional and persistent on-chain: admin product/offer CRUD, customer browse/cart/checkout/order creation, admin order viewing and status updates, and persistence across refetch/reload; remove reliance on any backend methods that intentionally trap (e.g., current trapping `init()` behavior).
- Add automated Motoko canister tests for critical authorization and business logic (admin-only enforcement, order validation, permissions, product/offer CRUD).
- Add automated frontend tests (mocking the actor layer) covering admin access flows and a basic customer shop→cart→checkout happy path.
- Wire all tests into the build/release pipeline so builds fail and releases are blocked when any test fails; provide a single command to run all tests.

**User-visible outcome:** Users can consistently reach and use the admin portal in production (with correct login/authorization behavior), complete a real end-to-end shopping and order flow with persistent data, and the project’s build/release process prevents deployments when automated tests fail.
