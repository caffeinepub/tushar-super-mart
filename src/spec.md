# Specification

## Summary
**Goal:** Temporarily disable admin authentication and admin permission checks so the admin portal and its operations can be accessed without Internet Identity login.

**Planned changes:**
- Remove/disable the frontend admin-route authentication gate so `/admin` and all `/admin/*` routes are accessible without an identity and without redirecting to `/admin/login`.
- Update `/admin/login` to show a simple message that admin authentication is temporarily disabled and provide a link/button to enter `/admin`.
- Disable backend admin-only permission enforcement for existing admin endpoints so admin UI operations work for anonymous callers while this temporary mode is enabled.

**User-visible outcome:** Users can open `/admin` (and admin subpages) in a fresh session without logging in, and the admin portal features function without admin authentication during this temporary mode.
