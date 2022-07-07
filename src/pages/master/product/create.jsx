import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, Select, Stack, TextInput, Title, Input, LoadingOverlay } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications'; 
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Check, X } from 'tabler-icons-react'

export default function ProductCreate({ customers }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const form = useForm({
        initialValues: {
            customer_id: '',
            part_name: '',
            part_number: '',
            images: '',
            cycle_time: '',
            process: '',
            type: '',
            unit: '',
            maker: '',
            cavity: '',
            machine_rate: '',
            welding_length: '',
            dies: '',
            dies_lifetime: '',
        }
    })
    const Submit = async e => {
        e.preventDefault()
        setVisible(true)
        try {
            const { data } = await axios.post('/api/product', form.values)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            setTimeout(() => {
                router.push('/master/product')
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
    const HandleFileUpload = e => {
        form.setFieldValue('images', e.target.files[0])
    }
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card p='xl' shadow="sm">
                <Card.Section p='md'>
                    <Group position='apart'>
                        <Button variant='filled' onClick={() => router.push('/master/product')}>
                            back
                        </Button>
                        <Title order={5}>Create new Product</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={Submit} encType="multipart/form-data">
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col span={4}>
                                    <Select id="customer" label="customer" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={customers} {...form.getInputProps('customer_id')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="part_name" label="Part Name" placeholder='part_name' {...form.getInputProps('part_name')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="part_number" label="Part Number" placeholder='part_number' {...form.getInputProps('part_number')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="file" label="File" onInput={HandleFileUpload} type='file' />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="cycle_time" label="Cycle time" placeholder='cycle_time' {...form.getInputProps('cycle_time')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="process" label="Process" placeholder='process' {...form.getInputProps('process')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="type" label="type" placeholder='type' {...form.getInputProps('type')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="maker" label="Maker" placeholder='maker' {...form.getInputProps('maker')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="unit" label="unit" placeholder='unit' {...form.getInputProps('unit')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="cavity" label="cavity" placeholder='cavity' {...form.getInputProps('cavity')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="machine_rate" label="machine_rate" placeholder='machine_rate' {...form.getInputProps('machine_rate')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="welding_length" label="welding_length" placeholder='welding_length' {...form.getInputProps('welding_length')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="dies" label="dies" placeholder='dies' {...form.getInputProps('dies')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="dies_lifetime" label="dies_lifetime" placeholder='dies_lifetime' {...form.getInputProps('dies_lifetime')} />
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
            </Card >
        </div>
    )
}
ProductCreate.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    const { data } = await axios.get('/api/customer', {
        headers: {
            origin: process.env.ORIGIN,
            Cookie: context.req.headers.cookie
        }
    })
    const customers = data.map((customer) => {
        return {
            'value': String(customer.id),
            'label': String(`${customer.user.name} - ${customer.alias}`)
        }
    })
    return {
        props: {
            customers
        }
    }
}
