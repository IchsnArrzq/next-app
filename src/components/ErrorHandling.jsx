import { Card, Title } from '@mantine/core'
import React from 'react'

export default function ErrorHandling({ errors }) {
    console.log(errors)
    return (
        <Card style={{backgroundColor: 'yellow', color: 'black'}}>
            <Card.Section>
                <Title order={6}>error</Title>
            </Card.Section>
            {JSON.stringify(errors)}
        </Card>
    )
}
