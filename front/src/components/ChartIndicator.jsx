import {BarChart} from "@mui/x-charts";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

export default function ChartIndicator({
    data = {},
}) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                    {data.title}
                </Typography>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: data.xAxis }]}
                    series={[{ data: data.series[0].data, color: data.series[0].color }]}
                    width={500}
                    height={300}
                />
            </CardContent>
        </Card>
    )
}
