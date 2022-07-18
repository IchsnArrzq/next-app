import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import GuestLayout from '@/components/Layouts/GuestLayout'
import { LoadingOverlay } from '@mantine/core'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })
    const router = useRouter()
    useEffect(() => {
        router.push('/login')   
    }, [])
    return (
        <div style={{ width: 400, position: 'relative' }}>
            <LoadingOverlay visible={true} />
            {/* ...other content */}
        </div>
    )
}

Home.getLayout = page => <GuestLayout children={page} />
