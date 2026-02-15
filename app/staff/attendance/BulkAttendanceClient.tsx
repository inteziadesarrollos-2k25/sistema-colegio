'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BulkAttendanceClientProps {
    staff: any[];
}

export default function BulkAttendanceClient({ staff }: BulkAttendanceClientProps) {
    const router = useRouter();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    // Maintain state for each staff member
    const [records, setRecords] = useState<{ [key: string]: any }>(
        staff.reduce((acc, curr) => ({
            ...acc,
            [curr.id]: {
                status: 'PRESENTE',
                entryTime: '',
                exitTime: '',
                reason: ''
            }
        }), {})
    );

    const handleRecordChange = (id: string, field: string, value: any) => {
        setRecords(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = Object.entries(records).map(([staffId, data]) => ({
                staffId,
                ...data
            }));

            const res = await fetch('/api/attendance/staff/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, records: payload })
            });

            if (!res.ok) throw new Error('Failed to save');

            alert('Asistencia guardada correctamente');
            router.push('/staff');
        } catch (error) {
            console.error(error);
            alert('Error al guardar asistencia masiva');
        } finally {
            setLoading(false);
        }
    };

    const setAllPresent = () => {
        const newRecords = { ...records };
        Object.keys(newRecords).forEach(id => {
            newRecords[id].status = 'PRESENTE';
        });
        setRecords(newRecords);
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Asistencia Masiva</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Registro rápido de asistencia diaria</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/staff" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        Volver
                    </Link>
                    <button onClick={handleSubmit} className="btn" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Todo'}
                    </button>
                </div>
            </header>

            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Fecha del Registro</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <button
                        onClick={setAllPresent}
                        className="btn"
                        style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac', marginTop: '1.5rem' }}
                    >
                        Marcar Todos Presentes
                    </button>
                </div>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Personal</th>
                            <th style={{ padding: '1rem' }}>Estado</th>
                            <th style={{ padding: '1rem' }}>Entrada</th>
                            <th style={{ padding: '1rem' }}>Salida</th>
                            <th style={{ padding: '1rem' }}>Observación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((member) => (
                            <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>{member.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <select
                                        value={records[member.id].status}
                                        onChange={e => handleRecordChange(member.id, 'status', e.target.value)}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '0.25rem',
                                            border: '1px solid var(--border)',
                                            backgroundColor:
                                                records[member.id].status === 'AUSENTE' ? '#fee2e2' :
                                                    records[member.id].status === 'PERMISO' ? '#fef9c3' :
                                                        records[member.id].status === 'REPOSO' ? '#dbeafe' : 'white'
                                        }}
                                    >
                                        <option value="PRESENTE">Presente</option>
                                        <option value="AUSENTE">Inasistencia</option>
                                        <option value="PERMISO">Permiso</option>
                                        <option value="REPOSO">Reposo</option>
                                    </select>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="time"
                                        value={records[member.id].entryTime}
                                        onChange={e => handleRecordChange(member.id, 'entryTime', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', width: '110px' }}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="time"
                                        value={records[member.id].exitTime}
                                        onChange={e => handleRecordChange(member.id, 'exitTime', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', width: '110px' }}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Opcional..."
                                        value={records[member.id].reason}
                                        onChange={e => handleRecordChange(member.id, 'reason', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', width: '100%' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <Link href="/staff" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    &larr; Volver a la lista de personal
                </Link>
            </div>
        </div>
    );
}
