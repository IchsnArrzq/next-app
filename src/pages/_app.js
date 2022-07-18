import NextNProgress from 'nextjs-progressbar'
import { MantineProvider, useMantineTheme } from '@mantine/core'
import { Router } from 'next/router'
import { NotificationsProvider } from '@mantine/notifications'

const App = ({ Component, pageProps }) => {
    const theme = useMantineTheme()
    const getLayout = Component.getLayout || (page => page)
    return getLayout(
        <MantineProvider
            theme={{
                headings: {
                    fontFamily: 'Roboto, sans-serif',
                },
                colorScheme: 'light',
            }}>
            <NextNProgress
                color={theme.colors.yellow[8]}
                height={3}
                showOnShallow={true}
            />
            <NotificationsProvider>
                <Component {...pageProps} />
            </NotificationsProvider>
        </MantineProvider>,
    )
}

export default App
