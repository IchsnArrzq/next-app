import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Laravel - Dashboard</title>
            </Head>
            You're logged in!
        </>
    )
}

Dashboard.getLayout = page => <AppLayout children={page} />
