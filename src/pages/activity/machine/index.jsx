import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Badge, Button, Card, Checkbox, Collapse, Grid, Group, Paper, Stack, Table, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'

export default function MachineIndex({ data }) {
    const [opened, setOpen] = useState(false);
    const [machines, setMachines] = useState(data);
    const HandleCheck = index => {
        machines[index].status = machines[index].status ? false : true
        setMachines([...machines])
    }
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
                                                    <tr key={index} htmlFor={index}>
                                                        <td><Checkbox id={index} checked={machines[index].status} onChange={() => HandleCheck(index)} /></td>
                                                        <td>{machine.name}</td>
                                                        <td>{machine.status ? <Badge color={'teal'} children='run' /> : <Badge color={'red'} children='stop' />}</td>
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
                        <Stack>
                            {
                                machines.filter(machine => {
                                    return machine.status == true
                                }).map((item, key) => {
                                    return (
                                        <div key={key}>
                                            <Stack>
                                                <Title order={5}>{item.name}</Title>
                                                {
                                                    item.planning_machines.map((planning_machine, id) => {
                                                        return (
                                                            <Grid columns={12}>
                                                                <Grid.Col span={8}>
                                                                    <Paper shadow={'sm'} key={id} p="md">
                                                                        <Group position='apart'>
                                                                            <Title order={5} >
                                                                                {planning_machine.product.part_name}
                                                                            </Title>
                                                                            <Title order={5}>
                                                                                OOE: xx%
                                                                            </Title>
                                                                        </Group>
                                                                    </Paper>
                                                                </Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <Paper shadow={'sm'} key={id} p="md">
                                                                        <Group position='center'>
                                                                            <Title order={5} >
                                                                                line stop {item.name}
                                                                            </Title>
                                                                        </Group>
                                                                    </Paper>
                                                                </Grid.Col>
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Stack>
                                        </div>
                                    )
                                })
                            }
                        </Stack>
                    </Card>
                </Stack>
            </Grid.Col>
        </Grid >
    )
}

MachineIndex.getLayout = page => <AppLayout children={page} />
MachineIndex.getInitialProps = async () => {
    let { data } = await axios.get('machine')
    for (let index = 0; index < data.length; index++) {
        data[index].status = false;
    }
    return {
        data
    }
}