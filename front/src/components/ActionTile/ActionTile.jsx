import "./actionTile.css";

export default function ActionTile({
    component: Component = 'div',
    children,
}) {
    return (
        <Component className="action-tile">
            {children}
        </Component>
    )
}