interface AuthCardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <div className="rounded-lg shadow-xl p-8 transition-colors bg-surface">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">{title}</h2>
      <div className="space-y-4">{children}</div>
      {footer && (
        <div className="mt-6 pt-6 text-center text-sm transition-colors border-t border-border text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
}
