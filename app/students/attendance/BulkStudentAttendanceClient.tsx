'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BulkStudentAttendanceClientProps {
    students: any[];
    grades: string[];
    initialGrade: string;
}

export default function BulkStudentAttendanceClient({ students, grades, initialGrade }: BulkStudentAttendanceClientProps) {
    const router = useRouter();
    const [selectedGrade, setSelectedGrade] = useState(initialGrade);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    // Initial load records structure
    const initializeRecords = (studentList: any[]) => {
        return studentList.reduce((acc, curr) => ({
            ...acc,
            [curr.id]: {
                status: 'PRESENTE',
                entryTime: '',
                exitTime: '',
                reason: ''
            }
        }), {});
    };

    const [records, setRecords] = useState<{ [key: string]: any }>(() => initializeRecords(students));

    // Sync records when students list changes (e.g. changing grade)
    useEffect(() => {
        setRecords((prev) => {
            const newRecords = { ...prev };
            students.forEach(s => {
                if (!newRecords[s.id]) {
                    newRecords[s.id] = {
                        status: 'PRESENTE',
                        entryTime: '',
                        exitTime: '',
                        reason: ''
                    };
                }
            });
            return newRecords;
        });
    }, [students]);

    // Refetch when grade changes (handled by reloading page via navigation)
    const handleGradeChange = (grade: string) => {
        setSelectedGrade(grade);
        router.push(`/students/attendance?grade=${encodeURIComponent(grade)}`);
    };

    const handleRecordChange = (id: string, field: string, value: any) => {
        setRecords(prev => {
            const studentRecord = prev[id] || {
                status: 'PRESENTE',
                entryTime: '',
                exitTime: '',
                reason: ''
            };

            return {
                ...prev,
                [id]: {
                    ...studentRecord,
                    [field]: value
                }
            };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Build payload only for current students
            const currentStudentIds = students.map(s => s.id);
            const payload = Object.entries(records)
                .filter(([id]) => currentStudentIds.includes(id))
                .map(([studentId, data]) => ({
                    studentId,
                    ...data
                }));

            if (payload.length === 0) {
                alert('No hay estudiantes seleccionados.');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/attendance/student/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, records: payload })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            alert('Asistencia guardada correctamente');
            router.push('/students');
        } catch (error: any) {
            console.error(error);
            alert(`Error al guardar asistencia masiva: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const setAllPresent = () => {
        const newRecords = { ...records };
        students.forEach(s => {
            if (newRecords[s.id]) {
                newRecords[s.id].status = 'PRESENTE';
            }
        });
        setRecords(newRecords);
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Asistencia Estudiantes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Control por grado/sección</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/students" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        Volver
                    </Link>
                    <button onClick={handleSubmit} className="btn" disabled={loading || students.length === 0}>
                        {loading ? 'Guardando...' : 'Guardar Todo'}
                    </button>
                </div>
            </header>

            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'end', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Fecha</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Grado / Año</label>
                        <select
                            value={selectedGrade}
                            onChange={e => handleGradeChange(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', minWidth: '200px', backgroundColor: 'var(--background)' }}
                        >
                            <option value="">Seleccione un grado...</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={setAllPresent}
                        className="btn"
                        disabled={students.length === 0}
                        style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                    >
                        Marcar Todos Presentes
                    </button>
                </div>
            </div>

            {selectedGrade === '' ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <h3>Selecciona un grado para comenzar</h3>
                </div>
            ) : students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <h3>No hay estudiantes registrados en {selectedGrade}</h3>
                </div>
            ) : (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Estudiante</th>
                                <th style={{ padding: '1rem' }}>Estado</th>
                                <th style={{ padding: '1rem' }}>Entrada</th>
                                <th style={{ padding: '1rem' }}>Salida</th>
                                <th style={{ padding: '1rem' }}>Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{student.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.nationalId}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={records[student.id]?.status || 'PRESENTE'}
                                            onChange={e => handleRecordChange(student.id, 'status', e.target.value)}
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: '0.25rem',
                                                border: '1px solid var(--border)',
                                                backgroundColor:
                                                    records[student.id]?.status === 'AUSENTE' ? '#fee2e2' :
                                                        records[student.id]?.status === 'PERMISO' ? '#fef9c3' :
                                                            records[student.id]?.status === 'REPOSO' ? '#dbeafe' :
                                                                records[student.id]?.status === 'LLEGADA_TARDE' ? '#fef08a' : 'white'
                                            }}
                                        >
                                            <option value="PRESENTE">Presente</option>
                                            <option value="AUSENTE">Inasistencia</option>
                                            <option value="LLEGADA_TARDE">Llegada Tarde</option>
                                            <option value="PERMISO">Permiso</option>
                                            <option value="REPOSO">Reposo</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="time"
                                            value={records[student.id]?.entryTime || ''}
                                            onChange={e => handleRecordChange(student.id, 'entryTime', e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', width: '110px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="time"
                                            value={records[student.id]?.exitTime || ''}
                                            onChange={e => handleRecordChange(student.id, 'exitTime', e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', width: '110px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Opcional..."
                                            value={records[student.id]?.reason || ''}
                                            onChange={e => handleRecordChange(student.id, 'reason', e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', width: '100%' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
