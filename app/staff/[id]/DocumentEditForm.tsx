'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentEditFormProps {
    document: any;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function DocumentEditForm({ document, onCancel, onSuccess }: DocumentEditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: document.title,
        type: document.type,
        content: document.content || ''
    });
    const [file, setFile] = useState<File | null>(null);

    const docTypes = [
        { value: 'EXPEDIENTE', label: 'Expediente Personal' },
        { value: 'CONSTANCIA', label: 'Constancia' },
        { value: 'ACTA', label: 'Acta' },
        { value: 'BOLETIN', label: 'Boletín' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);
            data.append('content', formData.content);
            if (file) {
                data.append('file', file);
            }

            const res = await fetch(`/api/documents/${document.id}`, {
                method: 'PUT',
                body: data,
            });

            if (!res.ok) throw new Error('Failed to update document');

            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Error al actualizar documento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', marginBottom: '1rem', background: '#f9fafb' }}>
            <h4 style={{ marginBottom: '1rem' }}>Editar Documento</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
                <input
                    placeholder="Título del documento"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                />
                <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                >
                    {docTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <textarea
                    placeholder="Contenido o descripción..."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', minHeight: '80px' }}
                />

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        Reemplazar Archivo (Opcional)
                    </label>
                    {document.fileUrl && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Archivo actual: <a href={document.fileUrl} target="_blank">Ver</a></p>}
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                        style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.25rem', width: '100%', background: 'white' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Guardando...' : 'Actualizar'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn" style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'var(--text)' }}>
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    );
}
