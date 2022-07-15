import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { ActionIcon, Button, Card, ColorSchemeProvider, Grid, Group, Image, LoadingOverlay, MultiSelect, Select, Stack, Tabs, TextInput, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check, Forms, Photo, Settings, Trash, X } from 'tabler-icons-react'

export default function ProductEdit({ customers, process_productions }) {
    const router = useRouter()
    const { id } = router.query
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState('')
    const [images, setImages] = useState([])
    const form = useForm({
        initialValues: {
            customer_id: '',
            part_name: '',
            part_number: '',
            images: [],
            cycle_time: '',
            process: [],
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
    const Find = async () => {
        setVisible(true)
        const { data } = await axios.get(`/api/product/${id}/edit`)
        setImages([...data.imageables])
        form.setFieldValue('customer_id', String(data.customer_id))
        form.setFieldValue('part_name', data.part_name)
        form.setFieldValue('part_number', data.part_number)
        form.setFieldValue('cycle_time', data.cycle_time)
        form.setFieldValue('type', data.type)
        form.setFieldValue('unit', data.unit)
        form.setFieldValue('maker', data.maker)
        form.setFieldValue('cavity', data.cavity)
        form.setFieldValue('machine_rate', data.machine_rate)
        form.setFieldValue('welding_length', data.welding_length)
        form.setFieldValue('dies', data.dies)
        form.setFieldValue('dies_lifetime', data.dies_lifetime)
        form.setFieldValue('process', data.process_productions.map(item => String(item.id)))
        setRecord(data)
        setVisible(false)
    }

    const Submit = async () => {
        const formData = new FormData()
        formData.append("_method", "put");
        formData.append('customer_id', form.values.customer_id)
        formData.append('part_name', form.values.part_name)
        formData.append('part_number', form.values.part_number)
        formData.append('cycle_time', form.values.cycle_time)
        formData.append('type', form.values.type)
        formData.append('unit', form.values.unit)
        formData.append('maker', form.values.maker)
        formData.append('cavity', form.values.cavity)
        formData.append('machine_rate', form.values.machine_rate)
        formData.append('welding_length', form.values.welding_length)
        formData.append('dies', form.values.dies)
        formData.append('dies_lifetime', form.values.dies_lifetime)
        if (form.values.images) {
            for (let i = 0; i < form.values.images.length; i++) {
                formData.append('images[]', form.values.images[i])
            }
        }
        if (form.values.process) {
            for (let i = 0; i < form.values.process.length; i++) {
                formData.append('process[]', form.values.process[i])
            }
        }
        setVisible(true)
        try {
            const { data } = await axios.post(`/api/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                method: 'PUT',
                onUploadProgress: function (e) {
                    console.log(Math.round((e.loaded * 100) / e.total))
                }
            })
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
    useEffect(() => {
        Find()
    }, [])
    const HandleFileUpload = e => {
        form.setFieldValue('images', e.target.files)
    }
    const DeleteImage = async id => {
        axios.delete(`api/imageable/${id}`).then(async () => {
            const { data } = await axios.get(`/api/product/${router.query.id}/edit`)
            setImages([...data.imageables])
        })
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
                        <Title order={5}>last updated {record.updated_at}</Title>
                    </Group>
                </Card.Section>
                <Tabs variant="pills">
                    <Tabs.Tab label="Form" icon={<Forms size={14} />}>
                        <form onSubmit={form.onSubmit(Submit)} encType="multipart/form-data">
                            <Stack spacing="xl">
                                <Group>
                                    <Grid grow>
                                        <Grid.Col md={4} sm={1}>
                                            <Select id="customer" label="customer" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={customers} {...form.getInputProps('customer_id')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="part_name" label="Part Name" placeholder='part_name' {...form.getInputProps('part_name')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="part_number" label="Part Number" placeholder='part_number' {...form.getInputProps('part_number')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="file" multiple label="File" onInput={HandleFileUpload} type='file' />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="cycle_time" label="Cycle time" placeholder='cycle_time' {...form.getInputProps('cycle_time')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <MultiSelect id="process" label="Process" searchable data={process_productions} {...form.getInputProps('process')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="type" label="type" placeholder='type' {...form.getInputProps('type')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="maker" label="Maker" placeholder='maker' {...form.getInputProps('maker')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="unit" label="unit" placeholder='unit' {...form.getInputProps('unit')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="cavity" label="cavity" placeholder='cavity' {...form.getInputProps('cavity')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="machine_rate" label="machine_rate" placeholder='machine_rate' {...form.getInputProps('machine_rate')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="welding_length" label="welding_length" placeholder='welding_length' {...form.getInputProps('welding_length')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
                                            <TextInput id="dies" label="dies" placeholder='dies' {...form.getInputProps('dies')} />
                                        </Grid.Col>
                                        <Grid.Col md={4} sm={1}>
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
                    </Tabs.Tab>
                    <Tabs.Tab label={`Photo ${images?.length}`} icon={<Photo size={14} />}>
                        <Grid mb={'md'}>
                            {
                                images?.map(image => {
                                    return (
                                        <Grid.Col key={image.id} md={4} sm={1}>
                                            <div style={{ width: '100%', margin: 'auto' }}>
                                                <Card shadow="sm">
                                                    <Card.Section>
                                                        <Image src={image.path} height={160} alt="Norway" />
                                                    </Card.Section>
                                                    <Button onClick={() => DeleteImage(image.id)} variant="light" color="red" fullWidth style={{ marginTop: 14 }} rightIcon={<Trash size={16} />}>
                                                        delete
                                                    </Button>
                                                </Card>
                                            </div>
                                        </Grid.Col>
                                    )
                                })
                            }
                        </Grid>
                    </Tabs.Tab>
                </Tabs>
            </Card>
        </div>
    )
}
ProductEdit.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    const customer = await axios.get('/api/customer', {
        headers: {
            origin: process.env.ORIGIN,
            Cookie: context.req.headers.cookie
        }
    })
    const process_production = await axios.get('/api/process-production', {
        headers: {
            origin: process.env.ORIGIN,
            Cookie: context.req.headers.cookie
        }
    })

    const customers = customer.data.map((customer) => {
        return {
            'value': String(customer.id),
            'label': String(`${customer.user.name} - ${customer.alias}`)
        }
    })
    const process_productions = process_production.data.map((process_production) => {
        return {
            'value': String(process_production.id),
            'label': String(process_production.name)
        }
    })
    return {
        props: {
            customers,
            process_productions
        }
    }
}
