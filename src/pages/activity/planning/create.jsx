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
  Title,
} from '@mantine/core'
import {
  showNotification,
  cleanNotificationsQueue,
  cleanNotifications,
} from '@mantine/notifications'
import { TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check, FolderPlus, X } from 'tabler-icons-react'
import { DatePicker } from '@mantine/dates'
import dayjs from 'dayjs'

export default function PlanningCreate({ products, machines, shifts }) {
  const [visible, setVisible] = useState(false)
  const [cycleTime, setCycleTime] = useState('')
  const [planInTime, setPlanInTime] = useState(0)
  const router = useRouter()
  const form = useForm({
    initialValues: {
      product_id: '',
      machine_id: '',
      shift_id: '',
      qty_planning: 1,
      datein: '',
      dateout: '',
      timein: '',
      timeout: '',
    },
  })
  const Submit = async () => {
    setVisible(true)
    try {
      const { data } = await axios.post('/api/planning', {
        product_id: form.values.product_id,
        machine_id: form.values.machine_id,
        shift_id: form.values.shift_id,
        qty_planning: form.values.qty_planning,
        datetimein: `${dayjs(form.values.datein).format('YYYY-MM-DD')}  ${dayjs(
          form.values.timein,
        ).format('H:m')}`,
        datetimeout: `${dayjs(form.values.dateout).format(
          'YYYY-MM-DD',
        )}  ${dayjs(form.values.timeout).format('H:m')}`,
      })
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      setTimeout(() => {
        router.push('/activity/planning')
      }, 500)
    } catch (error) {
      if (error.response) {
        showNotification({
          title: `${error.response.statusText ?? 'error'} ${
            error.response.status ?? 500
          }`,
          message: `${error.response.data.message ?? 'error'}`,
          icon: <X />,
          color: 'red',
        })
      }
    } finally {
      setVisible(false)
    }
  }
  useEffect(() => {
    let settimeout = setTimeout(() => {
      axios.get(`api/product/${form.values.product_id}`).then(({ data }) => {
        setCycleTime(data.cycle_time)
        form.setFieldValue(
          'qty_planning',
          (planInTime * 60 * 60) / data.cycle_time,
        )
      })
    }, 200)
    return () => clearTimeout(settimeout)
  }, [form.values.product_id])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card p="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Button
              variant="filled"
              onClick={() => router.push('/activity/planning')}>
              back
            </Button>
            <Title order={5}>Create new planning</Title>
          </Group>
        </Card.Section>
        <form onSubmit={form.onSubmit(Submit)}>
          <Stack spacing="xl">
            <Group>
              <Grid>
                <Grid.Col span={4}>
                  <Select
                    required
                    id="machines"
                    label="machines"
                    searchable
                    data={machines}
                    description="choose a machine"
                    {...form.getInputProps('machine_id')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    required
                    id="products"
                    label="products"
                    searchable
                    data={products}
                    description="choose a product"
                    {...form.getInputProps('product_id')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Grid columns={12}>
                    <Grid.Col span={6}>
                      <NumberInput
                        min={0}
                        label="Plan in time"
                        description={`input in hour (${cycleTime})`}
                        value={planInTime}
                        onChange={e => {
                          setPlanInTime(e)
                          form.setFieldValue(
                            'qty_planning',
                            (e * 60 * 60) / cycleTime,
                          )
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        required
                        min={1}
                        disabled={planInTime == 0 ? true : false}
                        label="qty planning"
                        description="quantity planning"
                        {...form.getInputProps('qty_planning')}
                        id="qty_planning"
                        defaultValue={1}
                      />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    required
                    id="shifts"
                    label="shifts"
                    searchable
                    data={shifts}
                    {...form.getInputProps('shift_id')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Grid columns={12}>
                    <Grid.Col span={6}>
                      <DatePicker
                        locale="id"
                        inputFormat="YYYY-MM-DD"
                        labelFormat="YYYY-MM-DD"
                        required
                        id="datein"
                        label="date in"
                        placeholder="date in"
                        minDate={dayjs(new Date()).toDate()}
                        {...form.getInputProps('datein')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TimeInput
                        id="timein"
                        label="time in"
                        placeholder="timein"
                        {...form.getInputProps('timein')}
                        required
                      />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Grid columns={12}>
                    <Grid.Col span={6}>
                      <DatePicker
                        locale="id"
                        inputFormat="YYYY-MM-DD"
                        labelFormat="YYYY-MM-DD"
                        required
                        id="dateout"
                        label="date out"
                        placeholder="date out"
                        minDate={dayjs(new Date(form.values.datein)).toDate()}
                        {...form.getInputProps('dateout')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TimeInput
                        id="timeout"
                        label="time out"
                        placeholder="timeout"
                        {...form.getInputProps('timeout')}
                        required
                      />
                    </Grid.Col>
                  </Grid>
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
      {/* ...other content */}
    </div>
  )
}

PlanningCreate.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const product = await axios.get('/api/product', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    const machine = await axios.get('/api/machine', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    const shift = await axios.get('/api/shift', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })

    const products = product.data.map(item => {
      return {
        value: String(item.id),
        label: String(`${item.part_name} ${item.part_number}`),
      }
    })
    const machines = machine.data.map(item => {
      return {
        value: String(item.id),
        label: String(item.name),
      }
    })
    const shifts = shift.data.map(item => {
      return {
        value: String(item.id),
        label: String(item.name),
      }
    })
    return {
      props: {
        products,
        machines,
        shifts,
      },
    }
  } catch (error) {
    return {
      props: {
        products: null,
        machines: null,
        shifts: null,
      },
    }
  }
}
