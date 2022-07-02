import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Group, Table, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'

export default function ShiftIndex({ shifts }) {
  const router = useRouter()
  const Delete = async e => {
    try {
      const { data } = await axios.delete(`/shift/${e.target.getAttribute('id')}`)
      router.push('/master/shift')
    } catch (error) {
      console.log(error.response)
    }
  }
  const Edit = async e => {
    if (e.target.getAttribute('id')) {
      router.push(`/master/shift/${e.target.getAttribute('id')}`)
    }
  }
  return (
    <Card px='xl' py='xl' shadow="sm">
      <Card.Section p="md">
        <Group position='apart'>
          <Title order={3}>Shift List</Title>
          <Button variant='filled' onClick={() => router.push('/master/shift/create')}>
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
            shifts.map((value, index) => {
              return (
                <tr  key={value.id}>
                  <td>{value.name}</td>
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

ShiftIndex.getLayout = page => <AppLayout children={page} />
ShiftIndex.getInitialProps = async () => {
  const { data } = await axios.get('/shift')
  return {
    shifts: data
  }
}