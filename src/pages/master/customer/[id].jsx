import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, LoadingOverlay, PasswordInput, Select, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { showNotification, cleanNotificationsQueue, cleanNotifications } from '@mantine/notifications';
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check, X } from 'tabler-icons-react';
import ErrorHandling from '@/components/ErrorHandling';

export default function CustomerEdit({ provinces, errors }) {
    const router = useRouter()
    const { id } = router.query
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState('')
    const [cities, setCities] = useState([]);
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            alias: '',
            pic: '',
            primary: '',
            secondary: '',
            number_fax: '',
            province: '',
            city: '',
            postcode: '',
            address: '',
            remark: '',
        }
    })
    const Find = async () => {
        setVisible(true)
        const { data } = await axios.get(`/api/customer/${id}/edit`)
        form.setFieldValue('province', data.province)
        FindCities()
        form.setValues(data)
        form.setFieldValue('email', data.user.email)
        form.setFieldValue('name', data.user.name)
        setRecord(data)
        setVisible(false)
    }

    const Submit = async () => {
        setVisible(true)
        try {
            const { data } = await axios.put(`/api/customer/${id}`, form.values)
            showNotification({
                title: data.title ?? 'success',
                message: data.message ?? 'success',
                icon: <Check />,
                color: 'teal'
            })
            setTimeout(() => {
                router.push('/master/customer')
            }, 500)
        } catch (error) {
            console.log(error)
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
    const FindCities = async (province) => {
        if (province) {
            setCities([])
            const { data } = await axios.get(`/api/city/${province}`)
            const cities = data.map((city) => {
                return {
                    'value': String(city.id),
                    'label': String(city.nama)
                }
            })
            setCities([...cities])
        }
    }
    useEffect(() => {
        Find()
    }, [])
    if (errors) {
        return <ErrorHandling errors={errors} />
    }
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={visible} />
            <Card p='xl' shadow="sm">
                <Card.Section p='md'>
                    <Group position='apart'>
                        <Button variant='filled' onClick={() => router.push('/master/customer')}>
                            back
                        </Button>
                        <Title order={5}>Edit Customer</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={form.onSubmit(Submit)}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col span={12}>
                                    <TextInput required id="name" label="name" placeholder='Joe Smith' {...form.getInputProps('name')} />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <TextInput required id="alias" label="alias" placeholder='Joe' {...form.getInputProps('alias')} />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <TextInput required id="email" label="email" placeholder='joe@example.com' {...form.getInputProps('email')} />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <PasswordInput required id="password" label="password" placeholder='password' {...form.getInputProps('password')} />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <TextInput required id="pic" label="pic" placeholder='staff' {...form.getInputProps('pic')} />
                                </Grid.Col>
                            </Grid>
                            <Grid grow>
                                <Grid.Col span={4}>
                                    <TextInput required id="primary" label="primary contact" placeholder='primary contact' {...form.getInputProps('primary')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="secondary" label="secondary contact" placeholder='secondary contact' {...form.getInputProps('secondary')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput required id="no" label="no fax" placeholder='73829479' {...form.getInputProps('number_fax')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Select onSelect={() => FindCities(form.values.province)} required searchable id="provinces" label="provinces" data={provinces} {...form.getInputProps('province')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Select required id="cities" label="cities" searchable data={cities} {...form.getInputProps('city')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput required id="postcode" label="postcode" placeholder='postcode' {...form.getInputProps('postcode')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Textarea
                                        placeholder="address"
                                        id="address" label="address"
                                        {...form.getInputProps('address')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Textarea
                                        placeholder="remark"
                                        id="remark" label="remark"
                                        {...form.getInputProps('remark')}
                                    />
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
        </div>
    )
}
CustomerEdit.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('/api/provinces', {
            headers: {
                origin: process.env.ORIGIN,
                Cookie: context.req.headers.cookie
            }
        })
        const provinces = data.map((province) => {
            return {
                'value': String(province.id),
                'label': String(province.nama)
            }
        })
        return {
            props: {
                provinces,
                errors: null
            }
        }
    } catch (error) {
        return {
            props: {
                provinces: null,
                errors: JSON.parse(JSON.stringify(error))
            }
        }
    }
}
