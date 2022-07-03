import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, LoadingOverlay, PasswordInput, Select, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function CustomerCreate({ provinces }) {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
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
    const Submit = async (e) => {
        setVisible(true)
        e.preventDefault()
        try {FF
            await axios.post('/customer', form.values)
            router.push('/master/customer')
        } catch (error) {
            console.log(error.response.data)
        }finally {
            setVisible(false)
        }
    }
    const FindCities = async () => {
        if (form.values.province) {
            try {
                setCities([])
                const { data } = await axios.get(`/city/${form.values.province}`)
                const cities = data.map((city) => {
                    return {
                        'value': city.id,
                        'label': city.nama
                    }
                })
                setCities(cities)
            } catch (error) {
                console.log(error.response.data)
            }
        }
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
                        <Title order={3}>Create new Customer</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={Submit}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col md={12} sm={6}>
                                    <TextInput required id="name" label="name" placeholder='Joe Smith' {...form.getInputProps('name')} />
                                </Grid.Col>
                                <Grid.Col md={12} sm={6}>
                                    <TextInput required id="alias" label="alias" placeholder='Joe' {...form.getInputProps('alias')} />
                                </Grid.Col>
                                <Grid.Col md={12} sm={6}>
                                    <TextInput required id="email" label="email" placeholder='joe@example.com' {...form.getInputProps('email')} />
                                </Grid.Col>
                                <Grid.Col md={12} sm={6}>
                                    <PasswordInput required id="password" label="password" placeholder='password' {...form.getInputProps('password')} />
                                </Grid.Col>
                                <Grid.Col md={12} sm={6}>
                                    <TextInput required id="pic" label="pic" placeholder='staff' {...form.getInputProps('pic')} />
                                </Grid.Col>
                            </Grid>
                            <Grid grow>
                                <Grid.Col md={4} sm={6}>
                                    <TextInput required id="primary" label="primary contact" placeholder='primary contact' {...form.getInputProps('primary')} />
                                </Grid.Col>
                                <Grid.Col md={4} sm={6}>
                                    <TextInput id="secondary" label="secondary contact" placeholder='secondary contact' {...form.getInputProps('secondary')} />
                                </Grid.Col>
                                <Grid.Col md={4} sm={6}>
                                    <TextInput required id="no" label="no fax" placeholder='73829479' {...form.getInputProps('number_fax')} />
                                </Grid.Col>
                                <Grid.Col md={4} sm={6}>
                                    <Select onSelect={FindCities} required searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" id="provinces" label="provinces" data={provinces} {...form.getInputProps('province')} />
                                </Grid.Col>
                                <Grid.Col md={4} sm={6}>
                                    <Select required id="cities" label="cities" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={cities} {...form.getInputProps('city')} />
                                </Grid.Col>
                                <Grid.Col md={4} sm={6}>
                                    <TextInput required id="postcode" label="postcode" placeholder='postcode' {...form.getInputProps('postcode')} />
                                </Grid.Col>
                                <Grid.Col md={4} sm={6}>
                                    <Textarea
                                        placeholder="address"
                                        id="address" label="address"
                                        {...form.getInputProps('address')}
                                    />
                                </Grid.Col>
                                <Grid.Col md={4} sm={6}>
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
            </Card >
        </div>
    )
}
CustomerCreate.getLayout = page => <AppLayout children={page} />
CustomerCreate.getInitialProps = async () => {
    const { data } = await axios.get('/provinces')
    const provinces = data.map((province) => {
        return {
            'value': province.id,
            'label': province.nama
        }
    })
    return {
        provinces
    }
}
