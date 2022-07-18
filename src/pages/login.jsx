import ApplicationLogo from '@/components/ApplicationLogo'
import AuthCard from '@/components/AuthCard'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import AuthValidationErrors from '@/components/AuthValidationErrors'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
    Anchor,
    Button,
    Card,
    Center,
    Group,
    PasswordInput,
    Stack,
    TextInput,
} from '@mantine/core'
import { Lock, Mail } from 'tabler-icons-react'

export default function Login() {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.query.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()
        login({ email, password, setErrors, setStatus })
    }
    return (
        <Center>
            <div
                style={{
                    width: 400,
                }}>
                <Card shadow="lg" p="lg">
                    <form onSubmit={submitForm}>
                        <Stack>
                            <Center>
                                <Anchor
                                    component={Link}
                                    href="/">
                                    <ApplicationLogo />
                                </Anchor>
                            </Center>

                            {/* Session Status */}
                            <AuthSessionStatus status={status} />

                            {/* Validation Errors */}
                            <AuthValidationErrors errors={errors} />
                            <TextInput
                                label="email"
                                placeholder="joe@example.com"
                                required
                                icon={<Mail size={16} />}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <PasswordInput
                                label="password"
                                description="password must contain 8 letter"
                                placeholder="password"
                                required
                                icon={<Lock size={16} />}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <Group position="apart">
                                <Anchor
                                    component={Link}
                                    href="/forgot-password">
                                    Forgot your password?
                                </Anchor>
                                <Button type="submit">login</Button>
                            </Group>
                        </Stack>
                    </form>
                </Card>
            </div>
        </Center>
    )

    return (
        <AuthCard
            logo={
                <Link href="/">
                    <a>
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </a>
                </Link>
            }>
            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            {/* Validation Errors */}
            <AuthValidationErrors className="mb-4" errors={errors} />

            <form onSubmit={submitForm}>
                {/* Email Address */}
                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                        autoFocus
                    />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                {/* Remember Me */}
                <div className="block mt-4">
                    <label
                        htmlFor="remember_me"
                        className="inline-flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />

                        <span className="ml-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link href="/forgot-password">
                        <a className="underline text-sm text-gray-600 hover:text-gray-900">
                            Forgot your password?
                        </a>
                    </Link>

                    <Button className="ml-3">Login</Button>
                </div>
            </form>
        </AuthCard>
    )
}

Login.getLayout = page => <GuestLayout children={page} />
