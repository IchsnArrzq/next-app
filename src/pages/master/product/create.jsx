import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, Select, Stack, TextInput, Title, Input } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function ProductCreate({ customers }) {
    const router = useRouter()
    const form = useForm({
        initialValues: {
            customerId: '',
            partName: 'part name',
            partNumber: 'part number',
            images: '',
            cycleTime: '200',
            process: '300',
            type: 'type',
            unit: 'unit',
            maker: 'maker',
            cavity: 'cavity',
            machineRate: '12 ',
            weldingLength: '123',
            dies: '12',
            diesLifetime: '321',
        }
    })
    const SubmitForm = async e => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/product', form.values)
            router.push('/master/product')
        } catch (err) {
            console.log(err.response, err)
        }
    }
    const HandleFileUpload = e => {
        form.setFieldValue('images', e.target.files[0])
    }
    return (
        <Card p='xl' shadow="sm">
            <Card.Section p='md'>
                <Group position='apart'>
                    <Button variant='filled' onClick={() => router.push('/master/product')}>
                        back
                    </Button>
                    <Title order={3}>Create new Product</Title>
                </Group>
            </Card.Section>
            <form onSubmit={SubmitForm} encType="multipart/form-data">
                <Stack spacing="xl">
                    <Group>
                        <Grid grow>
                            <Grid.Col span={4}>
                                <Select id="customer" label="customer" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={customers} {...form.getInputProps('customerId')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput id="part_name" label="Part Name" placeholder='part_name' {...form.getInputProps('partName')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput id="part_number" label="Part Number" placeholder='part_number' {...form.getInputProps('partNumber')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <input onInput={HandleFileUpload} type='file' />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput id="cycleTime" label="Cycle time" placeholder='cycleTime' {...form.getInputProps('cycleTime')} />
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
                                <TextInput id="machineRate" label="machineRate" placeholder='machineRate' {...form.getInputProps('machineRate')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput id="weldingLength" label="weldingLength" placeholder='weldingLength' {...form.getInputProps('weldingLength')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput id="dies" label="dies" placeholder='dies' {...form.getInputProps('dies')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput id="diesLifetime" label="diesLifetime" placeholder='diesLifetime' {...form.getInputProps('diesLifetime')} />
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
    )
}
ProductCreate.getLayout = page => <AppLayout children={page} />
ProductCreate.getInitialProps = async () => {
    const { data } = await axios.get('/customer')
    const customers = data.map((customer) => {
        return {
            'value': customer.id,
            'label': `${customer.user.name} - ${customer.alias}`
        }
    })
    return {
        customers
    }
}