import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Button, Card, Grid, Group, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function Machinemachine() {
    const router = useRouter()
    const { id } = router.query
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState('')
    const form = useForm({
        initialValues: {
            name: '',
            number: '',
        }
    })
    const Find = async () => {
        const { data } = await axios.get(`/machine/${id}/edit`)
        form.setValues(data)
        setRecord(data)
    }

    const Submit = async e => {
        setVisible(true)
        e.preventDefault()
        try {
            const { data } = await axios.put(`machine/${id}`, form.values)
            router.push('/master/machine')
        } catch (error) {
            console.log(error.response)
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
                        <Button variant='filled' onClick={() => router.push('/master/machine')}>
                            back
                        </Button>
                        <Title order={3}>last updated {record.updated_at}</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={Submit}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col span={4}>
                                    <TextInput id="name" label="name" placeholder='name' {...form.getInputProps('name')} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TextInput id="number" label="number" placeholder='number' {...form.getInputProps('number')} />
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
Machinemachine.getLayout = page => <AppLayout children={page} />
