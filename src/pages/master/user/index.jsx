import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'
import { Button, Card, Group, Table, Title } from '@mantine/core'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

export default function UserIndex({ users }) {
    const router = useRouter()
    const Delete = async e => {
        try {
            const { data } = await axios.delete(`/user/${e.target.getAttribute('id')}`)
            router.push('/master/user')
        } catch (error) {
            console.log(error.response)
        }
    }
    const Edit = async e => {
        if (e.target.getAttribute('id')) {
            router.push(`/master/user/${e.target.getAttribute('id')}`)
        }
    }
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
                                <tr key={value.id}>
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

UserIndex.getLayout = page => <AppLayout children={page} />
UserIndex.getInitialProps = async () => {
    const { data } = await axios.get('user')
    return {
        users: data
    }
}