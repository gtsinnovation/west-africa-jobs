// Shared cookie name constants — kept dependency-free so middleware
// (which runs on the Edge Runtime) can import them without pulling in
// Node-only modules like `crypto`.
export const ADMIN_COOKIE = "waij_admin_session";
export const USER_SESSION_COOKIE = "waij_user_session";
