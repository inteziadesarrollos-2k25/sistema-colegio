'use client';

import { useState, useEffect, useCallback } from 'react';

interface AttendanceProps {
    studentId: string;
}

export default function StudentAttendance({ studentId }: AttendanceProps) {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('PRESENTE');
    const [reason, setReason] = useState('');
    const [entryTime, setEntryTime] = useState('');
    const [exitTime, setExitTime] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const statuses = [
        { value: 'PRESENTE', label: 'Presente', color: '#166534', bg: '#dcfce7' },
        { value: 'AUSENTE', label: 'Inasistencia', color: '#991b1b', bg: '#fee2e2' },
        { value: 'PERMISO', label: 'Permiso', color: '#854d0e', bg: '#fef9c3' },
        { value: 'REPOSO', label: 'Reposo Médico', color: '#1e40af', bg: '#dbeafe' },
        { value: 'LLEGADA_TARDE', label: 'Llegada Tarde', color: '#ca8a04', bg: '#fef08a' },
    ];

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/attendance/student?studentId=${studentId}&month=${month}`);
            if (res.ok) {
                const data = await res.json();
                setAttendance(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [studentId, month]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const handleDelete = async (attendanceId: string) => {
        if (!confirm('¿Estás seguro de eliminar este registro de asistencia?')) return;

        try {
            const res = await fetch(`/api/attendance/student/${attendanceId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchAttendance();
            } else {
                alert('No se pudo eliminar el registro.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al eliminar.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Entry/Exit Time required for Present/Late
        if ((status === 'PRESENTE' || status === 'LLEGADA_TARDE') && (!entryTime || !exitTime)) {
            alert('Para el estado "Presente" o "Llegada Tarde", es obligatorio registrar la hora de entrada y salida.');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('studentId', studentId);
            formData.append('date', selectedDate);
            formData.append('status', status);
            formData.append('reason', reason);
            formData.append('entryTime', entryTime);
            formData.append('exitTime', exitTime);
            if (file) {
                formData.append('file', file);
            }

            const res = await fetch('/api/attendance/student', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                fetchAttendance();
                // Reset form partially
                setReason('');
                setFile(null);
                setEntryTime('');
                setExitTime('');
            } else {
                alert('Error al registrar asistencia');
            }
        } catch (error) {
            console.error(error);
            alert('Error al registrar asistencia');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>

                {/* Form Section */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Registrar Asistencia</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Fecha</label>
                            <input
                                type="date"
                                required
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Estado</label>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                {statuses.map(s => (
                                    <label key={s.value} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem',
                                        borderRadius: '0.25rem',
                                        border: status === s.value ? `2px solid ${s.color}` : '1px solid var(--border)',
                                        backgroundColor: status === s.value ? s.bg : 'transparent',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value={s.value}
                                            checked={status === s.value}
                                            onChange={(e) => setStatus(e.target.value)}
                                        />
                                        <span style={{ fontWeight: status === s.value ? 600 : 400, color: s.color }}>{s.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Entrada</label>
                                <input
                                    type="time"
                                    value={entryTime}
                                    onChange={e => setEntryTime(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Salida</label>
                                <input
                                    type="time"
                                    value={exitTime}
                                    onChange={e => setExitTime(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Motivo / Justificativo</label>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Opcional..."
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', minHeight: '60px' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Adjuntar Justificativo (PDF/Foto)</label>
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                accept=".pdf,.jpg,.png,.jpeg"
                                style={{ width: '100%', padding: '0.5rem', background: 'white', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            disabled={submitting}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {submitting ? 'Guardando...' : 'Guardar Registro'}
                        </button>
                    </form>
                </div>

                {/* History Section */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Historial</h3>
                        <input
                            type="month"
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                            style={{ padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        />
                    </div>

                    {loading ? (
                        <p>Cargando...</p>
                    ) : attendance.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay registros para este mes.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Fecha</th>
                                    <th style={{ padding: '0.75rem' }}>Estado</th>
                                    <th style={{ padding: '0.75rem' }}>Horario</th>
                                    <th style={{ padding: '0.75rem' }}>Observación</th>
                                    <th style={{ padding: '0.75rem' }}>Archivo</th>
                                    <th style={{ padding: '0.75rem' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record) => {
                                    const statusConfig = statuses.find(s => s.value === record.status) || statuses[0];
                                    return (
                                        <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '0.75rem' }}>
                                                {new Date(record.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '1rem',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: statusConfig.bg,
                                                    color: statusConfig.color,
                                                    fontWeight: 600
                                                }}>
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                                {record.entryTime || '--:--'} - {record.exitTime || '--:--'}
                                            </td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {record.reason || '-'}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {record.fileUrl && (
                                                    <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                                        Ver
                                                    </a>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <button
                                                    onClick={() => handleDelete(record.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.25rem' }}
                                                    title="Eliminar Registro"
                                                >
                                                    &times;
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
