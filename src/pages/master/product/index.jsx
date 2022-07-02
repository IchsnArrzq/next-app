import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'
import { Button, Card, Group, Table, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'

export default function ProductIndex({ products }) {
    const router = useRouter()
    const Delete = async e => {
        try {
            const { data } = await axios.delete(`/product/${e.target.getAttribute('id')}`)
            router.push('/master/product')
        } catch (error) {
            console.log(error.response)
        }
    }
    const Edit = async e => {
        if (e.target.getAttribute('id')) {
            router.push(`/master/product/${e.target.getAttribute('id')}`)
        }
    }
    return (
        <Card px='xl' py='xl' shadow="sm">
            <Card.Section p="md">
                <Group position='apart'>
                    <Title order={3}>Product List</Title>
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
                        products.map((value, index) => {
                            return (
                                <tr key={value.id}>
                                    <td>{value.customer.user.name}</td>
                                    <td>{value.customer.user.email}</td>
                                    <td>{value.part_name}</td>
                                    <td>{value.part_number}</td>
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
ProductIndex.getLayout = page => <AppLayout children={page} />
ProductIndex.getInitialProps = async () => {
    const { data } = await axios.get('product')
    return {
        products: data
    }
}

