'use client';

import { useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { STAFF_ROLES } from '@/lib/constants';

interface StaffReportData {
    id: string;
    name: string;
    nationalId: string;
    role: string;
    position: string;
    summary: {
        present: number;
        absent: number;
        late: number;
        excused: number;
    };
    attendance: any[];
}

export default function StaffReportsPage() {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedRole, setSelectedRole] = useState('');
    const [reportData, setReportData] = useState<StaffReportData[]>([]);
    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate,
                endDate,
                role: selectedRole
            });
            const res = await fetch(`/api/reports/staff?${params}`);
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
        doc.text('Reporte de Asistencia - Personal', 14, 22);
        doc.setFontSize(11);
        doc.text(`Rango: ${startDate} al ${endDate}`, 14, 30);
        if (selectedRole) doc.text(`Filtro: ${selectedRole}`, 14, 36);

        const tableColumn = ["Nombre", "Cédula", "Cargo", "Presentes", "Ausentes", "Permisos", "Retardos"];
        const tableRows: any[] = [];

        reportData.forEach(staff => {
            const staffData = [
                staff.name,
                staff.nationalId,
                staff.position, // Changed to position for better context in report
                staff.summary.present,
                staff.summary.absent,
                staff.summary.excused,
                staff.summary.late
            ];
            tableRows.push(staffData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.save(`reporte_asistencia_personal_${startDate}_${endDate}.pdf`);
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Reportes de Asistencia (Personal)</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Consolidado y Exportación</p>
                </div>
                <Link href="/staff" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Rol (Opcional)</label>
                        <select
                            value={selectedRole}
                            onChange={e => setSelectedRole(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', minWidth: '150px', backgroundColor: 'var(--background)' }}
                        >
                            <option value="">Todos</option>
                            {STAFF_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
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
                                <th style={{ padding: '0.75rem' }}>Personal</th>
                                <th style={{ padding: '0.75rem' }}>Rol/Cargo</th>
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
                                        <div>{item.role}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.position}</div>
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
