import Link from "next/link";

export default function Home() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem' }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sistema de Administración Escolar</h1>
        <p style={{ color: 'var(--text-muted)' }}>Bienvenido a la plataforma de gestión académica.</p>
      </header>

      <main className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2>Acceso al Sistema</h2>
        <p style={{ margin: '1rem 0' }}>Por favor, inicie sesión para continuar.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/login" className="btn">
            Iniciar Sesión
          </Link>
        </div>
      </main>

      <footer style={{ marginTop: 'auto', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} Sistema Escolar
      </footer>
    </div>
  );
}
