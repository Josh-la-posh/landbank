import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

type AuthSuccessProps = {
  title: string;
  message: string;
  redirectUrl?: string;
  redirectText?: string;
};

export default function AuthSuccess({ title, message, redirectUrl, redirectText }: AuthSuccessProps) {
  return (
    <div className="rounded-lg shadow-xl p-8 transition-colors bg-surface text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-3">{title}</h2>
      <p className="text-secondary mb-6">{message}</p>
      <div className="flex items-center justify-center gap-1 mb-6">
        <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      {redirectUrl && redirectText && (
        <div className="pt-6 text-center text-sm transition-colors border-t border-border text-secondary">
          <Link className="transition-colors text-brand hover:underline" href={redirectUrl}>
            {redirectText}
          </Link>
        </div>
      )}
    </div>
  );
}
