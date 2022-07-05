import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Badge, Button, Card, Checkbox, Collapse, Grid, Group, Stack, Table, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'

export default function MachineIndex({ data }) {
    const [opened, setOpen] = useState(false);
    const [machines, setMachines] = useState(data);
    const ShowDevices = async id => {
        // const { data } = await axios.get(`/machine/${id}`)
        console.log(machines, id)
    }
    const HideDevices = id => {
    }
    useEffect(() => {
        console.log(machines)
    }, [])
    return (
        <Grid columns={12}>
            {/* content... */}
            <Grid.Col span={opened ? 3 : 2}>
                <Stack>
                    <Card p={'xs'}>
                        <Group position='center' spacing="xs">
                            <Button onClick={() => setOpen((o) => !o)}>
                                {opened ? 'hide' : 'show'}
                            </Button>
                        </Group>
                    </Card>
                    <Card p={'xs'}>
                        <Collapse in={opened}>
                            <Group position='center' spacing="xs">
                                <Title order={5}>machine list</Title>
                                <Table fontSize="xs" highlightOnHover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>name</th>
                                            <th>status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            machines.map((machine, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td><Checkbox checked={machines[index].status} onChange={() => ShowDevices(machine.id)} /></td>
                                                        <td>{machine.name}</td>
                                                        <td>{true ? <Badge color={'teal'} children='run' /> : <Badge color={'red'} children='stop' />}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Group>
                        </Collapse>
                    </Card>
                </Stack>
            </Grid.Col>
            <Grid.Col span={opened ? 9 : 10}>
                <Stack>
                    <Card p={'xs'}>
                        <Group position='apart'>
                            <Button onClick={() => setOpen((o) => !o)}>
                                {opened ? 'hide' : 'show'}
                            </Button>
                            <Title order={5}>Planning List</Title>
                        </Group>
                    </Card>
                    <Card p={'xs'}>

                    </Card>
                </Stack>
            </Grid.Col>
        </Grid >
    )
}

MachineIndex.getLayout = page => <AppLayout children={page} />
MachineIndex.getInitialProps = async () => {
    const { data } = await axios.get('machine')
    return {
        data
    }
}