'use client';

import { useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GRADES } from '@/lib/constants';

interface StudentReportData {
    id: string;
    name: string;
    nationalId: string;
    grade: string;
    summary: {
        present: number;
        absent: number;
        late: number;
        excused: number;
    };
    attendance: any[];
}

export default function StudentReportsPage() {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [reportData, setReportData] = useState<StudentReportData[]>([]);
    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate,
                endDate,
                grade: selectedGrade
            });
            const res = await fetch(`/api/reports/student?${params}`);
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            }
        } catch (error) {
            console.error(error);
            alert('Error al generar reporte');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Reporte de Asistencia - Estudiantes', 14, 22);
        doc.setFontSize(11);
        doc.text(`Rango: ${startDate} al ${endDate}`, 14, 30);
        if (selectedGrade) doc.text(`Grado: ${selectedGrade}`, 14, 36);

        const tableColumn = ["Estudiante", "Cédula", "Grado", "Presentes", "Ausentes", "Permisos", "Retardos"];
        const tableRows: any[] = [];

        reportData.forEach(student => {
            const rowData = [
                student.name,
                student.nationalId,
                student.grade,
                student.summary.present,
                student.summary.absent,
                student.summary.excused,
                student.summary.late
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.save(`reporte_asistencia_estudiantes_${startDate}_${endDate}.pdf`);
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Reportes de Asistencia (Estudiantes)</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Consolidado y Exportación</p>
                </div>
                <Link href="/students" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                    Volver
                </Link>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'end', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Desde</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Hasta</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Grado (Opcional)</label>
                        <select
                            value={selectedGrade}
                            onChange={e => setSelectedGrade(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', minWidth: '150px', backgroundColor: 'var(--background)' }}
                        >
                            <option value="">Todos</option>
                            {GRADES.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={generateReport} className="btn" disabled={loading}>
                        {loading ? 'Generando...' : '🔍 Buscar'}
                    </button>
                    {reportData.length > 0 && (
                        <button onClick={downloadPDF} className="btn" style={{ backgroundColor: '#dc2626', color: 'white' }}>
                            📄 Descargar PDF
                        </button>
                    )}
                </div>
            </div>

            {reportData.length > 0 && (
                <div className="card">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem' }}>Estudiante</th>
                                <th style={{ padding: '0.75rem' }}>Grado</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', color: '#166534' }}>Presentes</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', color: '#991b1b' }}>Ausentes</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', color: '#854d0e' }}>Permisos</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', color: '#ca8a04' }}>Retardos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.nationalId}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {item.grade}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>{item.summary.present}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>{item.summary.absent}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>{item.summary.excused}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>{item.summary.late}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
