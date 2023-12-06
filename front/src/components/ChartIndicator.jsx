import {LineChart} from "@mui/x-charts";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

export default function ChartIndicator() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                    Le titre de mon graphique
                </Typography>
                <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                            color: "var(--blue-france-sun-113-625)",
                        },
                    ]}
                    width={500}
                    height={300}
                />
            </CardContent>
        </Card>
    )
}
