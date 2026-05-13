export default function Profile() {
  let username = "";
  const raw = localStorage.getItem("user");
  if (raw) {
    try {
      const u = JSON.parse(raw) as { username?: string };
      username = u.username ?? "";
    } catch {
      username = "";
    }
  }

  return (
    <div className="px-4 py-8 text-voltra-text">
      <h1 className="text-voltra-accent text-2xl font-bold mb-4">Perfil</h1>
      <p className="text-voltra-muted text-sm">{username ? `Hola, ${username}` : "Sesión local"}.</p>
    </div>
  );
}
