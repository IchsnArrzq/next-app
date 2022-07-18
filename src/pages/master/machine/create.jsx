import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import {
  Button,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import {
  showNotification,
  cleanNotificationsQueue,
  cleanNotifications,
} from '@mantine/notifications'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Check, X } from 'tabler-icons-react'
import { DatePicker } from '@mantine/dates'
import dayjs from 'dayjs'

export default function MachineCreate({ category_machines }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const form = useForm({
    initialValues: {
      name: '',
      number: '',
      category_machine_id: '',
      code: '',
      brand: '',
      purchase_date: '',
      manufacture_date: '',
      stroke: '',
      production_area: '',
    },
  })
  const Submit = async () => {
    form.setFieldValue(
      'purchase_date',
      dayjs(form.values.purchase_date).format('YYYY-MM-DD'),
    )
    form.setFieldValue(
      'manufacture_date',
      dayjs(form.values.manufacture_date).format('YYYY-MM-DD'),
    )
    setVisible(true)
    try {
      const { data } = await axios.post('/api/machine', form.values)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      setTimeout(() => {
        router.push('/master/machine')
      }, 500)
    } catch (error) {
      showNotification({
        title: `${error.response.statusText ?? 'error'} ${
          error.response.status ?? 500
        }`,
        message: `${error.response.data.message ?? 'error'}`,
        icon: <X />,
        color: 'red',
      })
    } finally {
      setVisible(false)
    }
  }
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card p="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Button
              variant="filled"
              onClick={() => router.push('/master/machine')}>
              back
            </Button>
            <Title order={5}>Create new Machine</Title>
          </Group>
        </Card.Section>
        <form onSubmit={form.onSubmit(Submit)}>
          <Stack spacing="xl">
            <Group>
              <Grid grow>
                <Grid.Col span={4}>
                  <Select
                    required
                    searchable
                    id="category_machines"
                    label="category_machines"
                    data={category_machines}
                    {...form.getInputProps('category_machine_id')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    id="name"
                    label="name"
                    placeholder="name"
                    {...form.getInputProps('name')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    id="number"
                    label="number"
                    placeholder="number"
                    {...form.getInputProps('number')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    id="code"
                    label="code"
                    placeholder="code"
                    {...form.getInputProps('code')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    id="brand"
                    label="brand"
                    placeholder="brand"
                    {...form.getInputProps('brand')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <DatePicker
                    id="purchase_date"
                    label="purchase_date"
                    placeholder="purchase_date"
                    {...form.getInputProps('purchase_date')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <DatePicker
                    id="manufacture_date"
                    label="manufacture_date"
                    placeholder="manufacture_date"
                    {...form.getInputProps('manufacture_date')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    id="stroke"
                    label="stroke"
                    defaultValue={0.5}
                    precision={2}
                    step={0.5}
                    placeholder="stroke"
                    {...form.getInputProps('stroke')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    id="production_area"
                    label="production_area"
                    placeholder="production_area"
                    {...form.getInputProps('production_area')}
                  />
                </Grid.Col>
              </Grid>
            </Group>
          </Stack>
          <Card.Section pt="xl">
            <Group position="right">
              <Button type="reset" color={'red'} onClick={form.reset}>
                reset
              </Button>
              <Button type="submit" color={'green'}>
                submit
              </Button>
            </Group>
          </Card.Section>
        </form>
      </Card>
    </div>
  )
}

MachineCreate.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  const category_machine = await axios.get('/api/category-machine', {
    headers: {
      origin: process.env.ORIGIN,
      Cookie: context.req.headers.cookie,
    },
  })
  const category_machines = category_machine.data.map(category_machine => {
    return {
      value: String(category_machine.id),
      label: String(category_machine.name),
    }
  })
  return {
    props: {
      category_machines,
    },
  }
}
