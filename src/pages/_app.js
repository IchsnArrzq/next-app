import NextNProgress from 'nextjs-progressbar'
import { useMantineTheme } from '@mantine/core'
import { Router } from 'next/router'

const App = ({ Component, pageProps }) => {
    const theme = useMantineTheme()
    const getLayout = Component.getLayout || (page => page)
    return getLayout(
        <>
            <NextNProgress
                color={theme.colors.yellow[8]}
                height={3}
                showOnShallow={true}
            />
            <Component {...pageProps} />
        </>,
    )
}

export default App
