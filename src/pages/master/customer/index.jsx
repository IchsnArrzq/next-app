import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState } from 'react'
import { Card, Title, Table, Grid, Group, Button, LoadingOverlay } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import axios from '@/lib/axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Check, X } from 'tabler-icons-react'

export default function CustomerIndex({ customers }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const Delete = async id => {
        setVisible(true)
        try {
            const { data } = await axios.delete(`/customer/${id}`)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            router.push('/master/customer')
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
        router.push(`/master/customer/${id}`)
    }
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card px='xl' py='xl' shadow="sm">
                <Card.Section p="md">
                    <Group position='apart'>
                        <Title order={5}>Customer List</Title>
                        <Button variant='filled' onClick={() => router.push('/master/customer/create')}>
                            create
                        </Button>
                    </Group>
                </Card.Section>
                <Table verticalSpacing="xs" fontSize="xs">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>email</th>
                            <th>alias</th>
                            <th>pic</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers.map((value, index) => {
                                return (
                                    <tr key={value.id}>
                                        <td>{value.user.name}</td>
                                        <td>{value.user.email}</td>
                                        <td>{value.alias}</td>
                                        <td>{value.pic}</td>
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
CustomerIndex.getInitialProps = async () => {
    const { data } = await axios.get('/customer')
    return {
        customers: data
    }
}
CustomerIndex.getLayout = page => <AppLayout children={page} />