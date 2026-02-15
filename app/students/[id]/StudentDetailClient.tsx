'use client';

import { useState } from 'react';
import Link from 'next/link';
import StudentEditForm from './StudentEditForm';
import StudentDocuments from './StudentDocuments';
import StudentAttendance from './StudentAttendance';

export default function StudentDetailClient({ student }: { student: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'attendance'>('profile');

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{student.name}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af'
                        }}>
                            {student.grade}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>| {student.nationalId}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/students" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        Volver
                    </Link>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn">
                            Editar Perfil
                        </button>
                    )}
                </div>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('profile')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Perfil
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'documents' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'documents' ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Documentos
                </button>
                <button
                    onClick={() => setActiveTab('attendance')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'attendance' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'attendance' ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Asistencia
                </button>
            </div>

            {activeTab === 'profile' && (
                isEditing ? (
                    <StudentEditForm student={student} onCancel={() => setIsEditing(false)} />
                ) : (
                    <div className="card">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Cédula / ID</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{student.nationalId}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Grado / Sección</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{student.grade}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Fecha de Nacimiento</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                    {new Date(student.dateOfBirth).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            )}

            {activeTab === 'documents' && (
                <StudentDocuments studentId={student.id} documents={student.documents} />
            )}

            {activeTab === 'attendance' && (
                <StudentAttendance studentId={student.id} />
            )}
        </div>
    );
}
