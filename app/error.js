'use client'
import ErrorUI from '@/components/ErrorUI'

export default function RootError({ error, retry }) {
  return <ErrorUI error={error} retry={retry} backHref="/" backLabel="← Về trang chủ" context="root" />
}
