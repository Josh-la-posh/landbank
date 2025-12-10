'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatLabel } from '@/lib/ads';

type Props = {
    title: string;
    price: string;
    size: string;
    location: string;
    featured?: boolean;
    imageUrl?: string;
    merchantCode?: string;
    merchantName?: string;
    status?: string;
    propertyType?: string;
    landType?: string;
    verification?: string;
    href?: string;
};

export default function LandCard(props: Props){
    const { title, price, size, location, featured, imageUrl, merchantCode, merchantName, status, propertyType, landType, verification, href } = props;
    const card = (
        <article className="card overflow-hidden group h-full">
            <div className="relative h-44 w-full overflow-hidden">
                <Image 
                    src={imageUrl || '/images/oip.webp'} 
                    alt={title} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-110" 
                />
                {featured && (
                    <span className="absolute left-3 top-3 rounded-full text-white text-[10px] px-2 py-1 font-medium bg-brand z-10">FEATURED</span>
                )}
            </div>
            <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg text-primary line-clamp-2 group-hover:text-brand transition-colors">{title}</h3>
                <div className="flex items-start gap-1.5 text-sm text-secondary">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <p className="line-clamp-1">{location}</p>
                </div>
                {merchantName && merchantCode && (
                    <Link 
                        href={`/profile/${merchantCode}`}
                        className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-brand transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                        <span className="font-medium">{merchantName}</span>
                    </Link>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="font-bold text-lg text-brand">{price}</span>
                    <span className="text-sm font-medium text-secondary bg-surface-secondary px-3 py-1 rounded-full">{size}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                    {status && (
                        <span className="rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 px-2.5 py-1 text-xs text-blue-700 dark:text-blue-300 font-medium">
                            {formatLabel(status)}
                        </span>
                    )}
                    {propertyType && (
                        <span className="rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 px-2.5 py-1 text-xs text-purple-700 dark:text-purple-300 font-medium">
                            {formatLabel(propertyType)}
                        </span>
                    )}
                    {landType && (
                        <span className="rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300 font-medium">
                            {formatLabel(landType)}
                        </span>
                    )}
                    {verification && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 px-2.5 py-1 text-xs text-green-700 dark:text-green-300 font-semibold">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            {formatLabel(verification)}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );

    if (href) {
        return (
            <Link href={href} className="block h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" prefetch={true}>
                {card}
            </Link>
        );
    }

    return card;
}
