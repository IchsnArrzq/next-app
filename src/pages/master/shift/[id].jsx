import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, LoadingOverlay, Notification, Stack, TextInput, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check, X } from 'tabler-icons-react';

export default function ShiftEdit() {
    const router = useRouter()
    const { id } = router.query
    const [visible, setVisible] = useState(false);
    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    const Find = async () => {
        setVisible(true)
        try {
            const { data } = await axios.get(`/api/shift/${id}/edit`)
            form.setValues(data)
        } catch (error) {
            showNotification({
                title: `${error.response.statusText ?? 'error'} ${error.response.status ?? 500}`,
                message: `${error.response.data.message ?? 'error'}`,
                icon: <X />,
                color: 'red'
            })
        } finally {
            setVisible(false)
        }
    }

    const Submit = async () => {
        setVisible(true)
        try {
            const { data } = await axios.put(`'/api/shift/${id}`, form.values)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            setTimeout(() => {
                router.push('/master/shift')
            }, 500)
        } catch (error) {
            showNotification({
                title: `${error.response.statusText ?? 'error'} ${error.response.status ?? 500}`,
                message: `${error.response.data.message ?? 'error'}`,
                icon: <X />,
                color: 'red'
            })
        } finally {
            setVisible(false)
        }
    }
    useEffect(() => {
        Find()
    }, [])
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card p='xl' shadow="sm">
                <Card.Section p='md'>
                    <Group position='apart'>
                        <Button variant='filled' onClick={() => router.push('/master/shift')}>
                            back
                        </Button>
                        <Title order={5}>last updated {form.values.updated_at}</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={form.onSubmit(Submit)}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col span={4}>
                                    <TextInput id="name" label="name" placeholder='name' {...form.getInputProps('name')} />
                                </Grid.Col>
                            </Grid>
                        </Group>
                    </Stack>
                    <Card.Section pt='xl'>
                        <Group position='right'>
                            <Button type='reset' color={'red'} onClick={form.reset}>reset</Button>
                            <Button type='submit' color={'green'}>submit</Button>
                        </Group>
                    </Card.Section>
                </form>
            </Card>
        </div>
    )
}
ShiftEdit.getLayout = page => <AppLayout children={page} />
