'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';


export default function Navbar(){
    const pathname = usePathname();
    const [hasSession, setHasSession] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const syncAuthState = () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
                setHasSession(Boolean(token));
            } catch (error) {
                console.error('Unable to read auth token from storage:', error);
            }
        };

        syncAuthState();
        window.addEventListener('storage', syncAuthState);
        return () => window.removeEventListener('storage', syncAuthState);
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            setHasSession(false);
            setLoggingOut(false);
        }
    };
    const nav = [
        { href: '/', label: 'Home' },
        { href: '/lands', label: 'Browse Lands' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/about', label: 'About' },
    ];
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-gray-900/60 transition-colors" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <Link href="/" className="font-semibold tracking-tight text-lg transition-colors" style={{ color: 'var(--text-primary)' }}>
                    Land<span style={{ color: 'var(--brand)' }}>Bank</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {nav.map(n => (
                        <Link 
                            key={n.href} 
                            href={n.href} 
                            className={clsx('text-sm transition-colors', pathname === n.href && 'font-medium')}
                            style={{ color: pathname === n.href ? 'var(--brand)' : 'var(--text-secondary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = pathname === n.href ? 'var(--brand)' : 'var(--text-secondary)'}
                        >
                            {n.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    {hasSession ? (
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleLogout}
                            disabled={loggingOut}
                        >
                            {loggingOut ? 'Signing out…' : 'Sign out'}
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-ghost">Sign in</Link>
                            <Link href="/register" className="btn btn-primary">Create account</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}