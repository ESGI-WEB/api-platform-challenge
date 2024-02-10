import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useTranslation} from "react-i18next";
import LoadableButton from "../LoadableButton/LoadableButton.jsx";
import {useEffect} from "react";

export default function ProvidersToValidateTable({
    loadingNewRole = {},
    handleClickEditRole,
    providers = [],
    tableContainer: TableContainerComponent = TableContainer,
    table: TableComponent = Table,
    tableHead: TableHeadComponent = TableHead,
    tableRow: TableRowComponent = TableRow,
    tableCell: TableCellComponent = TableCell,
    tableBody: TableBodyComponent = TableBody,
    paper: PaperComponent = Paper,
}) {
    const {t, i18n} = useTranslation();
    const ROLE_PROVIDER = "ROLE_PROVIDER";
    const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";

    useEffect(() => {
        console.log(loadingNewRole);
    }, [loadingNewRole]);

    return (
        <TableContainerComponent component={PaperComponent}>
            <TableComponent sx={{ minWidth: 650 }}>
                <TableHeadComponent>
                    <TableRowComponent>
                        <TableCellComponent>{t('lastname')}</TableCellComponent>
                        <TableCellComponent>{t('firstname')}</TableCellComponent>
                        <TableCellComponent>{t('email')}</TableCellComponent>
                        <TableCellComponent>{t('phone')}</TableCellComponent>
                        <TableCellComponent>{t('date_of_request')}</TableCellComponent>
                        <TableCellComponent>{t('validate_or_refuse')}</TableCellComponent>
                    </TableRowComponent>
                </TableHeadComponent>
                <TableBodyComponent>
                    {providers.map((provider) => (
                        <TableRowComponent key={provider.id}>
                            <TableCellComponent>
                                {provider.lastname}
                            </TableCellComponent>
                            <TableCellComponent>
                                {provider.firstname}
                            </TableCellComponent>
                            <TableCellComponent>
                                {provider.email}
                            </TableCellComponent>
                            <TableCellComponent>
                                {provider.phone}
                            </TableCellComponent>
                            <TableCellComponent>
                                {new Date(provider.createdAt).toLocaleDateString(i18n.language, {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </TableCellComponent>
                            <TableCellComponent>
                                <LoadableButton isLoading={loadingNewRole[provider.id]} onClick={() => handleClickEditRole(provider.id, ROLE_PROVIDER)}>
                                    <i className="ri-checkbox-circle-line"></i>
                                </LoadableButton>
                                <LoadableButton isLoading={loadingNewRole[provider.id]} onClick={() => handleClickEditRole(provider.id, ROLE_EMPLOYEE)} priority="secondary">
                                    <i className="ri-close-circle-line"></i>
                                </LoadableButton>
                            </TableCellComponent>
                        </TableRowComponent>
                    ))}
                </TableBodyComponent>
            </TableComponent>
        </TableContainerComponent>
    );
}