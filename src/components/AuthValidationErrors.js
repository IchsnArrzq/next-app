import { List, Text, Title } from '@mantine/core'

const AuthValidationErrors = ({ errors = [] }) => (
    <>
        {errors.length > 0 && (
            <div>
                <Title order={6} color="red">
                    Whoops! Something went wrong.
                </Title>
                <List size={'xs'}>
                    {errors.map(error => (
                        <List.Item key={error}>{error}</List.Item>
                    ))}
                </List>
            </div>
        )}
    </>
)

export default AuthValidationErrors
