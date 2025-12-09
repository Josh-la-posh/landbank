'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import { Menu, X } from 'lucide-react';


export default function Navbar(){
    const pathname = usePathname();
    const [hasSession, setHasSession] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

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
    const renderNavLink = (n: { href: string; label: string }) => (
        <Link
            key={n.href}
            href={n.href}
            className={clsx('text-sm transition-colors', pathname === n.href && 'font-medium')}
            style={{ color: pathname === n.href ? 'var(--brand)' : 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand)'}
            onMouseLeave={(e) => e.currentTarget.style.color = pathname === n.href ? 'var(--brand)' : 'var(--text-secondary)'}
            onClick={() => setMobileOpen(false)}
        >
            {n.label}
        </Link>
    );

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-gray-900/60 transition-colors" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <Link href="/" className="font-semibold tracking-tight text-lg transition-colors" style={{ color: 'var(--text-primary)' }}>
                    Land<span style={{ color: 'var(--brand)' }}>Bank</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {nav.map(renderNavLink)}
                </nav>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="md:hidden rounded-full border border-border/60 p-2 text-primary"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                    {hasSession ? (
                        <button
                            type="button"
                            className="hidden md:inline-flex btn btn-ghost"
                            onClick={handleLogout}
                            disabled={loggingOut}
                        >
                            {loggingOut ? 'Signing out…' : 'Sign out'}
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className="hidden md:inline-flex btn btn-ghost">Sign in</Link>
                            <Link href="/register" className="hidden md:inline-flex btn btn-primary">Create account</Link>
                        </>
                    )}
                </div>
            </div>
            {mobileOpen && (
                <div className="md:hidden border-t border-border/60 bg-surface px-4 pb-4">
                    <div className="flex flex-col gap-3 py-4">
                        {nav.map(renderNavLink)}
                    </div>
                    <div className="flex flex-col gap-2">
                        {hasSession ? (
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleLogout();
                                }}
                                disabled={loggingOut}
                            >
                                {loggingOut ? 'Signing out…' : 'Sign out'}
                            </button>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-ghost" onClick={() => setMobileOpen(false)}>
                                    Sign in
                                </Link>
                                <Link href="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                                    Create account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}