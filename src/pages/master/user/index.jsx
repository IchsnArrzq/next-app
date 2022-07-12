import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState } from 'react'
import { Button, Card, Group, LoadingOverlay, Table, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { Check, X } from 'tabler-icons-react';
import ErrorHandling from '@/components/ErrorHandling';

export default function UserIndex({ users, errors }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const Delete = async id => {
        setVisible(true)
        try {
            const { data } = await axios.delete(`/api/user/${id}`)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            setTimeout(() => {
                router.push('/master/user')
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
    const Edit = async id => {
        router.push(`/master/user/${id}`)
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
                        <Title order={5}>User List</Title>
                        <Button variant='filled' onClick={() => router.push('/master/user/create')}>
                            create
                        </Button>
                    </Group>
                </Card.Section>
                <Table verticalSpacing="xs" fontSize="xs">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>email</th>
                            <th>roles</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((value, index) => {
                                return (
                                    <tr key={value.id}>
                                        <td>{value.name}</td>
                                        <td>{value.email}</td>
                                        <td>
                                            <ul>

                                                {value.roles.map((role, id) => {
                                                    return (
                                                        <li key={role.id}>{role.name}</li>
                                                    )
                                                })}
                                            </ul>
                                        </td>
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

UserIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('/api/user', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })
        return {
            props: {
                users: data,
                errors: null
            }
        }
    } catch (error) {
        return {
            props: {
                users: null,
                errors: JSON.parse(JSON.stringify(error))
            }
        }
    }
}
