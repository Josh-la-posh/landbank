import Image from 'next/image';

type Props = {
    title: string;
    price: string;
    size: string;
    location: string;
    featured?: boolean;
};

export default function LandCard({ title, price, size, location, featured }: Props){
    return (
        <article className="card overflow-hidden group">
            <div className="relative h-44 w-full">
                <Image src="/images/hero.jpg" alt={title} fill className="object-cover"/>
                {featured && (
                    <span className="absolute left-3 top-3 rounded-full text-white text-[10px] px-2 py-1 font-medium bg-brand">FEATURED</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold line-clamp-1 text-primary">{title}</h3>
                <p className="text-sm text-muted">{location}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-brand">{price}</span>
                    <span className='text-secondary'>{size}</span>
                </div>
            </div>
        </article>
    );
}
