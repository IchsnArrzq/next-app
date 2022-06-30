import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState } from 'react'
import { Card, Title, Table, Grid, Group, Button } from '@mantine/core'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function CustomerIndex({ customers }) {
    const router = useRouter()
    return (
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
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        customers.map((value, index) => {
                            return  (
                                <tr key={index}>
                                    <td>{value.user.name}</td>
                                    <td>{value.user.email}</td>
                                    <td>{value.alias}</td>
                                    <td>
                                        <Group>
                                            <Button color={'yellow'}>edit</Button>
                                            <Button color={'red'}>delete</Button>
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
CustomerIndex.getInitialProps = async () => {
    const { data } = await axios.get('/customer')
    return {
        customers: data
    }
}
CustomerIndex.getLayout = page => <AppLayout children={page} />