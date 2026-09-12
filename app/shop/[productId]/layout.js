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

export default function ProductLayout({ children }) {
  return children
}
