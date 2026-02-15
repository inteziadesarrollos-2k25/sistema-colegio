'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // You might need to install this or implement a debounce hook. I'll stick to simple timer for now to minimize deps
import { useState, useEffect } from 'react';
import { GRADES } from '@/lib/constants';

export default function StudentSearch() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [gradeFilter, setGradeFilter] = useState(searchParams.get('grade') || '');

    // Debounced search
    useEffect(() => {
        const handleSearch = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('q', searchTerm);
            } else {
                params.delete('q');
            }
            if (gradeFilter) {
                params.set('grade', gradeFilter);
            } else {
                params.delete('grade');
            }
            replace(`/students?${params.toString()}`);
        }, 300);

        return () => clearTimeout(handleSearch);
    }, [searchTerm, gradeFilter, replace, searchParams]);

    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border)',
                    flex: 1,
                    minWidth: '200px'
                }}
            />
            <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                style={{
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border)',
                    minWidth: '200px',
                    backgroundColor: 'var(--background)'
                }}
            >
                <option value="">Todos los grados</option>
                {GRADES.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                ))}
            </select>
        </div>
    );
}
