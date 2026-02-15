'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { STAFF_ROLES } from '@/lib/constants'; // Need to add this

export default function StaffSearch() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');

    // Debounced search
    useEffect(() => {
        const handleSearch = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('q', searchTerm);
            } else {
                params.delete('q');
            }
            if (roleFilter) {
                params.set('role', roleFilter);
            } else {
                params.delete('role');
            }
            replace(`/staff?${params.toString()}`);
        }, 300);

        return () => clearTimeout(handleSearch);
    }, [searchTerm, roleFilter, replace, searchParams]);

    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
                type="text"
                placeholder="Buscar personal..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border)',
                    minWidth: '200px',
                    backgroundColor: 'var(--background)'
                }}
            >
                <option value="">Todos los roles</option>
                {STAFF_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
        </div>
    );
}
