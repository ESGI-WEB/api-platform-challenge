import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import LinkButton from "../LinkButton/LinkButton.jsx";
import {Rating} from "@mui/material";

export default function FeedbacksTable({
    answers = [],
    tableContainer: TableContainerComponent = TableContainer,
    table: TableComponent = Table,
    tableHead: TableHeadComponent = TableHead,
    tableRow: TableRowComponent = TableRow,
    tableCell: TableCellComponent = TableCell,
    tableBody: TableBodyComponent = TableBody,
    paper: PaperComponent = Paper,
}) {
    const {t, i18n} = useTranslation();

    return (
        <TableContainerComponent component={PaperComponent}>
            <TableComponent sx={{ minWidth: 650 }}>
                <TableHeadComponent>
                    <TableRowComponent>
                        <TableCellComponent>{t('question')}</TableCellComponent>
                        <TableCellComponent>{t('answer')}</TableCellComponent>
                        <TableCellComponent>{t('client')}</TableCellComponent>
                        <TableCellComponent>{t('service')}</TableCellComponent>
                        <TableCellComponent>{t('provider')}</TableCellComponent>
                        <TableCellComponent>{t('appointment_short')}</TableCellComponent>
                    </TableRowComponent>
                </TableHeadComponent>
                <TableBodyComponent>
                    {answers.map((answer) => (
                        <TableRowComponent key={answer.id}>
                            <TableCellComponent>{answer.feedback.question}</TableCellComponent>
                            <TableCellComponent>
                                {answer.feedback.type === 'mark' ?
                                    <Rating defaultValue={answer.answer} readOnly/> : <Typography>{answer.answer}</Typography>
                                }
                            </TableCellComponent>
                            <TableCellComponent>
                                {answer.appointment.client.firstname} {answer.appointment.client.lastname}
                            </TableCellComponent>
                            <TableCellComponent>
                                <Typography>
                                    {answer.feedback.service.title}
                                </Typography>
                                <Typography sx={{fontStyle: 'italic', fontSize: '10px'}}>
                                    {answer.feedback.service.organisation.name}
                                </Typography>
                            </TableCellComponent>
                            <TableCellComponent>
                                {answer.appointment.provider.firstname} {answer.appointment.provider.lastname}
                            </TableCellComponent>
                            <TableCellComponent>
                                <LinkButton to={`/appointments/${answer.appointment.id}`}>
                                    #{answer.appointment.id} {t('on')} {new Date(answer.appointment.datetime).toLocaleDateString(i18n.language, {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </LinkButton>
                            </TableCellComponent>
                        </TableRowComponent>
                    ))}
                </TableBodyComponent>
            </TableComponent>
        </TableContainerComponent>
    );
}