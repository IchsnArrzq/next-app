import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios';
import { Button, Card, Grid, Group, LoadingOverlay, NumberInput, Select, Stack, Title } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Check, X } from 'tabler-icons-react';
import dayjs from 'dayjs';

export default function PlanningEdit({ products, machines, shifts }) {
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const { id } = router.query
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
            const { data } = await axios.put(`/api/planning/${id}`, {
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
    const Find = async () => {
        setVisible(true)
        try {
            const { data } = await axios.get(`/api/planning/${id}/edit`)
            form.setFieldValue('date', dayjs(data.date).toDate())
            form.setFieldValue('product_id', String(data.product_id))
            form.setFieldValue('machine_id', String(data.machine_id))
            form.setFieldValue('shift_id', String(data.shift_id))
            form.setFieldValue('qty_planning', data.qty_planning)
            form.setFieldValue('in', dayjs(data.date).hour(data.in.split(':')[0]).minute(data.in.split(':')[1]).toDate())
            form.setFieldValue('out', dayjs(data.date).hour(data.out.split(':')[0]).minute(data.out.split(':')[1]).toDate())
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
    useEffect(() => {
        Find()
    }, [])
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card p='xl' shadow="sm">
                <Card.Section p='md'>
                    <Group position='apart'>
                        <Button variant='filled' onClick={() => router.push('/activity/planning')}>
                            back
                        </Button>
                        <Title order={5}>edit planning</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={Submit}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid>
                                <Grid.Col span={3}>
                                    <DatePicker locale='id' inputFormat="YYYY-MM-DD" labelFormat="YYYY-MM-DD" required id="date" label="date" placeholder='date' {...form.getInputProps('date')} />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Select required id="products" label="products" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={products} {...form.getInputProps('product_id')} />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Select required id="machines" label="machines" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={machines} {...form.getInputProps('machine_id')} />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <Select required id="shifts" label="shifts" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={shifts} {...form.getInputProps('shift_id')} />
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
PlanningEdit.getLayout = page => <AppLayout children={page} />
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