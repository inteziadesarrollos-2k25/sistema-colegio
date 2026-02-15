'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GRADES } from '@/lib/constants';

export default function NewStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        nationalId: '',
        dateOfBirth: '',
        grade: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Error al crear estudiante');

            router.push('/students');
            router.refresh();
        } catch (err) {
            setError('Error al registrar estudiante. Verifique los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Nuevo Estudiante</h1>
            </header>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '1rem', marginBottom: '1rem', borderRadius: '0.375rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Identificación (DNI/Pasaporte)</label>
                        <input
                            type="text"
                            required
                            value={formData.nationalId}
                            onChange={e => setFormData({ ...formData, nationalId: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Grado / Curso</label>
                        <select
                            required
                            value={formData.grade}
                            onChange={e => setFormData({ ...formData, grade: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                        >
                            <option value="">Seleccione un grado...</option>
                            {GRADES.map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Link href="/students" className="btn" style={{ backgroundColor: 'var(--secondary)', textDecoration: 'none' }}>
                            Cancelar
                        </Link>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Guardando...' : 'Registrar Estudiante'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
