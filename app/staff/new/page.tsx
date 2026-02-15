'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { STAFF_ROLES } from '@/lib/constants';

export default function NewStaffPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        nationalId: '',
        role: '',
        position: '',
        email: '',
        phone: '',
        hireDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.status === 409) {
                throw new Error('Ya existe un personal con esta cédula.');
            }
            if (!res.ok) throw new Error('Error al crear personal');

            router.push('/staff');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al registrar personal.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Nuevo Personal</h1>
            </header>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '1rem', marginBottom: '1rem', borderRadius: '0.375rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre Completo</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Cédula de Identidad</label>
                        <input
                            type="text"
                            required
                            value={formData.nationalId}
                            onChange={e => setFormData({ ...formData, nationalId: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Rol</label>
                            <select
                                required
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                            >
                                <option value="">Seleccione rol...</option>
                                {STAFF_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Cargo / Puesto</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej. Prof. Matemáticas, Conserje"
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email (Opcional)</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Teléfono (Opcional)</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Fecha de Ingreso</label>
                        <input
                            type="date"
                            required
                            value={formData.hireDate}
                            onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Link href="/staff" className="btn" style={{ backgroundColor: 'var(--secondary)', textDecoration: 'none' }}>
                            Cancelar
                        </Link>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Guardando...' : 'Registrar Personal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
