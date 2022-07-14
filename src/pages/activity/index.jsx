import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { Card, Grid, Group, ThemeIcon, Title, UnstyledButton } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { CalendarStats, DeviceDesktopAnalytics } from 'tabler-icons-react'

export default function ActivityIndex() {
    const router = useRouter()
    return (
        <Card>
            <Title mb={'xl'} order={5}>Activity Menu</Title>
            <Grid>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/activity/machine')}>
                        <Group position='apart'>
                            <Title order={6}>
                                Machine Monitor
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <DeviceDesktopAnalytics size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/activity/planning')}>
                        <Group position='apart'>
                            <Title order={6}>
                                Planning Machine
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <CalendarStats size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
            </Grid>
        </Card>
    )
}
ActivityIndex.getLayout = page => <AppLayout children={page} />
