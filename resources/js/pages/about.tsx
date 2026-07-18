import { Head } from '@inertiajs/react';
import { Target, History, Users, ArrowRight } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';

export default function About() {
    return (
        <GuestLayout>
            <Head title="Tentang Kami" />

            {/* Header Section */}
            <section className="relative overflow-hidden bg-[#1f5476] px-6 py-20 lg:px-12">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
                <div className="relative mx-auto max-w-4xl text-center text-white">
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Tentang <span className="text-[#ffe100]">Kami</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-white/80 sm:text-xl">
                        Mengenal lebih dekat Pusat Studi Kepolisian Universitas Langlangbuana, wujud kolaborasi strategis untuk keamanan dan ketertiban masyarakat.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto max-w-4xl px-6 py-16 lg:px-12 lg:py-24">
                
                {/* Tentang */}
                <div className="mb-20">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2596be]/10 text-[#2596be]">
                            <Target size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1f5476]">Fokus & Visi</h2>
                    </div>
                    <p className="mb-6 text-lg leading-relaxed text-gray-700">
                        Pusat Studi Kepolisian Unla merupakan wadah kolaborasi strategis antara dunia akademik, praktisi hukum, dan institusi kepolisian (khususnya Polda Jawa Barat) untuk mengkaji isu-isu strategis terkait kepolisian dan hukum.
                    </p>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {[
                            { title: 'Kajian dan Penelitian', desc: 'Menghasilkan kajian ilmiah inovatif yang mendukung pemeliharaan keamanan dan ketertiban masyarakat (kamtibmas) serta tantangan sosial terkini.' },
                            { title: 'Rekomendasi Kebijakan', desc: 'Menyusun rekomendasi kebijakan berbasis data dan kajian akademik yang mendalam untuk mendukung tugas dan fungsi Polri.' },
                            { title: 'Pusat Referensi', desc: 'Menjadi referensi utama bagi para akademisi maupun praktisi yang ingin menggali lebih dalam mengenai isu-isu kepolisian.' }
                        ].map((item, i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#2596be]/30 hover:shadow-md">
                                <h3 className="mb-3 font-bold text-[#1f5476]">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sejarah */}
                <div className="mb-20 rounded-3xl bg-gray-50 p-8 sm:p-12">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffe100]/20 text-[#d4b900]">
                            <History size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1f5476]">Sejarah Pembentukan</h2>
                    </div>
                    <p className="mb-8 text-lg leading-relaxed text-gray-700">
                        Pembentukan pusat studi ini didorong oleh hubungan historis yang sangat kuat antara Universitas Langlangbuana dan keluarga besar Kepolisian Republik Indonesia (Polri). Sejumlah pendiri kampus Unla merupakan purnawirawan dan mantan pejabat di lingkungan Polda Jabar.
                    </p>
                    <div className="space-y-6 border-l-2 border-[#2596be]/20 pl-6">
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#2596be] ring-4 ring-gray-50"></div>
                            <h4 className="font-bold text-[#1f5476]">Februari 2026</h4>
                            <p className="mt-2 text-gray-600">Rencana pendirian dan sinergi pusat studi ini mulai dimatangkan secara intensif oleh pihak Polda Jabar dan Unla.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#ffe100] ring-4 ring-gray-50"></div>
                            <h4 className="font-bold text-[#1f5476]">10 Juni 2026</h4>
                            <p className="mt-2 text-gray-600">Posko Pusat Studi Kepolisian secara resmi diluncurkan di Kampus Unla, Bandung. Peresmian ini dipimpin langsung oleh Kapolda Jawa Barat, Irjen Pol. Dr. Rudi Setiawan, dan dirangkaikan dengan kegiatan <em>Focus Group Discussion</em> (FGD) sebagai langkah awal penguatan kerja sama.</p>
                        </div>
                    </div>
                </div>

                {/* Struktur Organisasi */}
                <div>
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2596be]/10 text-[#2596be]">
                            <Users size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1f5476]">Struktur Organisasi</h2>
                    </div>
                    <p className="mb-6 text-lg leading-relaxed text-gray-700">
                        Berdasarkan informasi kelembagaan pada saat peluncurannya:
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#2596be]/30 hover:shadow-md">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2596be]/10 text-[#2596be]">
                                <ArrowRight size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1f5476]">Kedudukan</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                    Pusat Studi Kepolisian berstatus sebagai <strong className="text-[#1f5476]">unit khusus yang berada langsung di bawah supervisi Rektor Unla</strong>.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#2596be]/30 hover:shadow-md">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2596be]/10 text-[#2596be]">
                                <ArrowRight size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1f5476]">Kepemimpinan</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                    Unit ini diketuai oleh <strong className="text-[#1f5476]">Dr. Ahmad Johan</strong>, yang pada saat pembentukannya juga merangkap jabatan sebagai Ketua Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM) Unla. Hubungan dengan LPPM ini mengukuhkan fungsi pusat studi tersebut sebagai perpanjangan tangan kampus dalam bidang riset kepolisian.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
