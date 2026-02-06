export const PieSeriesData = (
    id: string,
    center: string,
    radius: number = 30,
    data: object[] = [],
) => ({
    type: "pie",
    id: id,
    center: center,
    radius: radius,
    coordinateSystem: "calendar",
    label: {
        formatter: "{c}",
        position: "inside",
    },
    data: data,
    tooltip: {},
});

export const barSeriesData = (name: string, data: object[]) => ({
    name: name,
    type: "bar",
    stack: "total",
    label: {
        show: true,
    },
    emphasis: {
        focus: "series",
    },
    data: data,
});

export const calendarAndPieOptions = (
    legend: string[],
    cellSize: number[],
    selectedMonth: string,
    scatterData: object[] = [],
    pieSeries: object[] = [],
    pieData: object[] = [],
    dateList: string[] = [],
    barSeries: object[] = [],
) => ({
    grid: [{ left: "55%", right: "5%", top: "5%", bottom: "55%" }],
    xAxis: {
        gridIndex: 0,
        data: dateList,
    },
    yAxis: {
        gridIndex: 0,
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
    },
    legend: {
        data: legend,
        bottom: "1%",
    },
    calendar: {
        top: "center",
        left: "5%",
        right: "55%",
        orient: "vertical",
        cellSize: cellSize,
        yearLabel: {
            show: false,
        },
        monthLabel: {
            show: false,
        },
        dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: [
                "周日",
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六",
                "周日",
            ],
        },
        range: [selectedMonth],
    },
    series: [
        {
            id: "label",
            type: "scatter",
            coordinateSystem: "calendar",
            symbolSize: 0,
            label: {
                show: true,
                offset: [-cellSize[1] / 2 + 10, -cellSize[1] / 2 + 10],
                fontSize: 12,
            },
            data: scatterData,
        },
        {
            type: "pie",
            radius: "40%",
            data: pieData,
            tooltip: {
                trigger: "item",
            },
            center: ["75%", "75%"],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
        ...pieSeries,
        ...barSeries,
    ],
});
