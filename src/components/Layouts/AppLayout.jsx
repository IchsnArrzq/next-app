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
    ActionIcon,
} from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { Settings, DoorExit, Users, Accessible, AppWindow, License, MoodHappy, BuildingStore, BuildingFactory2, Clock, DeviceDesktopAnalytics, CalendarStats, LayoutGrid, Server, ChevronLeft, ChevronsLeft } from 'tabler-icons-react';
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
    const [navbar, setNavbar] = useState(250);
    const title = opened ? 'Close navigation' : 'Open navigation';
    const { user, logout } = useAuth({ middleware: 'auth' })

    return (
        <MantineProvider
            theme={{
                headings: {
                    fontFamily: 'Roboto, sans-serif'
                },
                colorScheme: 'light'
            }}
        >
            <NotificationsProvider>
                <AppShell
                    navbarOffsetBreakpoint="sm"
                    asideOffsetBreakpoint="sm"
                    fixed
                    styles={{
                        main: {
                            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.blue[0],
                        }
                    }}
                    navbar={
                        <Navbar p="xs" className='bg-blue-500' hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: navbar }}>
                            <Navbar.Section mb="xs">
                                <Group position='right'>
                                    <ActionIcon>
                                        <ChevronsLeft style={{ transform: navbar == 250 ? "rotate(0deg)" : "rotate(180deg)" }} onClick={() => navbar == 250 ? setNavbar(100) : setNavbar(250)} />
                                    </ActionIcon>
                                </Group>
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
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                users
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <Users size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <Users size={14} />
                                                        </ThemeIcon>
                                                }
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/customer')}>
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                customers
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <MoodHappy size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <MoodHappy size={14} />
                                                        </ThemeIcon>
                                                }
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/role')}>
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                roles
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <Accessible size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <Accessible size={14} />
                                                        </ThemeIcon>
                                                }
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/permission')}>
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                permissions
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <License size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <License size={14} />
                                                        </ThemeIcon>
                                                }
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/product')}>
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                product
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <BuildingStore size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <BuildingStore size={14} />
                                                        </ThemeIcon>
                                                }
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/machine')}>
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                machine
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <BuildingFactory2 size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <BuildingFactory2 size={14} />
                                                        </ThemeIcon>
                                                }
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/master/shift')}>
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                shift
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <Clock size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <Clock size={14} />
                                                        </ThemeIcon>
                                                }
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
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                Machine Monitor
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <DeviceDesktopAnalytics size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <DeviceDesktopAnalytics size={14} />
                                                        </ThemeIcon>
                                                }
                                            </UnstyledButton>
                                            <UnstyledButton style={{ width: '100%' }} onClick={() => router.push('/activity/planning')}>
                                                {
                                                    navbar == 250 ?
                                                        <Group position='apart'>
                                                            <Title order={6}>
                                                                Planning Machine
                                                            </Title>
                                                            <ThemeIcon color="violet" variant="light">
                                                                <CalendarStats size={14} />
                                                            </ThemeIcon>
                                                        </Group>
                                                        :
                                                        <ThemeIcon color="violet" variant="light">
                                                            <CalendarStats size={14} />
                                                        </ThemeIcon>
                                                }
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
                                        {
                                            navbar == 250 ?
                                                <div>
                                                    <Text>{user ? user.name : ''}</Text>
                                                    <Text size="xs" color="gray">{user ? user.email : ''}</Text>
                                                </div>
                                                :
                                                null
                                        }
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
