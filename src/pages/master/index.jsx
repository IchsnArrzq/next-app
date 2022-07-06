import AppLayout from '@/components/Layouts/AppLayout'
import { Card, Title } from '@mantine/core'
import React from 'react'

export default function MasterIndex() {
    return (
        <Card>
            <Title order={5}>Master Menu</Title>
        </Card>
    )
}
MasterIndex.getLayout = page => <AppLayout children={page} />
