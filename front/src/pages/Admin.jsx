import useAuth from "../auth/useAuth.jsx";

export default function Admin() {
    const {token} = useAuth();

    return (
        <div>
            <h1>Admin</h1>
            <div>Authenticated as {token}</div>
        </div>
    )
}