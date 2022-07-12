import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState } from 'react'
import { Button, Card, Group, LoadingOverlay, Table, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
import { Check, X } from 'tabler-icons-react';
import ErrorHandling from '@/components/ErrorHandling';

export default function ProductIndex({ products, errors }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const Delete = async id => {
        setVisible(true)
        try {
            const { data } = await axios.delete(`/api/product/${id}`)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            router.push('/master/product')
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
        router.push(`/master/product/${id}`)
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
                        <Title order={5}>Product List</Title>
                        <Button variant='filled' onClick={() => router.push('/master/product/create')}>
                            create
                        </Button>
                    </Group>
                </Card.Section>
                <Table verticalSpacing="xs" fontSize="xs">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>email</th>
                            <th>part name</th>
                            <th>part number</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((value, index) => {
                                return (
                                    <tr key={value.id}>
                                        <td>{value.customer.user.name}</td>
                                        <td>{value.customer.user.email}</td>
                                        <td>{value.part_name}</td>
                                        <td>{value.part_number}</td>
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
ProductIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('/api/product', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })
        return {
            props: {
                products: data,
                errors: null,
            }
        }
    } catch (error) {
        return {
            props: {
                products: null,
                errors: JSON.parse(JSON.stringify(error)),
            }
        }
    }
}
