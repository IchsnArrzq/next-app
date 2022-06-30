import ProgressBar from '@badrap/bar-of-progress';
import { MantineProvider, useMantineTheme } from '@mantine/core'
import Head from 'next/head'
import { Router } from 'next/router';

const App = ({ Component, pageProps }) => {
    const theme = useMantineTheme()
    const getLayout = Component.getLayout || (page => page)
    const progress = new ProgressBar({
        size: 2,
        color: theme.colors.blue[8],
        className: "bar-of-progress",
        delay: 100,
    });
    Router.events.on("routeChangeStart", progress.start);
    Router.events.on("routeChangeComplete", progress.finish);
    Router.events.on("routeChangeError", progress.finish);
    return getLayout(
        <MantineProvider
            theme={{
                headings: {
                    fontFamily: 'Roboto, sans-serif'
                }
            }}
        >
            <Head>
                <title>Page title</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <Component {...pageProps} />
        </MantineProvider>
    )
}

export default App
