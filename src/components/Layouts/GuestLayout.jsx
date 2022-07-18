import { Container } from '@mantine/core'
import Head from 'next/head'

const GuestLayout = ({ children }) => {
    return <Container>{children}</Container>
    return (
        <div>
            <Head>
                <title>Laravel</title>
            </Head>

            <div className="font-sans text-gray-900 antialiased">
                {children}
            </div>
        </div>
    )
}

export default GuestLayout
