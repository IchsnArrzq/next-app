import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'
import { Button, Card, Group, Table, Title } from '@mantine/core'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

export default function UserIndex({ users }) {
    const router = useRouter()
    return (
        <Card px='xl' py='xl' shadow="sm">
            <Card.Section p="md">
                <Group position='apart'>
                    <Title order={3}>User List</Title>
                    <Button variant='filled' onClick={() => router.push('/master/user/create')}>
                        create
                    </Button>
                </Group>
            </Card.Section>
            <Table>
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
                                <tr key={index}>
                                    <td>{value.name}</td>
                                    <td>{value.email}</td>
                                    <td>
                                        <ul>

                                            {value.roles.map((role, id) => {
                                                return (
                                                    <li>{role.name}</li>
                                                )
                                            })}
                                        </ul>
                                    </td>
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

UserIndex.getLayout = page => <AppLayout children={page} />
UserIndex.getInitialProps = async () => {
    const { data } = await axios.get('user')
    return {
        users: data
    }
}