'use client'
import ErrorUI from '@/components/ErrorUI'

export default function ShopError({ error, retry }) {
  return <ErrorUI error={error} retry={retry} backHref="/shop" backLabel="← Quay lại cửa hàng" context="shop" />
}
