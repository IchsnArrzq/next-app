import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, PasswordInput, Select, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function CustomerCreate({ provinces }) {
    const router = useRouter()
    const [cities, setCities] = useState([]);
    const form = useForm({
        initialValues: {
            name: 'Ichsan Arrizqi',
            email: 'ichsanarrizqi090@gmail.com',
            password: 'password',
            alias: 'ichsan',
            pic: 'staff',
            primaryContact: 'Budi',
            secondaryContact: '',
            noFax: '123123',
            province: '',
            city: '',
            postcode: '123',
            address: 'address',
            remark: 'remark',
        },
        validate: {
            password: (value => value.length < 8 ? 'Password must have at least 8 character' : null)
        }
    })
    const SubmitForm = async (e) => {
        e.preventDefault()
        try{
            await axios.post('/customer', form.values)
            router.push('/master/customer')
        }catch(error){
            console.log(error.response.data)
        }
    }
    const FindCities = async () => {
        if (form.values.province) {
            setCities([])
            const { data } = await axios.get(`/city/${form.values.province}`)
            const cities = data.map((city) => {
                return {
                    'value': city.id,
                    'label': city.nama
                }
            })
            setCities(cities)
        }
    }
    return (
        <Card p='xl' shadow="sm">
            <Card.Section p='md'>
                <Group position='apart'>
                    <Button variant='filled' onClick={() => router.push('/master/customer')}>
                        back
                    </Button>
                    <Title order={3}>Create new Customer</Title>
                </Group>
            </Card.Section>
            <form onSubmit={SubmitForm}>
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
                                <TextInput required id="primary" label="primary contact" placeholder='primary contact' {...form.getInputProps('primaryContact')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput id="secondary" label="secondary contact" placeholder='secondary contact' {...form.getInputProps('secondaryContact')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput required id="no" label="no fax" placeholder='73829479' {...form.getInputProps('noFax')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Select onSelect={FindCities} required searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" id="provinces" label="provinces" data={provinces} {...form.getInputProps('province')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Select required id="cities" label="cities" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={cities} {...form.getInputProps('city')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput required id="postcode"  label="postcode" placeholder='postcode' {...form.getInputProps('postcode')} />
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
        </Card >
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
