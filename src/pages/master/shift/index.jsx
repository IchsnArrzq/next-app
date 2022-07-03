import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { ActionIcon, Button, Card, Group, Table, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useRouter } from 'next/router'
import React from 'react'
import { ArrowNarrowDown, ArrowNarrowUp, Check, X } from 'tabler-icons-react';

export default function ShiftIndex({ shifts }) {
    const router = useRouter()
    const Delete = async e => {
        try {
            const { data } = await axios.delete(`/shift/${e.target.getAttribute('id')}`)
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
        }
    }
    const Edit = async e => {
        if (e.target.getAttribute('id')) {
            router.push(`/master/shift/${e.target.getAttribute('id')}`)
        }
    }
    return (
        <Card px='xl' py='xl' shadow="sm">
            <Card.Section p="md">
                <Group position='apart'>
                    <Title order={3}>Shift List</Title>
                    <Button variant='filled' onClick={() => router.push('/master/shift/create')}>
                        create
                    </Button>
                </Group>
            </Card.Section>
            <Table highlightOnHover>
                <thead>
                    <tr>
                        <th>
                            <Group spacing={'xs'}>
                                <ActionIcon><ArrowNarrowUp /> </ActionIcon>
                                <ActionIcon><ArrowNarrowDown /> </ActionIcon>
                            </Group></th>
                        <th>
                            name
                        </th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        shifts.reverse().map((value, index) => {
                            return (
                                <tr key={value.id}>
                                    <td>{index + 1}</td>
                                    <td>{value.name}</td>
                                    <td>
                                        <Group>
                                            <Button color={'yellow'} id={value.id} onClick={Edit}>edit</Button>
                                            <Button color={'red'} id={value.id} onClick={Delete}>delete</Button>
                                        </Group>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </Card>
    )
}

ShiftIndex.getLayout = page => <AppLayout children={page} />
ShiftIndex.getInitialProps = async () => {
    const { data } = await axios.get('/shift')
    return {
        shifts: data
    }
}
