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

function createData(name, calories, fat, carbs) {
  return { name, calories, fat, carbs };
}

const rows = [
  createData("MORIN", "Laurie", "15 décembre", "Commisariat 18ème"),
  createData("MORIN", "Laurie", "15 décembre", "Commisariat 18ème"),
  createData("MORIN", "Laurie", "15 décembre", "Commisariat 18ème"),
  createData("MORIN", "Laurie", "15 décembre", "Commisariat 18ème"),
  createData("MORIN", "Laurie", "15 décembre", "Commisariat 18ème")
];

export default function TableIndicator() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 18, paddingBottom: 1 }} color="text.secondary" gutterBottom>
          Le titre de mon graphique
        </Typography>
        <TableContainer outlined="variant" component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">Nom</StyledTableCell>
                <StyledTableCell align="right">Prénom</StyledTableCell>
                <StyledTableCell align="right">Date du rendez-vous</StyledTableCell>
                <StyledTableCell align="right">Commissariat</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.calories}</StyledTableCell>
                    <StyledTableCell align="right">{row.fat}</StyledTableCell>
                    <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                  </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}