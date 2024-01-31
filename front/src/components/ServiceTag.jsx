import {Tag} from "@codegouvfr/react-dsfr/Tag.js";

export default function ServiceTag({
    services = [],
    className = "",
    priority = (service) => "",
    onClick = void 0,
    component: Component = Tag,
    iconName = null,
    onIconClick = void 0,
}) {
    return (
        <div className="flex flex-row gap-2">
                {services.length > 0 && services.map((service) =>
                    <Component
                        className={className}
                        key={service.id}
                        priority={priority(service)}
                        onClick={() => onClick(service)}
                    >
                        {service.title}
                        {iconName &&
                            <i className={iconName + ' fr-ml-1w'} onClick={() => onIconClick(service)}></i>
                        }
                    </Component>
                )}
        </div>
    );
}