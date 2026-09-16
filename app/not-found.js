import Link from 'next/link'

export const metadata = {
  title: 'Trang không tồn tại | socialTech',
  description: 'Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
}

export default function NotFound() {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f2f4f5;color:#000;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
        `}</style>
      </head>
      <body>
        <div style={{
          maxWidth: 480,
          width: '100%',
          background: '#fff',
          borderRadius: 28,
          boxShadow: 'rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px',
          border: '1px solid #ebebeb',
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>404</div>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.05em', color: '#000', marginBottom: 8 }}>
            Trang không tồn tại
          </h1>
          <p style={{ fontSize: 13, color: '#787574', lineHeight: 1.6, marginBottom: 32 }}>
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy về trang chủ để tiếp tục mua sắm.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#5433eb', color: '#fff', borderRadius: 9999,
                padding: '10px 22px', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                boxShadow: 'rgba(69,36,219,0.34) 0px 4px 24px 0px',
              }}
            >
              Về trang chủ →
            </a>
            <a
              href="/shop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#fff', color: '#000', borderRadius: 9999, border: '1px solid #ebebeb',
                padding: '10px 22px', fontSize: 13, fontWeight: 500, textDecoration: 'none',
              }}
            >
              Khám phá cửa hàng
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
