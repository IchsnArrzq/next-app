import AppLayout from '@/components/Layouts/AppLayout'
import { Card, Grid, Group, Stack, ThemeIcon, Title, UnstyledButton } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { Accessible, BuildingFactory2, BuildingStore, Clock, License, MoodHappy, Users } from 'tabler-icons-react'

export default function MasterIndex() {
    const router = useRouter()
    return (
        <Card p={'xl'}>
            <Title mb={'xl'} order={5}>Master Menu</Title>
            <Grid>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/user')}>
                        <Group position='apart'>
                            <Title order={6}>
                                users
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <Users size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/customer')}>
                        <Group position='apart'>
                            <Title order={6}>
                                customers
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <MoodHappy size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/role')}>
                        <Group position='apart'>
                            <Title order={6}>
                                roles
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <Accessible size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/permission')}>
                        <Group position='apart'>
                            <Title order={6}>
                                permissions
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <License size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/product')}>
                        <Group position='apart'>
                            <Title order={6}>
                                product
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <BuildingStore size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/machine')}>
                        <Group position='apart'>
                            <Title order={6}>
                                machine
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <BuildingFactory2 size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4}>
                    <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/shift')}>
                        <Group position='apart'>
                            <Title order={6}>
                                shift
                            </Title>
                            <ThemeIcon color="violet" variant="light">
                                <Clock size={14} />
                            </ThemeIcon>
                        </Group>
                    </UnstyledButton>
                </Grid.Col>
            </Grid>
        </Card>
    )
}
MasterIndex.getLayout = page => <AppLayout children={page} />
