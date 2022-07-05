import { Anchor, Breadcrumbs, Card } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

export default function Breadcrumb() {

    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState(null);

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

            setBreadcrumbs(pathArray);
        }
    }, [router]);

    if (!breadcrumbs) {
        return null;
    }
    return (
        <Card>
            <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        </Card>
    )
}
