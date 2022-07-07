import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import { Badge, Button, Card, Checkbox, Collapse, Grid, Group, Paper, Progress, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function MachineIndex({ machine, time }) {

    const router = useRouter()
    const [opened, setOpen] = useState(false);
    const [machines, setMachines] = useState(machine);
    const [planningMachines, setPlanningMachines] = useState([])
    const HandleCheck = async index => {
        machines[index].status = machines[index].status ? false : true
        if (machines[index]) {
            const { data } = await axios.post('/api/monitor', {
                'hour': 7,
                'minute': 0,
                'second': 0,
                'machine': machines[index].id,
            })
            planningMachines[index] = data
            setPlanningMachines([...planningMachines])
        }
        setMachines([...machines])
    }
    useEffect(() => {
        machines.forEach(async (item, index) => {
            if (item.status) {
                const { data } = await axios.post('/api/monitor', {
                    'hour': 7,
                    'minute': 0,
                    'second': 0,
                    'machine': item.id,
                })
                planningMachines[index] = data
                setPlanningMachines([...planningMachines])
            } else {
                planningMachines[index] = null
                setPlanningMachines([...planningMachines])
            }
            HandleCheck(index)
        })
    }, [])
    return (
        <Grid columns={12} gutter="xs">
            {/* content... */}

            <Grid.Col span={opened ? 3 : 1.5}>
                <Collapse in={opened}>
                    <Stack>
                        <Card p={'xs'}>
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
                        </Card>
                    </Stack>
                </Collapse>
            </Grid.Col>
            <Grid.Col span={opened ? 9 : 12}>
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
                                machines.filter(machine => machine.status == true).map((item, key) => {
                                    return (
                                        <div key={key}>
                                            <Stack>
                                                <Title order={5}>{item.name}</Title>
                                                <Grid gutter="xs" columns={12}>
                                                    <Grid.Col span={8}>
                                                        <Paper shadow={'sm'} p="md">
                                                            <Group position='apart' mb={'sm'}>
                                                                <Title order={5} >
                                                                    product part_name
                                                                </Title>
                                                                <Title order={5}>
                                                                    OOE: xx%
                                                                </Title>
                                                            </Group>
                                                            <ScrollArea scrollbarSize={2}>
                                                                <Table>
                                                                    <thead>
                                                                        <tr style={{ backgroundColor: 'black' }}>
                                                                            <th style={{ color: 'white' }}>item</th>
                                                                            {
                                                                                time?.map((time, timeId) => {
                                                                                    return (
                                                                                        <th key={timeId} style={{
                                                                                            backgroundColor: time.split(':')[0] == new Date().getHours() ? 'green' : '',
                                                                                            color: time.split(':')[0] == new Date().getHours() ? 'white' : 'white'
                                                                                        }}>{time}</th>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>target</td>
                                                                            {
                                                                                time?.map((time, timeId) => {
                                                                                    return (
                                                                                        <td key={timeId}>
                                                                                            <Badge>{planningMachines[key] ? (planningMachines[key]?.targets[time] ?? 0) : 0}</Badge>
                                                                                        </td>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            <td>actual</td>
                                                                            {
                                                                                time?.map((time, timeId) => {
                                                                                    return (
                                                                                        <td key={timeId}>
                                                                                            <Badge color={true ? 'green' : 'yellow'}>{planningMachines[key] ? (planningMachines[key]?.actuals[time] ?? 0) : 0}</Badge>
                                                                                        </td>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tr>
                                                                        <tr>
                                                                            <td>persentase</td>
                                                                            {
                                                                                time?.map((time, timeId) => {
                                                                                    return (
                                                                                        <td key={timeId}>
                                                                                            <Badge color={false ? 'green' : 'yellow'}>{planningMachines[key] ? (planningMachines[key]?.percentages[time] ?? 0) : 0}</Badge>
                                                                                        </td>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </ScrollArea>
                                                        </Paper>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Paper shadow={'sm'} p="md">
                                                            <Group position='center'>
                                                                <Title order={5} >
                                                                    line stop {item.name}
                                                                </Title>
                                                                <Text>total time : 115 minutes</Text>
                                                            </Group>
                                                            <Stack>
                                                                <div>
                                                                    <Title order={5} >
                                                                        line stop a
                                                                    </Title>
                                                                    <Progress value={50} animate />
                                                                </div>
                                                                <div>
                                                                    <Title order={5} >
                                                                        line stop b
                                                                    </Title>
                                                                    <Progress value={50} animate />
                                                                </div>
                                                                <div>
                                                                    <Title order={5} >
                                                                        line stop c
                                                                    </Title>
                                                                    <Progress value={50} animate />
                                                                </div>
                                                                <div>
                                                                    <Title order={5} >
                                                                        line stop other
                                                                    </Title>
                                                                    <Progress value={50} animate />
                                                                </div>
                                                            </Stack>
                                                        </Paper>
                                                    </Grid.Col>
                                                </Grid>
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
export async function getServerSideProps(context) {
    const time = await axios.post('/api/times', {
        hour: 7,
        minute: 0,
        second: 0
    })
    const machine = await axios.get('/api/machine', {
        headers: {
            origin: process.env.ORIGIN,
            Cookie: context.req.headers.cookie
        }
    })
    for (let index = 0; index < machine.data.length; index++) {
        machine.data[index].status = false;
    }
    return {
        props: {
            machine: machine.data,
            time: time.data,
        }
    }
}