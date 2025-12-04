'use client';
import { Search } from 'lucide-react';


export default function HeroSearch(){
    return (
    <form className="mx-auto mt-6 w-full max-w-3xl rounded-2xl backdrop-blur border shadow-lg p-2 flex gap-2 transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'var(--border)' }}>
        <input className="input flex-1" placeholder="Enter a state, locality or area"/>
        <select className="input w-36">
            <option>All Types</option>
            <option>Sale</option>
            <option>Lease</option>
            <option>Agriculture</option>
        </select>
        <button type="button" className="btn btn-primary gap-2"><Search className="h-4 w-4"/>Search</button>
    </form>
    );
}