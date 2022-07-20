import ErrorHandling from '@/components/ErrorHandling'
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import Login from '@/pages/login'
import {
   ActionIcon,
   Button,
   Card,
   Center,
   Group,
   LoadingOverlay,
   Pagination,
   Table,
   Title,
} from '@mantine/core'
import {
   showNotification,
   cleanNotificationsQueue,
   cleanNotifications,
} from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import { ArrowNarrowDown, ArrowNarrowUp, Check, X } from 'tabler-icons-react'

export default function CategoryMachineIndex({ categoryMachines, errors }) {
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
         const { data } = await axios.delete(`/api/category-machine/${id}`)
         showNotification({
            title: data.title ?? 'success',
            message: data.message ?? 'success',
            icon: <Check />,
            color: 'teal',
         })
         router.push('/master/category-machine')
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
      router.push(`/master/category-machine/${id}`)
   }
   if (errors) {
      return <ErrorHandling errors={errors} />
   }

   useEffect(() => {
      ;(categoryMachines => {
         setPagination({
            ...categoryMachines,
         })
         setRows(
            categoryMachines.data.map((value, index) => {
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
      })(categoryMachines)
   }, [])
   return (
      <div style={{ position: 'relative' }}>
         <LoadingOverlay visible={visible} />
         <Card px="xl" py="xl" shadow="sm">
            <Card.Section p="md">
               <Group position="apart">
                  <Title order={5}>Category Machine List</Title>
                  <Button
                     variant="filled"
                     onClick={() =>
                        router.push('/master/category-machine/create')
                     }>
                     create
                  </Button>
               </Group>
            </Card.Section>
            <Table verticalSpacing="xs" fontSize="xs">
               <thead>
                  <tr>
                     <th>no</th>
                     <th>name</th>
                     <th>action</th>
                  </tr>
               </thead>
               <tbody>{rows}</tbody>
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
                                                               onClick={() =>
                                                                  Edit(value.id)
                                                               }>
                                                               edit
                                                            </Button>
                                                            <Button
                                                               color={'red'}
                                                               id={value.id}
                                                               onClick={() =>
                                                                  Delete(
                                                                     value.id,
                                                                  )
                                                               }>
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
                                                   error.response.statusText ??
                                                   'error'
                                                } ${
                                                   error.response.status ?? 500
                                                }`,
                                                message: `${
                                                   error.response.data
                                                      .message ?? 'error'
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

CategoryMachineIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
   try {
      const { data } = await axios.get('/api/category-machine?page=1', {
         headers: {
            origin: process.env.ORIGIN,
            Cookie: context.req.headers.cookie,
         },
      })
      return {
         props: {
            categoryMachines: data,
            errors: null,
         },
      }
   } catch (error) {
      return {
         props: {
            categoryMachines: null,
            errors: JSON.parse(JSON.stringify(error)),
         },
      }
   }
}
