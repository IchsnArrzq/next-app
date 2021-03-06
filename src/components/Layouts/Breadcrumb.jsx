import { ActionIcon, Anchor, Breadcrumbs, Card, Group } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Settings } from 'tabler-icons-react';

export default function Breadcrumb() {

    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState(null);
    const [headers, setHeaders] = useState([])
    useEffect(() => {
        if (router) {
            const linkPath = router.asPath.split('/');
            linkPath.shift();

            const pathArray = linkPath.map((path, i) => {
                return (
                    <Anchor component={Link} href={'/' + linkPath.slice(0, i + 1).join('/')} key={i}>
                        {path}
                    </Anchor>
                )
            });
            setHeaders(linkPath)
            setBreadcrumbs(pathArray);
        }
    }, [router]);

    if (!breadcrumbs) {
        return null;
    }
    return (
        <Card>
            <Head>
                <title>{process.env.APP_NAME ?? 'Next App'} | {headers.join(' - ')}</title>
            </Head>
            <Group position='apart'>
                <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
                <ActionIcon>
                    <Settings size={16} />
                </ActionIcon>
            </Group>
        </Card>
    )
}
