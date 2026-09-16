'use client'
import ErrorUI from '@/components/ErrorUI'

export default function AdminError({ error, retry }) {
  return <ErrorUI error={error} retry={retry} backHref="/admin" backLabel="← Về trang Admin" context="admin" />
}
