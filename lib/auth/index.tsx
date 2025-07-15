// components/MirageProvider.tsx
'use client'

import { useEffect } from 'react'
import { startMirage } from '../db/mirage-client'

export default function MirageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Start MirageJS server on component mount
    startMirage()
  }, [])

  return <>{children}</>
}