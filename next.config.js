/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      // La candidature (formulaire puis bot WhatsApp) est remplacée par la
      // vidéo : les anciens liens /postuler (pubs, bios) atterrissent dessus.
      {
        source: '/postuler',
        destination: '/vsl',
        permanent: false,
      },
      {
        source: '/pricing',
        destination: '/tarifs',
        permanent: false,
      },
      {
        source: '/order',
        destination: '/decouverte',
        permanent: false,
      },
      // Anciennes pages de prix (paiement à l'usage, cartes crédits d'avant
      // octobre 2026) : les formules à jour sont sur /tarifs.
      {
        source: '/hire-our-team/:path*',
        destination: '/tarifs',
        permanent: true,
      },
      // L'offre du live (deadline personnelle de 72 h) vit dans l'app :
      // /final-offer y arrive, et Next conserve la query (?email= des emails).
      {
        source: '/final-offer',
        destination: 'https://app.empire-internet.com/join/internet?offer=live',
        permanent: false,
      },
      {
        source: '/community',
        destination: '/postit',
        permanent: false,
      },
      {
        source: '/communaute',
        destination: '/postit',
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1yei2z3i6k35z.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.lumacdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
