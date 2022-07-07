import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { Card, Title } from '@mantine/core'
import React, { useEffect } from 'react'

export default function ActivityIndex() {
    const { user, logout } = useAuth({ middleware: 'auth' })
    useEffect(async () => {
        // const { data } = await axios.get('/api/user')
        console.log(user)
    }, [])
    return (
        <Card>
            <Title order={5}>Activity Menu</Title>
        </Card>
    )
}
ActivityIndex.getLayout = page => <AppLayout children={page} />
