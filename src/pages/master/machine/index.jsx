import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Group, Table, Title } from '@mantine/core'
import React from 'react'

export default function MachineIndex({machines}) {
    return (
        <Card px='xl' py='xl' shadow="sm">
            <Card.Section p="md">
                <Group position='apart'>
                    <Title order={3}>Machine List</Title>
                    <Button variant='filled' onClick={() => router.push('/master/product/create')}>
                        create
                    </Button>
                </Group>
            </Card.Section>
            <Table>
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
                        machines.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td>{value.id}</td>
                                    <td>{value.id}</td>
                                    <td>{value.id}</td>
                                    <td>{value.id}</td>
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

MachineIndex.getLayout = page => <AppLayout children={page} />
MachineIndex.getInitialProps = async () => {
    const { data } = await axios.get('machine')
    return {
        machines: data
    }
}