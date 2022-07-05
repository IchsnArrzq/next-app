import ProgressBar from '@badrap/bar-of-progress';
import 'dayjs/locale/id'
import { useMantineTheme } from '@mantine/core'
import { Router } from 'next/router';


const App = ({ Component, pageProps }) => {
    const theme = useMantineTheme()
    const getLayout = Component.getLayout || (page => page)
    const progress = new ProgressBar({
        size: 2,
        color: theme.colors.yellow[8],
        className: "bar-of-progress",
        delay: 100,
    });
    Router.events.on("routeChangeStart", progress.start);
    Router.events.on("routeChangeComplete", progress.finish);
    Router.events.on("routeChangeError", progress.finish);
    return getLayout(
        <Component {...pageProps} />
    )
}

export default App
