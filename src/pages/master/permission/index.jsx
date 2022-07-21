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

export default function PermissionIndex({ permissions }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    with: [],
  })
  const getRows = (value, page = pagination.current_page) => {
    return (
      <tr key={value.id}>
        <td>{value.name}</td>
        <td>
          <ul>
            {value.roles.map(item => {
              return <li key={item.id}>{item.name}</li>
            })}
          </ul>
        </td>
      </tr>
    )
  }
  const Delete = async (id, page) => {
    setVisible(true)
    try {
      const { data } = await axios.delete(`/permission/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      if (filters.search == '') {
        await axios
          .get(`/api/process-production?page=${page}`)
          .then(({ data }) => {
            setPagination({ ...data })
            setRows(data.data.map(value => getRows(value, page)))
          })
      } else {
        await axios
          .post(`/api/searchable?page=${page}`, {
            model: 'Permission',
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
    router.push(`/master/permission/${id}`)
  }
  useEffect(() => {
    setPagination({ ...permissions })
    setRows(permissions.data.map(value => getRows(value)))
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>Permission List</Title>
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
                    model: 'Permission',
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
              <th>roles</th>
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
                            .get(`/api/permission?page=${page}`)
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
                              model: 'Permission',
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
PermissionIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/permission?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        permissions: data,
      },
    }
  } catch (error) {
    return {
      props: {
        permissions: null,
      },
    }
  }
}
