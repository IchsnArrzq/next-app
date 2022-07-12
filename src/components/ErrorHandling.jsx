import { Card, Code, Group, Text, Title } from '@mantine/core'
import { Prism } from '@mantine/prism'
import React from 'react'

export default function ErrorHandling({ errors }) {
    return (
        <Card>
            <Card.Section p={'xl'}>
                <Group position='apart'>
                    <Title order={3}>{errors.name}</Title>
                    <Title order={3}>{errors.message}</Title>
                </Group>
            </Card.Section>
            <Prism withLineNumbers language='json'>
                {JSON.stringify(errors)}
            </Prism>
        </Card>
    )
}
