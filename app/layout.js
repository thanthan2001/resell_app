import './globals.css'
import AOSProvider from '@/components/AOSProvider'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://socialtech.vn'),
  title: {
    default: 'socialTech — Tài Khoản & Key Bản Quyền AI Chính Hãng',
    template: '%s | socialTech',
  },
  description: 'Kho bản quyền số & tài khoản AI uy tín hàng đầu: ChatGPT Plus, Claude 3.5 Sonnet, Google Veo 3, Canva Pro, Microsoft 365. Kích hoạt tự động, thanh toán VietQR 24/7.',
  keywords: [
    'mua tài khoản AI',
    'ChatGPT Plus chính hãng',
    'Claude Pro',
    'Google Veo 3',
    'Canva Pro',
    'Microsoft 365',
    'VietQR',
    'socialtech shop',
    'socialTech',
  ],
  authors: [{ name: 'socialTech' }],
  creator: 'socialTech',
  publisher: 'socialTech',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://socialtech.vn',
    siteName: 'socialTech Shop',
    title: 'socialTech — Tài Khoản & Key Bản Quyền AI Uy Tín Số 1',
    description: 'Cửa hàng tài khoản và phần mềm bản quyền tự động. Thanh toán VietQR tức thì trong 5 giây.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'socialTech Shop',
    url: 'https://socialtech.vn',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://socialtech.vn/shop?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-canvas-mist text-ink-black antialiased selection:bg-shop-violet selection:text-white">
        <AOSProvider>{children}</AOSProvider>
      </body>
    </html>
  )
}
