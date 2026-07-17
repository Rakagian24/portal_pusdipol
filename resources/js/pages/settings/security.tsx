import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { Lock, KeyRound, ShieldCheck } from 'lucide-react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PublicSettingsLayout from '@/layouts/settings/public-settings-layout';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <PublicSettingsLayout>
            <Head title="Keamanan Akun — Pusat Studi Kepolisian" />

            <div className="space-y-10">
                {/* Change Password */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2596be]/10">
                            <Lock size={20} className="text-[#2596be]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1f5476]">Ubah Kata Sandi</h2>
                            <p className="text-sm text-gray-500">Pastikan menggunakan kata sandi yang kuat dan unik</p>
                        </div>
                    </div>
                    <div className="h-px bg-gray-100 mb-6" />

                    <Form
                        {...SecurityController.update['/settings/password'].form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus();
                            if (errors.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="space-y-5"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-sm font-semibold text-gray-700">
                                        Kata Sandi Saat Ini
                                    </Label>
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        autoComplete="current-password"
                                        placeholder="Kata sandi saat ini"
                                        className="focus:border-[#2596be] focus:ring-[#2596be]/20"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                        Kata Sandi Baru
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="Kata sandi baru"
                                        passwordrules={props.passwordRules}
                                        className="focus:border-[#2596be] focus:ring-[#2596be]/20"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700">
                                        Konfirmasi Kata Sandi Baru
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="Ulangi kata sandi baru"
                                        passwordrules={props.passwordRules}
                                        className="focus:border-[#2596be] focus:ring-[#2596be]/20"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="bg-[#1f5476] font-bold text-white hover:bg-[#2596be]"
                                    >
                                        <KeyRound size={14} className="mr-2" />
                                        Perbarui Kata Sandi
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Two Factor */}
                <div className="border-t border-gray-100 pt-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe100]/20">
                            <ShieldCheck size={20} className="text-[#1f5476]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1f5476]">Autentikasi Dua Faktor</h2>
                            <p className="text-sm text-gray-500">Tambah lapisan keamanan ekstra pada akun Anda</p>
                        </div>
                    </div>
                    <ManageTwoFactor
                        canManageTwoFactor={props.canManageTwoFactor}
                        requiresConfirmation={props.requiresConfirmation}
                        twoFactorEnabled={props.twoFactorEnabled}
                    />
                </div>

                {/* Passkeys */}
                <div className="border-t border-gray-100 pt-8">
                    <ManagePasskeys
                        canManagePasskeys={props.canManagePasskeys}
                        passkeys={props.passkeys}
                    />
                </div>
            </div>
        </PublicSettingsLayout>
    );
}
