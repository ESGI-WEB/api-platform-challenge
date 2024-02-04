import {Tag} from "@codegouvfr/react-dsfr/Tag.js";

export default function ServiceTag({
    services = [],
    className = "",
    priority = (service) => "",
    onTagClick = void 0,
    component: Component = Tag,
    iconName = null,
    onIconClick = void 0,
}) {
    return (
        <div className="flex flex-row gap-2">
                {services.length > 0 && services.map((service) =>
                    <div key={service.id}>
                        <Component
                            className={className}
                            priority={priority(service)}
                            onClick={() => onTagClick(service)}
                        >
                            {service.title}
                        </Component>
                        {iconName &&
                            <i className={iconName} onClick={() => onIconClick(service)}></i>
                        }
                    </div>
                )}
        </div>
    );
}