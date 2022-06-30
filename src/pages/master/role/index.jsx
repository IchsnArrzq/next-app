import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'
import { Button, Card, Group, Table, Title } from '@mantine/core'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

export default function RoleIndex({ roles }) {
  const router = useRouter()
  return (
    <Card px='xl' py='xl' shadow="sm">
      <Card.Section p="md">
        <Group position='apart'>
          <Title order={3}>Role List</Title>
          <Button variant='filled' onClick={() => router.push('/master/role/create')}>
            create
          </Button>
        </Group>
      </Card.Section>
      <Table>
        <thead>
          <tr>
            <th>name</th>
            <th>guard name</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {
            roles.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value.name}</td>
                  <td>{value.guard_name}</td>
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
RoleIndex.getLayout = page => <AppLayout children={page} />
RoleIndex.getInitialProps = async () => {
  const { data } = await axios.get('role')
  return {
    roles: data
  }
}