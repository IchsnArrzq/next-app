import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, LoadingOverlay, NumberInput, Select, Stack, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Check, FolderPlus, X } from 'tabler-icons-react'
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';

export default function PlanningCreate({ products, machines, shifts }) {
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const form = useForm({
        initialValues: {
            date: '',
            product_id: '',
            machine_id: '',
            shift_id: '',
            qty_planning: 1,
            in: '',
            out: ''
        }
    })
    const Submit = async e => {
        e.preventDefault()
        setVisible(true)
        try {
            const { data } = await axios.post('/api/planning', {
                date: dayjs(form.values.date).format('YYYY-MM-DD'),
                product_id: form.values.product_id,
                machine_id: form.values.machine_id,
                shift_id: form.values.shift_id,
                qty_planning: form.values.qty_planning,
                in: dayjs(form.values.in).format('H:m'),
                out: dayjs(form.values.out).format('H:m')
            })
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            setTimeout(() => {
                router.push('/activity/planning')
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
                        <Button variant='filled' onClick={() => router.push('/activity/planning')}>
                            back
                        </Button>
                        <Title order={5}>Create new planning</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={Submit}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid>
                                <Grid.Col span={3}>
                                    <DatePicker mode="datetime" locale='id' inputFormat="YYYY-MM-DD" labelFormat="YYYY-MM-DD" required id="date" label="date" placeholder='date' {...form.getInputProps('date')} />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Select required id="products" label="products" searchable data={products} {...form.getInputProps('product_id')} />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Select required id="machines" label="machines" searchable data={machines} {...form.getInputProps('machine_id')} />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Select required id="shifts" label="shifts" searchable data={shifts} {...form.getInputProps('shift_id')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <NumberInput required min={1} label="qty planning" {...form.getInputProps('qty_planning')} id="qty_planning" defaultValue={1} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TimeInput id="in" label="in" placeholder='in' {...form.getInputProps('in')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TimeInput id="out" label="out" placeholder='out' {...form.getInputProps('out')} />
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

PlanningCreate.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const product = await axios.get('/api/product', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })
        const machine = await axios.get('/api/machine', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })
        const shift = await axios.get('/api/shift', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })

        const products = product.data.map((item) => {
            return {
                'value': String(item.id),
                'label': String(item.part_name)
            }
        })
        const machines = machine.data.map((item) => {
            return {
                'value': String(item.id),
                'label': String(item.name)
            }
        })
        const shifts = shift.data.map((item) => {
            return {
                'value': String(item.id),
                'label': String(item.name)
            }
        })
        return {
            props: {
                products,
                machines,
                shifts,
            }
        }
    } catch (error) {
        return {
            props: {
                products: null,
                machines: null,
                shifts: null,
            }
        }
    }
}