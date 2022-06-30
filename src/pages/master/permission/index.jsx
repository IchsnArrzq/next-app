import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'
import { Button, Card, Group, Table, Title } from '@mantine/core'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

export default function PermissionIndex({permissions}) {
    const router = useRouter()
    return (
        <Card px='xl' py='xl' shadow="sm">
            <Card.Section p="md">
                <Group position='apart'>
                    <Title order={3}>Permission List</Title>
                    <Button variant='filled' onClick={() => router.push('/master/permission/create')}>
                        create
                    </Button>
                </Group>
            </Card.Section>
            <Table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        permissions.map((value, index) => {
                            console.log(value)
                            return  (
                                <tr key={index}>
                                    <td>{value.name}</td>
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
PermissionIndex.getLayout = page => <AppLayout children={page} />
PermissionIndex.getInitialProps = async () => {
    const { data } = await axios.get('permission')
    console.log(data)
    return {
        permissions: data
    }
}