import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Miles Wallet',
    short_name: 'Miles Wallet',
    description: 'Track your bank credit card points and loyalty programme miles in one place.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#000000',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
