import ErrorHandling from '@/components/ErrorHandling'
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import Login from '@/pages/login'
import {
  ActionIcon,
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
import { usePagination } from '@mantine/hooks'
import {
  showNotification,
  cleanNotificationsQueue,
  cleanNotifications,
} from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowNarrowDown,
  ArrowNarrowUp,
  Check,
  Search,
  X,
} from 'tabler-icons-react'

export default function ShiftIndex({ shifts, context, errors }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    with: [],
  })
  const Delete = async id => {
    setVisible(true)
    try {
      const { data } = await axios.delete(`/api/shift/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      router.push('/master/shift')
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
    router.push(`/master/shift/${id}`)
  }
  if (errors) {
    return <ErrorHandling errors={errors} />
  }

  useEffect(() => {
    setPagination({
      ...shifts,
    })
    setRows(
      shifts.data.map((value, index) => {
        return (
          <tr key={value.id}>
            <td>{value.id}</td>
            <td>{value.name}</td>
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
                  onClick={() => Delete(value.id)}>
                  delete
                </Button>
              </Group>
            </td>
          </tr>
        )
      }),
    )
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>Shift List</Title>
            <Button
              variant="filled"
              onClick={() => router.push('/master/shift/create')}>
              create
            </Button>
          </Group>
        </Card.Section>
        <Card.Section p="md">
          <Group position="right">
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
                    model: 'Shift',
                    filters: {
                      search: e.target.value,
                      with: [],
                    },
                  })
                  .then(({ data }) => {
                    setPagination({
                      ...data,
                    })
                    setRows(
                      data.data.map((value, index) => {
                        return (
                          <tr key={value.id}>
                            <td>{value.id}</td>
                            <td>{value.name}</td>
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
                                  onClick={() => Delete(value.id)}>
                                  delete
                                </Button>
                              </Group>
                            </td>
                          </tr>
                        )
                      }),
                    )
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
              <th>id</th>
              <th>name</th>
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
                    title="Bummer!"
                    color="red">
                    blank data for now
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={'100%'}>
                <Center>
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
                          .get(`/api/shift?page=${page}`)
                          .then(({ data }) => {
                            setPagination({
                              ...data,
                            })
                            setRows(
                              data.data.map((value, index) => {
                                return (
                                  <tr key={value.id}>
                                    <td>{value.id}</td>
                                    <td>{value.name}</td>
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
                                          onClick={() => Delete(value.id)}>
                                          delete
                                        </Button>
                                      </Group>
                                    </td>
                                  </tr>
                                )
                              }),
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
                </Center>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Card>
    </div>
  )
}

ShiftIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/shift?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        shifts: data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        shifts: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
