import AppLayout from '@/components/Layouts/AppLayout'
import { Card, Title } from '@mantine/core'
import React from 'react'

export default function ActivityIndex() {
    return (
        <Card>
            <Title order={5}>Activity Menu</Title>
        </Card>
    )
}
ActivityIndex.getLayout = page => <AppLayout children={page} />
