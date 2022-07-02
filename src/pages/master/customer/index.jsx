import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState } from 'react'
import { Card, Title, Table, Grid, Group, Button, LoadingOverlay } from '@mantine/core'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function CustomerIndex({ customers }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const Delete = async e => {
        setVisible(true)
        try {
            const { data } = await axios.delete(`/customer/${e.target.getAttribute('id')}`)
            setVisible(false)
            router.push('/master/customer')
        } catch (error) {
            setVisible(false)
            console.log(error.response)
        }
    }
    const Edit = async e => {
        if (e.target.getAttribute('id')) {
            router.push(`/master/customer/${e.target.getAttribute('id')}`)
        }
    }
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card px='xl' py='xl' shadow="sm">
                <Card.Section p="md">
                    <Group position='apart'>
                        <Title order={3}>Customer List</Title>
                        <Button variant='filled' onClick={() => router.push('/master/customer/create')}>
                            create
                        </Button>
                    </Group>
                </Card.Section>
                <Table>
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