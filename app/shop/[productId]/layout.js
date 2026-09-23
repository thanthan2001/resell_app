import { getCatalog } from '@/lib/source-api'

export async function generateMetadata({ params }) {
  const { productId } = await params

  try {
    const data = await getCatalog()
    const product = (data.products || []).find((p) => p.id === productId)

    if (!product) {
      return {
        title: 'Sản phẩm không tìm thấy | socialTech',
      }
    }

    const title = `${product.name} — Bản Quyền Chính Hãng`
    const description = product.description
      ? product.description.slice(0, 160).replace(/\n/g, ' ')
      : `Mua tài khoản ${product.name} giá rẻ, bảo hành trọn chu kỳ, kích hoạt tự động 24/7 qua VietQR.`

    return {
      title,
      description,
      openGraph: {
        title: `${title} | socialTech`,
        description,
        images: product.image ? [{ url: product.image }] : [],
      },
    }
  } catch (e) {
    return {
      title: 'Chi Tiết Sản Phẩm | socialTech',
    }
  }
}

export default async function ProductLayout({ children, params }) {
  const { productId } = await params
  let productJsonLd = null

  try {
    const data = await getCatalog()
    const product = (data.products || []).find((p) => p.id === productId)
    if (product) {
      const price = product.sellPrice || product.price || 0
      productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `${product.name} chính hãng kích hoạt tự động qua VietQR`,
        image: product.image ? [product.image] : [],
        offers: {
          '@type': 'Offer',
          url: `https://socialtech.vn/shop/${product.id}`,
          priceCurrency: 'VND',
          price: price,
          availability: product.available !== 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      }
    }
  } catch (e) {
    // Ignore schema on error
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
