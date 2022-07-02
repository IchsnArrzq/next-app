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
    Container,
    Group,
    Button,
    Center,
    UnstyledButton,
    Avatar
} from '@mantine/core'
import { Settings, DoorExit, Users, Accessible, UserCheck, AppWindow } from 'tabler-icons-react';
import { useEffect, useState } from 'react';
import Link from 'next/link'
import ApplicationLogo from '../ApplicationLogo';
import { useRouter } from 'next/router';

const AppLayout = ({ children }) => {
    const router = useRouter()
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const { user, logout } = useAuth({ middleware: 'auth' })
    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [])
    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            fixed
            navbar={
                <Navbar p="md" className='bg-blue-500' hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    <Navbar.Section mb="xs">
                        <Center>
                            <ApplicationLogo />
                        </Center>
                    </Navbar.Section>
                    <Divider />
                    <Navbar.Section grow component={ScrollArea} mx="-xs" px="sm" my="lg">
                        <Group>
                            <Center>
                                master
                            </Center>
                            <Button onClick={() => router.push('/master/user')} fullWidth variant="outline" leftIcon={<Users size={14} />}>
                                users
                            </Button>
                            <Button onClick={() => router.push('/master/customer')} fullWidth variant="outline" leftIcon={<Users size={14} />}>
                                customers
                            </Button>
                            <Button onClick={() => router.push('/master/role')} fullWidth variant="outline" leftIcon={<UserCheck size={14} />}>
                                roles
                            </Button>
                            <Button onClick={() => router.push('/master/permission')} fullWidth variant="outline" leftIcon={<Accessible size={14} />}>
                                permissions
                            </Button>
                            <Button onClick={() => router.push('/master/product')} fullWidth variant="outline" leftIcon={<Accessible size={14} />}>
                                product
                            </Button>
                            <Button onClick={() => router.push('/master/machine')} fullWidth variant="outline" leftIcon={<Accessible size={14} />}>
                                machine
                            </Button>
                            <Button onClick={() => router.push('/master/shift')} fullWidth variant="outline" leftIcon={<Accessible size={14} />}>
                                shift
                            </Button>
                        </Group>
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
                <Header height={70} p="lg" color='blue'>
                    <Group  position="apart">
                        <Link href='/dashboard'>
                            <Button leftIcon={<AppWindow />} variant={`default`} component='a'>dashboard</Button>
                        </Link>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="md"
                            />
                        </MediaQuery>
                        <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
                            <Menu position='left'trigger="hover" delay={500} control={<Button leftIcon={<Settings />}>profile</Button>}>
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
            <Container size={`xl`}>
                {children}
            </Container>
        </AppShell>
    )
}

export default AppLayout
