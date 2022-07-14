import ErrorHandling from '@/components/ErrorHandling';
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios';
import { Button, Card, Grid, Group, LoadingOverlay, MultiSelect, Stack, TextInput, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useForm } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Check, X } from 'tabler-icons-react';

export default function RoleCreate({ permissions, errors }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter()
  const form = useForm({
    initialValues: {
      name: '',
      permissions: []
    }
  })
  const Submit = async () => {
    setVisible(true)
    try {
      const { data } = await axios.post('/api/role', form.values)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal'
      })
      setTimeout(() => {
        router.push('/master/role')
      }, 500)
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
  return (

    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card p='xl' shadow="sm">
        <Card.Section p='md'>
          <Group position='apart'>
            <Button variant='filled' onClick={() => router.push('/master/role')}>
              back
            </Button>
            <Title order={5}>Create new Role</Title>
          </Group>
        </Card.Section>
        <form onSubmit={form.onSubmit(Submit)}>
          <Stack spacing="xl">
            <Group>
              <Grid columns={12}>
                <Grid.Col span={12}>
                  <TextInput id="name" label="name" placeholder='name' {...form.getInputProps('name')} />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Group position='left'>
                    <Button onClick={() => form.setFieldValue('permissions', permissions.map(item => item.value))}>select all</Button>
                    <Button onClick={() => form.setFieldValue('permissions', [])}>deselect all</Button>
                  </Group>
                  <MultiSelect id="permissions" label="permissions" searchable data={permissions} {...form.getInputProps('permissions')} />
                </Grid.Col>
              </Grid>
            </Group>
          </Stack>
          <Card.Section pt='xl'>
            <Group position='right'>
              <Button type='reset' color={'red'} onClick={form.reset}>reset</Button>
              <Button type='submit' color={'green'}>submit</Button>
            </Group>
          </Card.Section>
        </form>
      </Card>
      {/* ...other content */}
    </div>
  )
}

RoleCreate.getLayout = page => <AppLayout children={page} />

export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/permission', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie
      }
    })

    const permissions = data.map((permission) => {
      return {
        'value': String(permission.id),
        'label': String(permission.name)
      }
    })
    return {
      props: {
        permissions: permissions,
        errors: null
      }
    }
  } catch (error) {
    return {
      props: {
        permissions: null,
        errors: JSON.parse(JSON.stringify(error)),
      }
    }
  }
}