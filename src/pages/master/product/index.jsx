import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Anchor,
  Button,
  Card,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import {
  showNotification,
  cleanNotificationsQueue,
  cleanNotifications,
} from '@mantine/notifications'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
import { AlertCircle, Check, Search, X } from 'tabler-icons-react'
import ErrorHandling from '@/components/ErrorHandling'
import { useForm } from '@mantine/form'

export default function ProductIndex({ products, errors }) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    with: ['customer', 'customer.user', 'imageables', 'process_productions'],
  })
  const [rows, setRows] = useState([])
  const [opened, setOpened] = useState(false)
  const [file, setFile] = useState()
  const form = useForm({
    initialValues: {
      images: [],
    },
  })
  const getRows = (value, page = pagination.current_page) => {
    return (
      <tr key={value.id}>
        <td>{value.part_name}</td>
        <td>{value.part_number}</td>
        <td>{value.cycle_time}</td>
        <td>{value.type}</td>
        <td>{value.unit}</td>
        <td>{value.maker}</td>
        <td>{value.machine_rate}</td>
        <td>{value.welding_length}</td>
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
      const { data } = await axios.delete(`/api/product/${id}`)
      showNotification({
        title: data.title ?? 'success',
        message: data.message ?? 'success',
        icon: <Check />,
        color: 'teal',
      })
      if (filters.search == '') {
        await axios.get(`/api/product?page=${page}`).then(({ data }) => {
          setPagination({ ...data })
          setRows(data.data.map(value => getRows(value, page)))
        })
      } else {
        await axios
          .post(`/api/searchable?page=${page}`, {
            model: 'Product',
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
      console.log(error.response)
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
    router.push(`/master/product/${id}`)
  }
  if (errors) {
    return <ErrorHandling errors={errors} />
  }
  useEffect(() => {
    setPagination({ ...products })
    setRows(products.data.map(value => getRows(value)))
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Modal
        centered
        size={'xl'}
        title="Import Product"
        opened={opened}
        onClose={() => setOpened(false)}>
        <Stack>
          <Center>
            <Text>
              <Anchor
                download={true}
                href={process.env.NEXT_PUBLIC_BACKEND_URL}>
                download template import?
              </Anchor>
            </Text>
          </Center>
          <TextInput
            id="file"
            multiple
            label="File"
            value={file}
            onChange={e => setFile(e.target.files[0])}
            type="file"
          />
        </Stack>
      </Modal>
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>Product List</Title>
            <Group>
              <Button
                variant="filled"
                color={'violet'}
                onClick={() => setOpened(true)}>
                import
              </Button>
              <Button
                variant="filled"
                onClick={() => router.push('/master/product/create')}>
                create
              </Button>
            </Group>
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
                    model: 'Product',
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
              <th>part name</th>
              <th>part number</th>
              <th>cycle time</th>
              <th>type</th>
              <th>unit</th>
              <th>maker</th>
              <th>machine rate</th>
              <th>welding length</th>
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
                            .get(`/api/product?page=${page}`)
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
                              model: 'Product',
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
ProductIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/product?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        products: data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        products: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
