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
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AlertCircle, Check, X } from 'tabler-icons-react'

export default function PlanningIndex({ plannings, errors }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    with: ['product', 'machine', 'shift', 'product.customer'],
  })
  const [rows, setRows] = useState([])
  const getRows = (value, page = pagination.current_page) => {
    return (
      <tr key={value.id}>
        <td>{value.machine.name}</td>
        <td>{value.product.part_name}</td>
        <td>{value.qty_planning}</td>
        <td>{value.shift.name}</td>
        <td>{value.datetimein}</td>
        <td>{value.datetimeout}</td>
        <td>{value.total}</td>
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
      const { data } = await axios.delete(`/api/planning/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })

      axios
        .get(`/api/planning?page=${page}`)
        .then(({ data }) => {
          setPagination({
            ...data,
          })
          setRows(data.data.map(value => getRows(value, page)))
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
        .finally(() => {
          setVisible(false)
        })
    } catch (error) {
      showNotification({
        title: `${error.response.statusText ?? 'error'} ${
          error.response.status ?? 500
        }`,
        message: `${error.response.data.message ?? 'error'}`,
        icon: <X />,
        color: 'red',
      })
    } finally {
      setVisible(false)
    }
  }
  const Edit = async id => {
    router.push(`/activity/planning/${id}`)
  }
  if (errors) {
    return <ErrorHandling errors={errors} />
  }
  useEffect(() => {
    setPagination({
      ...plannings,
    })
    setRows(plannings.data.map(value => getRows(value)))
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>Planning Machine List</Title>
            <Button
              variant="filled"
              onClick={() => router.push('/activity/planning/create')}>
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
                    model: 'PlanningMachine',
                    filters: {
                      search: e.target.value,
                      with: filters.with,
                    },
                  })
                  .then(({ data }) => {
                    setPagination({
                      ...data,
                    })
                    console.log(data.data.length)
                    setRows(data.data.map(value => getRows(value)))
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
            />
          </Group>
        </Card.Section>
        <Table highlightOnHover verticalSpacing="xs" fontSize="xs">
          <thead>
            <tr>
              <th>machine</th>
              <th>product</th>
              <th>qty planning</th>
              <th>shift</th>
              <th>date time in</th>
              <th>date time out</th>
              <th>total hour</th>
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
                        })
                        if (page != pagination.current_page) {
                          setVisible(true)
                          axios
                            .get(`/api/planning?page=${page}`)
                            .then(({ data }) => {
                              setPagination({
                                ...data,
                              })
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
                              model: 'PlanningMachine',
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

PlanningIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/planning?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        plannings: data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        plannings: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
