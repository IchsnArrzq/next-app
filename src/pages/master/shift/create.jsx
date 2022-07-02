import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, LoadingOverlay, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function ShiftCreate() {
  const [visible, setVisible] = useState(false);
  const router = useRouter()
  const form = useForm({
    initialValues: {
      name: ''
    }
  })
  const Submit = async e => {
    setVisible(true)
    e.preventDefault()
    try {
      const { data } = await axios.post('shift', form.values)
      setVisible(false)
      router.push('/master/shift')
    } catch (error) {
      setVisible(false)
      console.log(error.response)
    }
  }
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card p='xl' shadow="sm">
        <Card.Section p='md'>
          <Group position='apart'>
            <Button variant='filled' onClick={() => router.push('/master/shift')}>
              back
            </Button>
            <Title order={3}>Create new Shift</Title>
          </Group>
        </Card.Section>
        <form onSubmit={Submit}>
          <Stack spacing="xl">
            <Group>
              <Grid grow>
                <Grid.Col span={4}>
                  <TextInput id="name" label="name" placeholder='name' {...form.getInputProps('name')} />
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

ShiftCreate.getLayout = page => <AppLayout children={page} />