'use client'
import ErrorUI from '@/components/ErrorUI'

export default function DashboardError({ error, retry }) {
  return <ErrorUI error={error} retry={retry} backHref="/dashboard" backLabel="← Về dashboard" context="dashboard" />
}
