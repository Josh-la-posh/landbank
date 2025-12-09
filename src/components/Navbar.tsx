'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { authApi } from '@/lib/api';
import { Bell, ChevronDown, Heart, Lock, LogOut, Megaphone, Menu, UserRound, X } from 'lucide-react';


const accountLinks = [
    { label: 'My Saved Property', href: '/dashboard/saved', icon: Heart },
    { label: 'My Property Alerts', href: '/dashboard?view=alerts', icon: Bell },
    { label: 'My Property Requests', href: '/dashboard?view=requests', icon: Megaphone },
    { label: 'My Profile', href: '/dashboard/profile', icon: UserRound },
    { label: 'Change Password', href: '/dashboard/security', icon: Lock },
];

export default function Navbar(){
    const pathname = usePathname();
    const router = useRouter();
    const [hasSession, setHasSession] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement | null>(null);

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

        const handler = (event: Event) => {
            const detail = (event as CustomEvent<{ token?: string | null }>).detail;
            setHasSession(Boolean(detail?.token));
            if (!detail?.token) {
                setAccountOpen(false);
            }
        };
        window.addEventListener('landbank:auth-changed', handler);

        return () => {
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener('landbank:auth-changed', handler);
        };
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
            setAccountOpen(false);
            window.dispatchEvent(new CustomEvent('landbank:auth-changed', { detail: { token: null } }));
            router.push('/home');
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!hasSession) {
            setAccountOpen(false);
        }
    }, [hasSession]);

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
                        <div className="relative hidden md:block" ref={accountMenuRef}>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1.5 text-sm font-medium text-primary"
                                onClick={() => setAccountOpen((prev) => !prev)}
                                aria-expanded={accountOpen}
                            >
                                My Account
                                <ChevronDown className={`h-4 w-4 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {accountOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-border/70 bg-surface shadow-xl">
                                    <div className="py-2">
                                        {accountLinks.map(({ label, href, icon: Icon }) => (
                                            <Link
                                                key={label}
                                                href={href}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-primary transition hover:bg-surface-secondary"
                                                onClick={() => setAccountOpen(false)}
                                            >
                                                <Icon className="h-4 w-4 text-brand" />
                                                {label}
                                            </Link>
                                        ))}
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-primary transition hover:bg-surface-secondary"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                        >
                                            <LogOut className="h-4 w-4 text-brand" />
                                            {loggingOut ? 'Signing out…' : 'Sign out'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                            <>
                                <div className="rounded-2xl border border-border/60 bg-surface-secondary/60">
                                    {accountLinks.map(({ label, href, icon: Icon }) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-primary transition hover:bg-surface"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Icon className="h-4 w-4 text-brand" />
                                            {label}
                                        </Link>
                                    ))}
                                </div>
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
                            </>
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