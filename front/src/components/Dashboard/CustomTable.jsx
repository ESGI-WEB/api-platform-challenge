import { Table } from "@codegouvfr/react-dsfr/Table";
import { useGetList } from "react-admin";

export default function CustomTable() {
    const { data: appointments, total, isLoading, error } = useGetList(
        'appointments',
        {
            filter: { status: 'valid' },
            sort: { field: 'created_at', order: 'DESC' },
            pagination: { page: 1, perPage: 1 },
        }
    );

    if (isLoading) {
        return null;
    }

    const rows = appointments.map(appointment => ([
        appointment.client,
        appointment.client,
        appointment.client,
        appointment.service,
        appointment.datetime
    ]));

    return (
        <Table
            bordered
            caption="Derniers rendez-vous"
            data={rows}
            fixed
            headers={[
                'Nom',
                'Prénom',
                'Email',
                'Commissariat',
                'Date de rendez-vous',
            ]}
        />
    );
}