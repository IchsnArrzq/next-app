import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, LoadingOverlay, MultiSelect, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function UserEdit({ roles }) {
    const router = useRouter()
    const { id } = router.query
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState('')
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            roles: []
        }
    })
    const Find = async () => {
        const { data } = await axios.get(`/user/${id}/edit`)
        form.setValues(data)
        form.setFieldValue('roles', data.roles.map((value, index) => value.id))
        setRecord(data)
    }

    const Submit = async e => {
        setVisible(true)
        e.preventDefault()
        try {
            const { data } = await axios.put(`user/${id}`, form.values)
            setVisible(false)
            router.push('/master/user')
        } catch (error) {
            setVisible(false)
            console.log(error.response)
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
                        <Button variant='filled' onClick={() => router.push('/master/user')}>
                            back
                        </Button>
                        <Title order={3}>last updated {record.updated_at}</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={Submit}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col span={5}>
                                    <TextInput id="name" label="name" placeholder='name' {...form.getInputProps('name')} />
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <TextInput id="email" label="email" placeholder='email' {...form.getInputProps('email')} />
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <TextInput id="password" label="password" placeholder='password' {...form.getInputProps('password')} />
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <MultiSelect autoFocus id="roles" label="roles" searchable allowDeselect clearable transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease" data={roles} {...form.getInputProps('roles')} />
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
UserEdit.getLayout = page => <AppLayout children={page} />
UserEdit.getInitialProps = async () => {
    const { data } = await axios.get('role')

    const roles = data.map((role) => {
        return {
            'value': role.id,
            'label': role.name
        }
    })
    return {
        roles
    }
}