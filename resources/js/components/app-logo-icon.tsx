import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/images/logo.webp" alt="Logo" className={`object-contain ${className}`} />
    );
}
