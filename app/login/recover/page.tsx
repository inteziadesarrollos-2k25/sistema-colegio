'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecoverPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Username, 2: Questions
    const [username, setUsername] = useState('');
    const [answers, setAnswers] = useState({ a1: '', a2: '', a3: '' });
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerifyUser = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleRecover = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/recover', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    answer1: answers.a1,
                    answer2: answers.a2,
                    answer3: answers.a3,
                    newPassword
                })
            });

            if (res.ok) {
                alert('Contraseña actualizada correctamente. Por favor inicia sesión.');
                router.push('/login');
            } else {
                const msg = await res.text();
                setError(msg || 'Error al recuperar contraseña');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--background)'
        }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Recuperar Contraseña</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleVerifyUser}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Usuario (DNI/Email)</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Continuar</button>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <Link href="/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Volver al Login</Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleRecover}>
                        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Responde las preguntas de seguridad para el usuario <strong>{username}</strong>:
                        </p>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>1. ¿Cuál es el nombre de tu primera mascota?</label>
                            <input
                                type="text"
                                value={answers.a1}
                                onChange={e => setAnswers({ ...answers, a1: e.target.value })}
                                required
                                placeholder="Respuesta..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>2. ¿Ciudad de nacimiento?</label>
                            <input
                                type="text"
                                value={answers.a2}
                                onChange={e => setAnswers({ ...answers, a2: e.target.value })}
                                required
                                placeholder="Respuesta..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>3. ¿Nombre de tu abuela materna?</label>
                            <input
                                type="text"
                                value={answers.a3}
                                onChange={e => setAnswers({ ...answers, a3: e.target.value })}
                                required
                                placeholder="Respuesta..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Verificando...' : 'Restablecer Contraseña'}
                        </button>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                                Volver
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
