'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STAFF_ROLES } from '@/lib/constants';

interface StaffEditFormProps {
    staff: any;
    onCancel: () => void;
}

export default function StaffEditForm({ staff, onCancel }: StaffEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: staff.name,
        nationalId: staff.nationalId,
        role: staff.role,
        position: staff.position,
        email: staff.email || '',
        phone: staff.phone || '',
        hireDate: staff.hireDate ? new Date(staff.hireDate).toISOString().split('T')[0] : '',
        isActive: staff.isActive
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleDelete = async () => {
        if (deleteConfirmation !== staff.name) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/staff/${staff.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Error deleting staff');
            router.push('/staff');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar personal');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/staff/${staff.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update staff');

            router.refresh();
            onCancel();
        } catch (error) {
            console.error(error);
            alert('Error al actualizar personal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="card">
                <div style={{ display: 'grid', gap: '1rem' }}>
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Cédula</label>
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
                                {STAFF_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Cargo</label>
                            <input
                                type="text"
                                required
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Teléfono</label>
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

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            Personal Activo
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button type="button" onClick={onCancel} className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                            Cancelar
                        </button>
                    </div>
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
                        Eliminar Personal
                    </button>
                ) : (
                    <div style={{ backgroundColor: '#fff1f2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fda4af' }}>
                        <p style={{ marginBottom: '0.5rem', color: '#be123c', fontSize: '0.9rem' }}>
                            Esta acción no se puede deshacer. Para confirmar, escribe <strong>{staff.name}</strong> a continuación.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={e => setDeleteConfirmation(e.target.value)}
                            placeholder="Escribe el nombre del personal"
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #fda4af', borderRadius: '0.25rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading || deleteConfirmation !== staff.name}
                                className="btn"
                                style={{ backgroundColor: '#ef4444', color: 'white', opacity: deleteConfirmation !== staff.name ? 0.5 : 1 }}
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
