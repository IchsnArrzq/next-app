import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState } from 'react'
import { Button, Card, Group, LoadingOverlay, Table, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { Check, X } from 'tabler-icons-react';

export default function RoleIndex({ roles }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false);
  const Delete = async id => {
    setVisible(true)
    try {
      const { data } = await axios.delete(`/role/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal'
      })
      router.push('/master/role')
    } catch (error) {
      if (error.response) {
        showNotification({
          title: `${error.response.statusText ?? 'error'} ${error.response.status ?? 500}`,
          message: `${error.response.data.message ?? 'error'}`,
          icon: <X />,
          color: 'red'
        })
      }
    } finally {
      setVisible(false)
    }
  }
  const Edit = async id => {
    router.push(`/master/role/${id}`)
  }
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px='xl' py='xl' shadow="sm">
        <Card.Section p="md">
          <Group position='apart'>
            <Title order={5}>Role List</Title>
            <Button variant='filled' onClick={() => router.push('/master/role/create')}>
              create
            </Button>
          </Group>
        </Card.Section>
        <Table verticalSpacing="xs" fontSize="xs">
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
                  <tr key={value.id}>
                    <td>{value.name}</td>
                    <td>{value.guard_name}</td>
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
RoleIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
      const { data } = await axios.get('/api/role', {
          headers: {
              origin: process.env.ORIGIN,
              Cookie: context.req.headers.cookie
          }
      })
      return {
          props: {
              roles: data,
          }
      }
  } catch (error) {
      return {
          props: {
              roles: null
          }
      }
  }
}