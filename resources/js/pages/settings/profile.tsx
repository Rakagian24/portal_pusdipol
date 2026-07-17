import { Form, Head, Link, usePage } from '@inertiajs/react';
import { User, Mail, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicSettingsLayout from '@/layouts/settings/public-settings-layout';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <PublicSettingsLayout>
            <Head title="Profil — Pusat Studi Kepolisian" />

            <div className="space-y-8">
                {/* Section header */}
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2596be]/10">
                            <User size={20} className="text-[#2596be]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1f5476]">Informasi Profil</h2>
                            <p className="text-sm text-gray-500">Perbarui nama dan alamat email Anda</p>
                        </div>
                    </div>
                    <div className="mt-4 h-px bg-gray-100" />
                </div>

                {/* Avatar placeholder */}
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f5476] to-[#2596be] text-2xl font-extrabold text-white shadow-md">
                        {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-[#1f5476]">{auth.user.name}</p>
                        <p className="text-sm text-gray-500">{auth.user.email}</p>
                    </div>
                </div>

                {/* Form */}
                <Form
                    {...ProfileController.update['/settings/profile'].form()}
                    options={{ preserveScroll: true }}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                    Nama Lengkap
                                </Label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        autoComplete="name"
                                        defaultValue={auth.user.name}
                                        placeholder="Nama Lengkap"
                                        className="pl-9 focus:border-[#2596be] focus:ring-[#2596be]/20"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Alamat Email
                                </Label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="username"
                                        defaultValue={auth.user.email}
                                        placeholder="email@contoh.com"
                                        className="pl-9 focus:border-[#2596be] focus:ring-[#2596be]/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Email verification notice */}
                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                                    <div className="text-sm text-amber-700">
                                        Email Anda belum terverifikasi.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="font-bold underline underline-offset-2 hover:text-amber-900"
                                        >
                                            Kirim ulang email verifikasi.
                                        </Link>
                                        {status === 'verification-link-sent' && (
                                            <p className="mt-1 flex items-center gap-1.5 font-medium text-green-600">
                                                <CheckCircle size={13} />
                                                Link verifikasi baru telah dikirim ke email Anda.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className="bg-[#1f5476] font-bold text-white hover:bg-[#2596be]"
                                >
                                    Simpan Perubahan
                                </Button>
                                {status === 'profile-updated' && (
                                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                                        <CheckCircle size={14} />
                                        Tersimpan!
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </Form>

                {/* Danger Zone */}
                <div className="border-t border-gray-100 pt-8">
                    <div className="mb-4 flex items-center gap-2">
                        <Trash2 size={16} className="text-[#e62129]" />
                        <h3 className="font-bold text-[#e62129]">Zona Berbahaya</h3>
                    </div>
                    <DeleteUser />
                </div>
            </div>
        </PublicSettingsLayout>
    );
}
