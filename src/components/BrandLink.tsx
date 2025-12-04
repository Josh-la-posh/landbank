'use client';

interface BrandLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function BrandLink({ href, children, className = '' }: BrandLinkProps) {
  return (
    <a 
      className={`transition-colors ${className}`}
      href={href}
      style={{ color: 'var(--text-secondary)' }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
    >
      {children}
    </a>
  );
}
