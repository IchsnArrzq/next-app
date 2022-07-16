import AppLayout from '@/components/Layouts/AppLayout'
import {
    Button,
    Card,
    Grid,
    Group,
    LoadingOverlay,
    MultiSelect,
    PasswordInput,
    Stack,
    TextInput,
    Title,
} from '@mantine/core'
import {
    showNotification,
    cleanNotificationsQueue,
    cleanNotifications,
} from '@mantine/notifications'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import axios from '@/lib/axios'
import { Check, X } from 'tabler-icons-react'

export default function UserCreate({ roles }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false)
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            roles: [],
        },
        validate: {
            name: 'asd',
            email: 'asd',
            password: 'asd',
            roles: 'asd',
        },
    })

    const Submit = async () => {
        setVisible(true)
        try {
            const { data } = await axios.post('/api/user', form.values)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal',
            })
            setTimeout(() => {
                router.push('/master/user')
            }, 500)
        } catch (error) {
            if (error.response) {
                showNotification({
                    title: `${error.response.statusText ?? 'error'} ${
                        error.response.status ?? 500
                    }`,
                    message: `${error.response.data.message ?? 'error'}`,
                    icon: <X />,
                    color: 'red',
                })
            }
        } finally {
            setVisible(false)
        }
    }
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card p="xl" shadow="sm">
                <Card.Section p="md">
                    <Group position="apart">
                        <Button
                            variant="filled"
                            onClick={() => router.push('/master/user')}>
                            back
                        </Button>
                        <Title order={5}>Create new User</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={form.onSubmit(Submit)}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col span={5}>
                                    <TextInput
                                        id="name"
                                        label="name"
                                        placeholder="name"
                                        {...form.getInputProps('name')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        label="email"
                                        placeholder="email"
                                        {...form.getInputProps('email')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <PasswordInput
                                        id="password"
                                        label="password"
                                        placeholder="password"
                                        {...form.getInputProps('password')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <MultiSelect
                                        id="roles"
                                        label="roles"
                                        searchable
                                        data={roles}
                                        {...form.getInputProps('roles')}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Group>
                    </Stack>
                    <Card.Section pt="xl">
                        <Group position="right">
                            <Button
                                type="reset"
                                color={'red'}
                                onClick={form.reset}>
                                reset
                            </Button>
                            <Button type="submit" color={'green'}>
                                submit
                            </Button>
                        </Group>
                    </Card.Section>
                </form>
            </Card>
        </div>
    )
}

UserCreate.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('/api/role', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie,
            },
        })

        const roles = data.map(role => {
            return {
                value: String(role.id),
                label: String(role.name),
            }
        })
        return {
            props: {
                roles: roles,
            },
        }
    } catch (error) {
        return {
            props: {
                roles: null,
            },
        }
    }
}
