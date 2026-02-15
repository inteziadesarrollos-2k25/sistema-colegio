import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StudentSearch from "./StudentSearch";
import { Prisma } from "@prisma/client";

interface PageProps {
    searchParams: Promise<{
        q?: string;
        grade?: string;
    }>;
}

async function getStudents(query?: string, grade?: string) {
    const where: Prisma.StudentWhereInput = {};

    if (query) {
        where.name = {
            contains: query
        };
    }

    if (grade) {
        where.grade = {
            equals: grade
        };
    }

    const students = await prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });
    return students;
}

export default async function StudentsPage({ searchParams }: PageProps) {
    const { q, grade } = await searchParams;
    const students = await getStudents(q, grade);

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Gestión de Estudiantes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Listado general de alumnos inscritos</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/dashboard" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        Volver
                    </Link>
                    <Link href="/students/attendance" className="btn" style={{ backgroundColor: '#7c3aed', color: 'white' }}>
                        📋 Pasar Asistencia
                    </Link>
                    <Link href="/students/reports" className="btn" style={{ backgroundColor: '#2563eb', color: 'white' }}>
                        📊 Reportes
                    </Link>
                    <Link href="/students/new" className="btn">
                        Nuevo Estudiante
                    </Link>
                </div>
            </header>

            <StudentSearch />

            <div className="card">
                {students.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        <p>No se encontraron estudiantes con los filtros seleccionados.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Nombre</th>
                                <th style={{ padding: '1rem' }}>Identificación</th>
                                <th style={{ padding: '1rem' }}>Grado</th>
                                <th style={{ padding: '1rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{student.name}</td>
                                    <td style={{ padding: '1rem' }}>{student.nationalId}</td>
                                    <td style={{ padding: '1rem' }}>{student.grade}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <Link href={`/students/${student.id}`} style={{ marginRight: '1rem', color: 'var(--primary)' }}>
                                            Ver/Editar
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
