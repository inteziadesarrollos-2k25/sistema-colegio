import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StaffSearch from "./StaffSearch";
import { Prisma } from "@prisma/client";

interface PageProps {
    searchParams: Promise<{
        q?: string;
        role?: string;
    }>;
}

async function getStaff(query?: string, role?: string) {
    const where: Prisma.StaffWhereInput = {
        isActive: true
    };

    if (query) {
        where.name = {
            contains: query
        };
    }

    if (role) {
        where.role = {
            equals: role
        };
    }

    const staff = await prisma.staff.findMany({
        where,
        orderBy: { name: 'asc' }
    });
    return staff;
}

export default async function StaffPage({ searchParams }: PageProps) {
    const { q, role } = await searchParams;
    const staffMembers = await getStaff(q, role);

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Gestión de Personal</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Docentes, administrativos y obreros</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/dashboard" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        Volver
                    </Link>
                    <Link href="/staff/attendance" className="btn" style={{ backgroundColor: '#7c3aed', color: 'white' }}>
                        📋 Pasar Asistencia
                    </Link>
                    <Link href="/staff/reports" className="btn" style={{ backgroundColor: '#2563eb', color: 'white' }}>
                        📊 Reportes
                    </Link>
                    <Link href="/staff/new" className="btn">
                        Nuevo Personal
                    </Link>
                </div>
            </header>

            <StaffSearch />

            <div className="card">
                {staffMembers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        <p>No se encontró personal con los filtros seleccionados.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Nombre</th>
                                <th style={{ padding: '1rem' }}>Cédula</th>
                                <th style={{ padding: '1rem' }}>Rol</th>
                                <th style={{ padding: '1rem' }}>Cargo</th>
                                <th style={{ padding: '1rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffMembers.map((member) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{member.name}</td>
                                    <td style={{ padding: '1rem' }}>{member.nationalId}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            backgroundColor: member.role === 'DOCENTE' ? '#dbeafe' :
                                                member.role === 'ADMINISTRATIVO' ? '#fce7f3' : '#f3f4f6',
                                            color: member.role === 'DOCENTE' ? '#1e40af' :
                                                member.role === 'ADMINISTRATIVO' ? '#db2777' : '#374151'
                                        }}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{member.position}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <Link href={`/staff/${member.id}`} style={{ marginRight: '1rem', color: 'var(--primary)' }}>
                                            Ver Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
