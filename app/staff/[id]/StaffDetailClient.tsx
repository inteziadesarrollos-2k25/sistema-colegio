'use client';

import { useState } from 'react';
import Link from 'next/link';
import StaffEditForm from './StaffEditForm';
import StaffDocuments from './StaffDocuments';
import StaffAttendance from './StaffAttendance';

export default function StaffDetailClient({ staff }: { staff: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'attendance'>('profile');

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{staff.name}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            backgroundColor: 'var(--primary)',
                            color: 'white'
                        }}>
                            {staff.role}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>| {staff.position}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/staff" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
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
                    <StaffEditForm staff={staff} onCancel={() => setIsEditing(false)} />
                ) : (
                    <div className="card">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Cédula</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{staff.nationalId}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Rol</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{staff.role}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Cargo</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{staff.position}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Fecha de Ingreso</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                    {staff.hireDate ? new Date(staff.hireDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{staff.email || '-'}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Teléfono</label>
                                <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>{staff.phone || '-'}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Estado</label>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.25rem',
                                    backgroundColor: staff.isActive ? '#dcfce7' : '#fee2e2',
                                    color: staff.isActive ? '#166534' : '#991b1b',
                                    fontSize: '0.875rem',
                                    fontWeight: 500
                                }}>
                                    {staff.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            )}

            {activeTab === 'documents' && (
                <StaffDocuments staffId={staff.id} documents={staff.documents} />
            )}

            {activeTab === 'attendance' && (
                <StaffAttendance staffId={staff.id} />
            )}
        </div>
    );
}
