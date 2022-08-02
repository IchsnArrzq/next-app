import ErrorHandling from '@/components/ErrorHandling'
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import {
  Accordion,
  Badge,
  Button,
  Card,
  Checkbox,
  Collapse,
  Grid,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React, { useEffect, useState } from 'react'
export default function MachineIndex({ categoryMachine, time, errors }) {
  dayjs.extend(isBetween)
  const [opened, setOpen] = useState(0)
  const [categoryMachines, setCategoryMachines] = useState([])
  const [planningMachines, setPlanningMachines] = useState([])
  const [machines, setMachines] = useState([])
  const arrayUnique = array => {
    var a = array.concat()
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1)
      }
    }
    return a
  }
  const HandleCheck = async machine => {
    if (machines.find(value => value.id == machine.id)) {
      machines.find(value => value.id == machine.id).show = machines.find(
        value => value.id == machine.id,
      ).show
        ? 0
        : 1
    } else {
      machine.show = true
    }
    if (machine) {
      const { data } = await axios.post('/api/monitor', {
        hour: 7,
        minute: 0,
        second: 0,
        machine: machine.id,
      })
      planningMachines[machine.id] = data
      setPlanningMachines([...planningMachines])
    }
    setMachines(arrayUnique(machines.concat(machine)))
  }
  const getMachines = categoryMachine => (
    <Table fontSize="xs" highlightOnHover>
      <thead>
        <tr>
          <th>#</th>
          <th>name</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        {categoryMachine.machines.map(machine => {
          return (
            <tr key={machine.id} htmlFor={machine.id}>
              <td>
                <Checkbox
                  id={machine.id}
                  checked={machine.show}
                  onChange={() => HandleCheck(machine)}
                />
              </td>
              <td>
                {machine.name}
              </td>
              <td>
                {machine?.production_status_monitor?.status ? (
                  <Badge color={'teal'} children="run" />
                ) : (
                  <Badge color={'red'} children="stop" />
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
  const getCategoryMachines = () => (
    <Accordion>
      {categoryMachines.map(categoryMachine => {
        return (
          <Accordion.Item
            key={categoryMachine.id}
            label={categoryMachine.name}
            iconPosition="right">
            {getMachines(categoryMachine)}
          </Accordion.Item>
        )
      })}
    </Accordion>
  )

  useEffect(() => {
    setCategoryMachines(categoryMachine)
    categoryMachine.map(item =>
      setMachines([
        ...machines,
        ...item.machines.map(value => {
          value.show = 0
          return value
        }),
      ]),
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('start')
      machines.forEach(async machine => {
        if (machine.show) {
          const { data } = await axios.post('/api/monitor', {
            hour: 7,
            minute: 0,
            second: 0,
            machine: machine.id,
          })
          planningMachines[machine.id] = data
          setPlanningMachines([...planningMachines])
        } else {
          planningMachines[machine.id] = null
          setPlanningMachines([...planningMachines])
        }
      })
      console.log('end')
    }, 10000)
    return () => clearInterval(interval)
  }, [])
  return (
    <Grid columns={12} gu tter="xs">
      {/* content... */}

      <Grid.Col span={opened ? 3 : 1.5}>
        <Collapse in={opened}>
          <Stack>
            <Card p={'xs'}>{getCategoryMachines()}</Card>
          </Stack>
        </Collapse>
      </Grid.Col>
      <Grid.Col span={opened ? 9 : 12}>
        <Stack>
          <Card p={'xs'}>
            <Group position="apart">
              <Button onClick={() => setOpen(o => !o)}>
                {opened ? 'hide' : 'show'}
              </Button>
              <Title order={5}>Planning List</Title>
            </Group>
          </Card>
          <Card p={'xs'}>
            <Stack>
              {machines
                .filter(machine => machine.show == 1)
                .map((item, key) => {
                  return (
                    <div key={key}>
                      <Stack>
                        <Title order={5}>{item.name}</Title>
                        <Grid gutter="xs" columns={12}>
                          <Grid.Col span={8}>
                            <Paper shadow={'sm'} p="md">
                                {item?.planning_machines_monitor?.filter(value => {
                                  if(dayjs().isBetween(dayjs(value.datetimein),dayjs(value.datetimeout))){
                                    return value
                                  }
                                })?.map(item => {
                                  return (
                                      <Group position="apart" mb={'lg'}>
                                        <Text style={{  fontWeight: 'bold', }}>{item?.product?.part_name}</Text>
                                        <div style={{ borderLeft: '1px solid black',height: '15px' }}></div>
                                        <Text style={{  fontWeight: 'bold', }}>{item?.shift?.name}</Text>
                                        <div style={{ borderLeft: '1px solid black',height: '15px' }}></div>
                                        <Text style={{  fontWeight: 'bold', }}>{item?.datetimein}</Text>
                                        <Text style={{  fontWeight: 'bold', }}>{item?.datetimeout}</Text>
                                      </Group>
                                  )
                                })}
                              <ScrollArea scrollbarSize={2}>
                                <Table>
                                  <thead>
                                    <tr
                                      style={{
                                        backgroundColor: 'black',
                                      }}>
                                      <th
                                        style={{
                                          color: 'white',
                                        }}>
                                        item
                                      </th>
                                      {time?.map((time, timeId) => {
                                        return (
                                          <th
                                            key={timeId}
                                            style={{
                                              backgroundColor:
                                                time.split(':')[0] ==
                                                new Date().getHours()
                                                  ? 'green'
                                                  : '',
                                              color:
                                                time.split(':')[0] ==
                                                new Date().getHours()
                                                  ? 'white'
                                                  : 'white',
                                            }}>
                                            {time}
                                          </th>
                                        )
                                      })}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>target</td>
                                      {time?.map((time, timeId) => {
                                        return (
                                          <td key={timeId}>
                                            <Badge>
                                              {planningMachines[item.id]
                                                ? planningMachines[item.id]
                                                    ?.targets[time] ?? 0
                                                : 0}
                                            </Badge>
                                          </td>
                                        )
                                      })}
                                    </tr>
                                    <tr>
                                      <td>actual</td>
                                      {time?.map((time, timeId) => {
                                        return (
                                          <td key={timeId}>
                                            <Badge
                                              color={true ? 'green' : 'yellow'}>
                                              {planningMachines[item.id]
                                                ? planningMachines[item.id]
                                                    ?.actuals[time] ?? 0
                                                : 0}
                                            </Badge>
                                          </td>
                                        )
                                      })}
                                    </tr>
                                    <tr>
                                      <td>persentase</td>
                                      {time?.map((time, timeId) => {
                                        return (
                                          <td key={timeId}>
                                            <Badge
                                              color={
                                                false ? 'green' : 'yellow'
                                              }>
                                              {planningMachines[item.id]
                                                ? planningMachines[item.id]
                                                    ?.percentages[time] ?? 0
                                                : 0}
                                            </Badge>
                                          </td>
                                        )
                                      })}
                                    </tr>
                                  </tbody>
                                </Table>
                              </ScrollArea>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Paper shadow={'sm'} p="md">
                              <Group position="center">
                                <Title order={5}>line stop {item.name}</Title>
                                <Text>
                                  total time :
                                  {planningMachines[item.id]?.line_stop_other ??
                                    0}
                                  minutes
                                </Text>
                              </Group>
                              <Stack>
                                <div>
                                  <Title order={5}>line stop machine</Title>
                                  <Progress
                                    value={
                                      planningMachines[item.id]?.line_stop_a * 100
                                    }
                                    animate
                                  />
                                </div>
                                <div>
                                  <Title order={5}>line stop material</Title>
                                  <Progress
                                    value={
                                      planningMachines[item.id]?.line_stop_b * 100
                                    }
                                    animate
                                  />
                                </div>
                                <div>
                                  <Title order={5}>line stop quality</Title>
                                  <Progress
                                    value={
                                      planningMachines[item.id]?.line_stop_c * 100
                                    }
                                    animate
                                  />
                                </div>
                                <div>
                                  <Title order={5}>line stop other</Title>
                                  <Progress
                                    value={
                                      planningMachines[item.id]?.line_stop_other * 100
                                    }
                                    animate
                                  />
                                </div>
                              </Stack>
                            </Paper>
                          </Grid.Col>
                        </Grid>
                      </Stack>
                    </div>
                  )
                })}
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  )
}

MachineIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const time = await axios.post('/api/times', {
      hour: 7,
      minute: 0,
      second: 0,
    })
    const categoryMachine = await axios.get('/api/category-machine', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        categoryMachine: categoryMachine.data,
        time: time.data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        categoryMachine: null,
        time: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
