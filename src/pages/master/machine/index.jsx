import ErrorHandling from '@/components/ErrorHandling'
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  LoadingOverlay,
  Pagination,
  Table,
  TextInput,
  Title,
} from '@mantine/core'
import {
  showNotification,
  cleanNotificationsQueue,
  cleanNotifications,
} from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AlertCircle, Check, Search, X } from 'tabler-icons-react'

export default function MachineIndex({ machines, errors }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    with: [
      'planning_machines',
      'planning_machines.product',
      'planning_machines.productions',
      'planning_machines_monitor',
      'planning_machines_monitor.product',
      'planning_machines_monitor.productions',
      'planning_machines_monitor.shift',
      'production_status_monitor',
    ],
  })
  const [rows, setRows] = useState([])
  const getRows = (value, page = pagination.current_page) => {
    return (
      <tr key={value.id}>
        <td>{value.name}</td>
        <td>{value.number}</td>
        <td>{value.code}</td>
        <td>{value.brand}</td>
        <td>{value.purchase_date}</td>
        <td>{value.manufacture_date}</td>
        <td>
          <Group>
            <Button
              color={'yellow'}
              id={value.id}
              onClick={() => Edit(value.id)}>
              edit
            </Button>
            <Button
              color={'red'}
              id={value.id}
              onClick={() => Delete(value.id, page)}>
              delete
            </Button>
          </Group>
        </td>
      </tr>
    )
  }
  const Delete = async (id, page) => {
    setVisible(true)
    try {
      const { data } = await axios.delete(`/api/machine/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      if (filters.search == '') {
        await axios.get(`/api/machine?page=${page}`).then(({ data }) => {
          setPagination({ ...data })
          setRows(data.data.map(value => getRows(value, page)))
        })
      } else {
        await axios
          .post(`/api/searchable?page=${page}`, {
            model: 'Machine',
            filters: {
              search: filters.search,
              with: filters.with,
            },
          })
          .then(({ data }) => {
            setPagination({ ...data })
            setRows(data.data.map(value => getRows(value, page)))
          })
      }
    } catch (error) {
      if (error.response) {
        showNotification({
          title: `${error.response.statusText ?? 'error'} ${
            error.response.status ?? 500
          }`,
          message: `${error.response.data.message ?? 'error'}`,
          icon: <X />,
          color: 'red',
        })
      }
    } finally {
      setVisible(false)
    }
  }
  const Edit = async id => {
    router.push(`/master/machine/${id}`)
  }
  if (errors) {
    return <ErrorHandling errors={errors} />
  }
  useEffect(() => {
    setPagination({ ...machines })
    setRows(machines.data.map(value => getRows(value)))
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>Machine List</Title>
            <Button
              variant="filled"
              onClick={() => router.push('/master/machine/create')}>
              create
            </Button>
          </Group>
        </Card.Section>
        <Card.Section p="md">
          <Group position="left">
            <TextInput
              label="search"
              value={filters.search}
              onChange={e => {
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
                axios
                  .post('/api/searchable?page=1', {
                    model: 'Machine',
                    filters: {
                      search: e.target.value,
                      with: filters.with,
                    },
                  })
                  .then(({ data }) => {
                    setPagination({ ...data })
                    setRows(data.data.map(value => getRows(value, pagination)))
                  })
                  .catch(error => {
                    if (error.response) {
                      showNotification({
                        title: `${error.response.statusText ?? 'error'} ${
                          error.response.status ?? 500
                        }`,
                        message: `${error.response.data.message ?? 'error'}`,
                        icon: <X />,
                        color: 'red',
                      })
                    }
                  })
              }}
              rightSection={<Search size={14} />}
            />
          </Group>
        </Card.Section>
        <Table highlightOnHover verticalSpacing="xs" fontSize="xs">
          <thead>
            <tr>
              <th>name</th>
              <th>number</th>
              <th>code</th>
              <th>brand</th>
              <th>purchase date</th>
              <th>manufacture date</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length != 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={'100%'}>
                  {' '}
                  <Alert
                    icon={<AlertCircle size={16} />}
                    title="Oops!"
                    color="yellow">
                    no data displayed
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={'100%'}>
                <Center>
                  {filters.search == '' ? (
                    <Pagination
                      page={pagination.current_page}
                      onChange={page => {
                        setPagination({
                          ...pagination,
                          current_page: page,
                        })
                        if (page != pagination.current_page) {
                          setVisible(true)
                          axios
                            .get(`/api/machine?page=${page}`)
                            .then(({ data }) => {
                              setPagination({ ...data })
                              setRows(
                                data.data.map(value => getRows(value, page)),
                              )
                            })
                            .catch(error => {
                              if (error.response) {
                                showNotification({
                                  title: `${
                                    error.response.statusText ?? 'error'
                                  } ${error.response.status ?? 500}`,
                                  message: `${
                                    error.response.data.message ?? 'error'
                                  }`,
                                  icon: <X />,
                                  color: 'red',
                                })
                              }
                            })
                            .finally(() => {
                              setVisible(false)
                            })
                        }
                      }}
                      total={pagination.last_page}
                      boundaries={3}
                    />
                  ) : (
                    <Pagination
                      page={pagination.current_page}
                      onChange={page => {
                        setPagination({
                          ...pagination,
                          current_page: page,
                        })
                        if (page != pagination.current_page) {
                          setVisible(true)
                          axios
                            .post(`/api/searchable?page=${page}`, {
                              model: 'Machine',
                              filters: {
                                search: filters.search,
                                with: filters.with,
                              },
                            })
                            .then(({ data }) => {
                              setPagination({ ...data })
                              setRows(
                                data.data.map(value => getRows(value, page)),
                              )
                            })
                            .catch(error => {
                              if (error.response) {
                                showNotification({
                                  title: `${
                                    error.response.statusText ?? 'error'
                                  } ${error.response.status ?? 500}`,
                                  message: `${
                                    error.response.data.message ?? 'error'
                                  }`,
                                  icon: <X />,
                                  color: 'red',
                                })
                              }
                            })
                            .finally(() => {
                              setVisible(false)
                            })
                        }
                      }}
                      total={pagination.last_page}
                      boundaries={3}
                    />
                  )}
                </Center>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Card>
    </div>
  )
}

MachineIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/machine?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        machines: data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        machines: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
