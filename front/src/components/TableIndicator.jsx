import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {fr} from "@codegouvfr/react-dsfr";
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import CardContent from '@mui/material/CardContent';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: fr.colors.options.blueFrance.sun113_625.default,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function TableIndicator({
    data = {},
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 18, paddingBottom: 1 }} color="text.secondary" gutterBottom>
          {data.title}
        </Typography>
        <TableContainer outlined="variant" component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {data.tableColumns.map((columnTitle) => (
                    <StyledTableCell key={columnTitle} align="left">{columnTitle}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.rows.map((line, index) => (
                  <StyledTableRow key={index}>
                    {Object.values(line).map((value, index) => (
                        <StyledTableCell key={index} align="left">
                          {value}
                        </StyledTableCell>
                    ))}
                  </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}