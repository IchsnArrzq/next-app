import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
import {
  Card,
  Title,
  Table,
  Grid,
  Group,
  Button,
  LoadingOverlay,
  TextInput,
  Center,
  Pagination,
  Alert,
} from '@mantine/core'
import {
  showNotification,
  cleanNotificationsQueue,
  cleanNotifications,
} from '@mantine/notifications'
import axios from '@/lib/axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AlertCircle, Check, Search, X } from 'tabler-icons-react'
import ErrorHandling from '@/components/ErrorHandling'

export default function CustomerIndex({ customers, errors }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    with: ['user'],
  })
  const getRows = (value, page = pagination.current_page) => {
    return (
      <tr key={value.id}>
        <td>{value.alias}</td>
        <td>{value.pic}</td>
        <td>{value.primary}</td>
        <td>{value.address}</td>
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
      const { data } = await axios.delete(`/api/customer/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      if (filters.search == '') {
        await axios.get(`/api/customer?page=${page}`).then(({ data }) => {
          setPagination({ ...data })
          setRows(data.data.map(value => getRows(value, page)))
        })
      } else {
        await axios
          .post(`/api/searchable?page=${page}`, {
            model: 'Customer',
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
    router.push(`/master/customer/${id}`)
  }
  if (errors) {
    return <ErrorHandling errors={errors} />
  }
  useEffect(() => {
    setPagination({ ...customers })
    setRows(customers.data.map(value => getRows(value)))
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>Customer List</Title>
            <Button
              variant="filled"
              onClick={() => router.push('/master/customer/create')}>
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
                    model: 'Customer',
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
              <th>alias</th>
              <th>pic</th>
              <th>primary</th>
              <th>address</th>
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
                            .get(`/api/customer?page=${page}`)
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
                              model: 'Customer',
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
CustomerIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/customer?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        customers: data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        customers: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
