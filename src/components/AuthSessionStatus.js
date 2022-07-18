const AuthSessionStatus = ({ status, className, ...props }) => (
    <>{status && <div {...props}>{status}</div>}</>
)

export default AuthSessionStatus
