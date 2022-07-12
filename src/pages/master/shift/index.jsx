import ErrorHandling from '@/components/ErrorHandling';
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import Login from '@/pages/login';
import { ActionIcon, Button, Card, Group, LoadingOverlay, Table, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react'
import { ArrowNarrowDown, ArrowNarrowUp, Check, X } from 'tabler-icons-react';

export default function ShiftIndex({ shifts, context, errors }) {
    console.log(errors)
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const Delete = async id => {
        setVisible(true)
        try {
            const { data } = await axios.delete(`/api/shift/${id}`)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            router.push('/master/shift')
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
    const Edit = async id => {
        router.push(`/master/shift/${id}`)
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
                        <Title order={5}>Shift List</Title>
                        <Button variant='filled' onClick={() => router.push('/master/shift/create')}>
                            create
                        </Button>
                    </Group>
                </Card.Section>
                <Table verticalSpacing="xs" fontSize="xs">
                    <thead>
                        <tr>
                            <th>
                                no
                            </th>
                            <th>
                                name
                            </th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            shifts.map((value, index) => {
                                return (
                                    <tr key={value.id}>
                                        <td>{index + 1}</td>
                                        <td>{value.name}</td>
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

ShiftIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('/api/shift', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })
        return {
            props: {
                shifts: data,
                errors: null
            }
        }
    } catch (error) {
        return {
            props: {
                shifts: null,
                errors: JSON.parse(JSON.stringify(error)),
            }
        }
    }
}
