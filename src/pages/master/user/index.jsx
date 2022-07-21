import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
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
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { AlertCircle, Check, Search, X } from 'tabler-icons-react'
import ErrorHandling from '@/components/ErrorHandling'

export default function UserIndex({ users, errors }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    with: ['roles'],
  })
  const getRows = (value, page = pagination.current_page) => {
    return (
      <tr key={value.id}>
        <td>{value.name}</td>
        <td>{value.email}</td>
        <td>
          <ul>
            {value?.roles?.map(role => {
              return <li key={role.id}>{role.name}</li>
            })}
          </ul>
        </td>
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
      const { data } = await axios.delete(`/api/user/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      if (filters.search == '') {
        await axios.get(`/api/user?page=${page}`).then(({ data }) => {
          setPagination({ ...data })
          setRows(data.data.map(value => getRows(value)))
        })
      } else {
        await axios
          .post(`/api/searchable?page=${page}`, {
            model: 'User',
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
  const Edit = id => {
    router.push(`/master/user/${id}`)
  }
  if (errors) {
    return <ErrorHandling errors={errors} />
  }
  useEffect(() => {
    setPagination({ ...users })
    setRows(users.data.map(value => getRows(value)))
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>User List</Title>
            <Button
              variant="filled"
              onClick={() => router.push('/master/user/create')}>
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
                    model: 'User',
                    filters: {
                      search: e.target.value,
                      with: filters.with,
                    },
                  })
                  .then(({ data }) => {
                    setPagination({ ...data })
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
              rightSection={<Search size={14} />}
            />
          </Group>
        </Card.Section>
        <Table highlightOnHover verticalSpacing="xs" fontSize="xs">
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
              <th>roles</th>
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
                      total={pagination.last_page}
                      boundaries={3}
                      onChange={page => {
                        if (page != pagination.current_page) {
                          setVisible(true)
                          axios
                            .get(`/api/user?page=${page}`)
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
                    />
                  ) : (
                    <Pagination
                      page={pagination.current_page}
                      total={pagination.last_page}
                      boundaries={3}
                      onChange={page => {
                        setPagination({
                          ...pagination,
                          current_page: page,
                        })
                        if (page != pagination.current_page) {
                          setVisible(true)
                          axios
                            .post(`/api/searchable?page=${page}`, {
                              model: 'User',
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

UserIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/user?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        users: data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        users: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
