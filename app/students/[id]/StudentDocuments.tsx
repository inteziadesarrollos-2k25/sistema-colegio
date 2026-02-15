'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentProps {
    studentId: string;
    documents: any[];
}

import DocumentEditForm from './DocumentEditForm';

export default function StudentDocuments({ studentId, documents }: DocumentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [newDoc, setNewDoc] = useState({ title: '', type: 'EXPEDIENTE', content: '' });
    const [file, setFile] = useState<File | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', newDoc.title);
            formData.append('type', newDoc.type);
            formData.append('content', newDoc.content);
            formData.append('studentId', studentId);
            if (file) {
                formData.append('file', file);
            }

            const res = await fetch('/api/documents', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to upload');

            setNewDoc({ title: '', type: 'EXPEDIENTE', content: '' });
            setFile(null);
            setShowForm(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al guardar documento');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (docId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.')) return;
        try {
            await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
            router.refresh();
        } catch (error) {
            alert('Error al eliminar documento');
        }
    };

    const docTypes = [
        { value: 'EXPEDIENTE', label: 'Expediente Personal' },
        { value: 'CONSTANCIA', label: 'Constancia' },
        { value: 'ACTA', label: 'Acta' },
        { value: 'BOLETIN', label: 'Boletín' },
    ];

    return (
        <div className="card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Documentos y Registros</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn"
                    style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Documento'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} style={{ padding: '1rem', background: 'var(--background)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <input
                            placeholder="Título del documento"
                            required
                            value={newDoc.title}
                            onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        />
                        <select
                            value={newDoc.type}
                            onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        >
                            {docTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <textarea
                            placeholder="Contenido o descripción..."
                            value={newDoc.content}
                            onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', minHeight: '80px' }}
                        />

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Adjuntar Archivo (PDF, Imagen)</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', width: '100%', background: 'white' }}
                            />
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Documento'}
                        </button>
                    </div>
                </form>
            )}

            {documents.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay documentos registrados.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {documents.map((doc: any) => (
                        editingDocId === doc.id ? (
                            <DocumentEditForm
                                key={doc.id}
                                document={doc}
                                onCancel={() => setEditingDocId(null)}
                                onSuccess={() => { setEditingDocId(null); router.refresh(); }}
                            />
                        ) : (
                            <li key={doc.id} style={{
                                padding: '1rem',
                                borderBottom: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <strong style={{ fontSize: '1rem' }}>{doc.title}</strong>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '1rem',
                                            background: doc.type === 'BOLETIN' ? 'var(--primary)' : 'var(--secondary)',
                                            color: 'white'
                                        }}>
                                            {docTypes.find(t => t.value === doc.type)?.label || doc.type}
                                        </span>
                                    </div>
                                    {doc.content && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{doc.content}</p>}
                                    {doc.fileUrl && (
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'underline' }}>
                                            📄 Ver Archivo Adjunto
                                        </a>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', marginLeft: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setEditingDocId(doc.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        )
                    ))}
                </ul>
            )}
        </div>
    );
}
