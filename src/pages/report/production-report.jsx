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
  ScrollArea,
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
import dayjs from 'dayjs'
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

export default function ProductionReportIndex({ planningMachines, errors }) {
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
        <td>{dayjs(value.datetimein).format('DD/MM/YYYY')}</td>
        <td>{value.product.part_number}</td>
        <td>{value.product.part_name}</td>
        <td>{value.product.customer.alias}</td>
        <td>{value.machine.name}</td>
        <td>{value.machine.number}</td>
        <td>{value.qty_planning}</td>
        <td>{value?.production_monitor_order_by_desc[0]?.qty_actual}</td>
        <td>{value?.production_monitor_order_by_desc[0]?.qty_actual / value.qty_planning * 100}%</td>
        <td>reject</td>
        <td>{dayjs(value.datetimein).format('HH:mm:ss')}</td>
        <td>{dayjs(value.datetimeout).format('HH:mm:ss')}</td>
        <td>{value.total * 60}</td>
        <td>keterangan</td>
      </tr>
    )
  }
  const Export = async () => {
    axios
      .post('/api/report/report-production/export', undefined, {
        responseType: 'blob',
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'report-production-export.xlsx') //or any other extension
        document.body.appendChild(link)
        link.click()
      })
  }
  if (errors) {
    return <ErrorHandling errors={errors} />
  }

  useEffect(() => {
    setPagination({ ...planningMachines })
    setRows(planningMachines.data.map(value => getRows(value)))
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={visible} />
      <Card px="xl" py="xl" shadow="sm">
        <Card.Section p="md">
          <Group position="apart">
            <Title order={5}>Production Report</Title>
            <Button variant="filled" onClick={() => Export()} color="green">
              export
            </Button>
          </Group>
        </Card.Section>
        <ScrollArea>
          <Table highlightOnHover verticalSpacing="xs" fontSize="xs">
            <thead>
              <tr>
                <th>tanggal</th>
                <th>kode barang</th>
                <th>nama barang</th>
                <th>pelanggan</th>
                <th>standar mesin</th>
                <th>aktual mesin</th>
                <th>rencana</th>
                <th>aktual</th>
                <th>persentase</th>
                <th>reject</th>
                <th>mulai</th>
                <th>selesai</th>
                <th>durasi (menit)</th>
                <th>keterangan</th>
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
          </Table>
        </ScrollArea>
      </Card>
    </div>
  )
}

ProductionReportIndex.getLayout = page => <AppLayout children={page} />
export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get('/api/report/report-production?page=1', {
      headers: {
        origin: process.env.ORIGIN,
        Cookie: context.req.headers.cookie,
      },
    })
    return {
      props: {
        planningMachines: data,
        errors: null,
      },
    }
  } catch (error) {
    return {
      props: {
        planningMachines: null,
        errors: JSON.parse(JSON.stringify(error)),
      },
    }
  }
}
