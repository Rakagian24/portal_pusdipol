import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * welcome.tsx — redirect ke halaman utama (home).
 * Route '/' di-handle oleh HomeController dan me-render home.tsx.
 * File ini sebagai fallback/redirect jika ada reference langsung ke /welcome.
 */
export default function Welcome() {
    useEffect(() => {
        router.visit('/', { replace: true });
    }, []);

    return (
        <>
            <Head title="Portal PSK — Pusat Studi Kepolisian" />
            <div className="flex min-h-screen items-center justify-center bg-[#1f5476]">
                <div className="text-center text-white">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2596be] text-[#ffe100]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                    <p className="text-sm text-white/60">Mengalihkan ke Portal PSK...</p>
                </div>
            </div>
        </>
    );
}
