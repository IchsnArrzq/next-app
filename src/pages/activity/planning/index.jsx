import ErrorHandling from '@/components/ErrorHandling'
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import {
    Button,
    Card,
    Group,
    LoadingOverlay,
    Table,
    Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Check, X } from 'tabler-icons-react'

export default function PlanningIndex({ plannings, errors }) {
    console.log(plannings)
    const router = useRouter()
    const [visible, setVisible] = useState(false)
    const Delete = async id => {
        setVisible(true)
        try {
            const { data } = await axios.delete(`/api/planning/${id}`)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal',
            })
            setTimeout(() => {
                router.push('/activity/planning')
            }, 500)
        } catch (error) {
            showNotification({
                title: `${error.response.statusText ?? 'error'} ${
                    error.response.status ?? 500
                }`,
                message: `${error.response.data.message ?? 'error'}`,
                icon: <X />,
                color: 'red',
            })
        } finally {
            setVisible(false)
        }
    }
    const Edit = async id => {
        router.push(`/activity/planning/${id}`)
    }
    if (errors) {
        return <ErrorHandling errors={errors} />
    }
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card px="xl" py="xl" shadow="sm">
                <Card.Section p="md">
                    <Group position="apart">
                        <Title order={5}>Planning List</Title>
                        <Button
                            variant="filled"
                            onClick={() =>
                                router.push('/activity/planning/create')
                            }>
                            create
                        </Button>
                    </Group>
                </Card.Section>
                <Table verticalSpacing="xs" fontSize="xs">
                    <thead>
                        <tr>
                            <th>machine</th>
                            <th>product</th>
                            <th>qty planning</th>
                            <th>shift</th>
                            <th>date time in</th>
                            <th>date time out</th>
                            <th>total hour</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plannings.map((value, index) => {
                            return (
                                <tr key={value.id}>
                                    <td>{value.machine.name}</td>
                                    <td>{value.product.part_name}</td>
                                    <td>{value.qty_planning}</td>
                                    <td>{value.shift.name}</td>
                                    <td>{value.datetimein}</td>
                                    <td>{value.datetimeout}</td>
                                    <td>{value.total}</td>
                                    <td>
                                        <Group>
                                            <Button
                                                color={'yellow'}
                                                id={value.id}
                                                onClick={() => Edit(value.id)}>
                                                edit
                                            </Button>
                                            <Button
                                                color={'red'}
                                                id={value.id}
                                                onClick={() =>
                                                    Delete(value.id)
                                                }>
                                                delete
                                            </Button>
                                        </Group>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        </div>
    )
}

PlanningIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('/api/planning', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie,
            },
        })
        return {
            props: {
                plannings: data,
                errors: null,
            },
        }
    } catch (error) {
        return {
            props: {
                plannings: null,
                errors: JSON.parse(JSON.stringify(error)),
            },
        }
    }
}
