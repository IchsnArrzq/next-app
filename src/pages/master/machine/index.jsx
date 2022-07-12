import ErrorHandling from '@/components/ErrorHandling';
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Group, LoadingOverlay, Table, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Check, X } from 'tabler-icons-react';

export default function MachineIndex({ machines, errors }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const Delete = async id => {
        setVisible(true)
        try {
            const { data } = await axios.delete(`/machine/${id}`)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            router.push('/master/machine')
        } catch (error) {
            if (error.response) {
                showNotification({
                    title: `${error.response.statusText ?? 'error'} ${error.response.status ?? 500}`,
                    message: `${error.response.data.message ?? 'error'}`,
                    icon: <X />,
                    color: 'red'
                })
            }
        } finally {
            setVisible(false)
        }
    }
    const Edit = async id => {
        router.push(`/master/machine/${id}`)
    }
    if (errors) {
        return <ErrorHandling errors={errors} />
    }
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card px='xl' py='xl' shadow="sm">
                <Card.Section p="md">
                    <Group position='apart'>
                        <Title order={5}>Machine List</Title>
                        <Button variant='filled' onClick={() => router.push('/master/machine/create')}>
                            create
                        </Button>
                    </Group>
                </Card.Section>
                <Table verticalSpacing="xs" fontSize="xs">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>number</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            machines.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{value.name}</td>
                                        <td>{value.number}</td>
                                        <td>
                                            <Group>
                                                <Button color={'yellow'} id={value.id} onClick={() => Edit(value.id)}>edit</Button>
                                                <Button color={'red'} id={value.id} onClick={() => Delete(value.id)}>delete</Button>
                                            </Group>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Card>
        </div>
    )
}

MachineIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('/api/machine', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })
        return {
            props: {
                machines: data,
                errors: null,
            }
        }
    } catch (error) {
        return {
            props: {
                machines: null,
                errors: JSON.parse(JSON.stringify(error)),
            }
        }
    }
}
