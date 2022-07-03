import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'

export default function UserCreate() {
    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const form = useForm({
        initialValues: {
            name: ''
        }
    })
    const Submit = async e => {
        setVisible(true)
        e.preventDefault()
        try {
            const { data } = await axios.post('user', form.values)
            router.push('/master/user')
        } catch (error) {
            console.log(error.response)
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
                        <Button variant='filled' onClick={() => router.push('/master/user')}>
                            back
                        </Button>
                        <Title order={3}>Create new User</Title>
                    </Group>
                </Card.Section>
                <form onSubmit={Submit}>
                    <Stack spacing="xl">
                        <Group>
                            <Grid grow>
                                <Grid.Col span={4}>
                                    <TextInput id="name" label="name" placeholder='name' {...form.getInputProps('name')} />
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

UserCreate.getLayout = page => <AppLayout children={page} />
