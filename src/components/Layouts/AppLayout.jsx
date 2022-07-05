import { useAuth } from '@/hooks/auth'
import {
    MantineProvider,
    AppShell,
    Navbar,
    Header,
    Title,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    Menu,
    Divider,
    ScrollArea,
    Group,
    Button,
    Center,
    UnstyledButton,
    Avatar,
    Accordion,
    ThemeIcon,
    Stack,
} from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { Settings, DoorExit, Users, Accessible, AppWindow, License, MoodHappy, BuildingStore, BuildingFactory2, Clock, DeviceDesktopAnalytics, CalendarStats, LayoutGrid, Server } from 'tabler-icons-react';
import { useEffect, useState } from 'react';
import Link from 'next/link'
import ApplicationLogo from '../ApplicationLogo';
import { useRouter } from 'next/router';
import Breadcrumb from './Breadcrumb';
import { useWindowScroll } from '@mantine/hooks';

const AppLayout = ({ children }) => {
    const [scroll, scrollTo] = useWindowScroll();
    const router = useRouter()
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const title = opened ? 'Close navigation' : 'Open navigation';
    const { user, logout } = useAuth({ middleware: 'auth' })
    const Authenticated = () => {
        if (!user) {
            router.push('/login')
        }
    }
    useEffect(() => {
        Authenticated()
    }, [])
    return (
        <MantineProvider
            theme={{
                headings: {
                    fontFamily: 'Roboto, sans-serif'
                }
            }}
        >
            <NotificationsProvider>
                <AppShell
                    navbarOffsetBreakpoint="sm"
                    asideOffsetBreakpoint="sm"
                    fixed
                    style={{ backgroundColor: theme.colors.blue[1] }}
                    navbar={
                        <Navbar p="xs" className='bg-blue-500' hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }}>
                            <Navbar.Section mb="xs">
                                <Center>
                                    <ApplicationLogo />
                                </Center>
                            </Navbar.Section>
                            <Divider />
                            <Navbar.Section grow component={ScrollArea} mx="-xs" px="sm" my="lg">

                                <Accordion disableIconRotation iconPosition="right" multiple>
                                    <Accordion.Item
                                        label="Master"
                                        icon={
                                            <ThemeIcon color="violet" variant="light">
                                                <LayoutGrid size={14} />
                                            </ThemeIcon>
                                        }
                                    >
                                        <Group>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/user')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        users
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <Users size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/customer')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        customers
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <MoodHappy size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/role')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        roles
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <Accessible size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/permission')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        permissions
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <License size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/product')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        product
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <BuildingStore size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/machine')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        machine
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <BuildingFactory2 size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/shift')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        shift
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <Clock size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                        </Group>
                                    </Accordion.Item>

                                    <Accordion.Item
                                        label="Activity"
                                        icon={
                                            <ThemeIcon color="violet" variant="light">
                                                <Server size={14} />
                                            </ThemeIcon>
                                        }
                                    >
                                        <Group>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/activity/machine')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        Machine Monitor
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <DeviceDesktopAnalytics size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/activity/planning')}>
                                                <Group position='apart'>
                                                    <Title order={6}>
                                                        Planning Machine
                                                    </Title>
                                                    <ThemeIcon color="violet" variant="light">
                                                        <CalendarStats size={14} />
                                                    </ThemeIcon>
                                                </Group>
                                            </UnstyledButton>
                                        </Group>
                                    </Accordion.Item>
                                </Accordion>
                            </Navbar.Section>
                            <Divider />
                            <Navbar.Section mt="xs">
                                <UnstyledButton onClick={() => console.log('try focusing button with tab')}>
                                    <Group>
                                        <Avatar size={40} color="blue">BH</Avatar>
                                        <div>
                                            <Text>{user ? user.name : ''}</Text>
                                            <Text size="xs" color="gray">{user ? user.email : ''}</Text>
                                        </div>
                                    </Group>
                                </UnstyledButton>
                            </Navbar.Section>
                        </Navbar>
                    }
                    header={
                        <Header height={60} p="xs">
                            <Group position="apart">
                                <Link href='/dashboard'>
                                    <Button leftIcon={<AppWindow />} variant={`default`} component='a'>dashboard</Button>
                                </Link>
                                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                    <Burger
                                        opened={opened}
                                        onClick={() => setOpened((o) => !o)}
                                        size="sm"
                                        color={theme.colors.gray[6]}
                                        mr="xl"
                                    />
                                </MediaQuery>
                                <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
                                    <Menu position='left' delay={500} control={<Burger
                                        opened={opened}
                                        onClick={() => setOpened((o) => !o)}
                                        title={title}
                                    />}>
                                        {/* Menu items */}

                                        <Menu.Label>Application</Menu.Label>
                                        <Menu.Item icon={<Settings size={14} />}>Profile</Menu.Item>

                                        <Divider />
                                        <Menu.Label>Danger zone</Menu.Label>
                                        <Menu.Item onClick={logout} color="red" icon={<DoorExit size={14} />}>Logout</Menu.Item>
                                    </Menu>
                                </MediaQuery>
                            </Group >
                        </Header>
                    }
                >
                    <Stack>
                        <Breadcrumb />
                        {children}
                    </Stack>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider>
    )
}

export default AppLayout
