import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link"; // Use Link component for client-side navigation

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Unidad Educativa Romualdo Delfín Gómez</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Hola, <strong>{session.user?.name}</strong> ({session.user?.role})</span>
                    <a href="/api/auth/signout" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        Cerrar Sesión
                    </a>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3>Gestión de Estudiantes</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
                        Administrar inscripciones, asistencia y calificaciones.
                    </p>
                    <Link href="/students" className="btn">Ir a Estudiantes</Link>
                </div>

                <div className="card">
                    <h3>Gestión de Personal</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
                        Administrar docentes y personal administrativo.
                    </p>
                    <Link href="/staff" className="btn">Ir a Personal</Link>
                </div>

                <div className="card">
                    <h3>Reportes</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
                        Generar reportes de asistencia y rendimiento.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link href="/students/reports" className="btn" style={{ fontSize: '0.8rem' }}>Estudiantes</Link>
                        <Link href="/staff/reports" className="btn" style={{ fontSize: '0.8rem' }}>Personal</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
