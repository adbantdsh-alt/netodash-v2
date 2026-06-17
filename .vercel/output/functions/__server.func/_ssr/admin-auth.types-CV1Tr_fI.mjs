function ensureRole(role, allowed) {
  if (!allowed.includes(role)) {
    throw new Response("Forbidden: insufficient role", { status: 403 });
  }
}
export {
  ensureRole as e
};
