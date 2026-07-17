import { Form, Head, Link, usePage } from '@inertiajs/react';
import { User, Mail, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminSettingsLayout from '@/layouts/admin-settings-layout';
import AppLayout from '@/layouts/app-layout';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function AdminProfile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <AdminSettingsLayout>
            <Head title="Profil Admin — Pusat Studi Kepolisian" />

            <div className="space-y-8">
                {/* Section header */}
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2596be]/10">
                            <User size={20} className="text-[#2596be]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1f5476]">Informasi Profil Admin</h2>
                            <p className="text-sm text-gray-500">Perbarui nama dan alamat email Anda</p>
                        </div>
                    </div>
                    <div className="mt-4 h-px bg-gray-100" />
                </div>

                {/* Form */}
                <Form
                    {...ProfileController.update['/admin/settings/profile'].form()}
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
            </div>
        </AdminSettingsLayout>
    );
}

AdminProfile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan',
            href: '/admin/settings/profile',
        },
        {
            title: 'Profil',
            href: '/admin/settings/profile',
        },
    ],
};
