'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GRADES } from '@/lib/constants';

interface StudentEditFormProps {
    student: any;
    onCancel: () => void;
}

export default function StudentEditForm({ student, onCancel }: StudentEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: student.name,
        nationalId: student.nationalId,
        dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
        grade: student.grade
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleDelete = async () => {
        if (deleteConfirmation !== student.name) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/students/${student.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Error deleting student');
            router.push('/students');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar estudiante');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/students/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Error updating student');

            router.refresh();
            onCancel();
        } catch (error) {
            console.error(error);
            alert('Error updating student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '1.5rem', border: '1px solid var(--primary)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Editar Estudiante</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Nombre Completo</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Identificación</label>
                    <input
                        type="text"
                        required
                        value={formData.nationalId}
                        onChange={e => setFormData({ ...formData, nationalId: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Grado / Curso</label>
                        <select
                            required
                            value={formData.grade}
                            onChange={e => setFormData({ ...formData, grade: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                        >
                            <option value="">Seleccione un grado...</option>
                            {GRADES.map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={onCancel} className="btn" style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Zona de Peligro</h4>
                {!showDeleteConfirm ? (
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="btn"
                        style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #ef4444' }}
                    >
                        Eliminar Estudiante
                    </button>
                ) : (
                    <div style={{ backgroundColor: '#fff1f2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fda4af' }}>
                        <p style={{ marginBottom: '0.5rem', color: '#be123c', fontSize: '0.9rem' }}>
                            Esta acción no se puede deshacer. Para confirmar, escribe <strong>{student.name}</strong> a continuación.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={e => setDeleteConfirmation(e.target.value)}
                            placeholder="Escribe el nombre del estudiante"
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #fda4af', borderRadius: '0.25rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading || deleteConfirmation !== student.name}
                                className="btn"
                                style={{ backgroundColor: '#ef4444', color: 'white', opacity: deleteConfirmation !== student.name ? 0.5 : 1 }}
                            >
                                {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmation(''); }}
                                className="btn"
                                style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'var(--text)' }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
