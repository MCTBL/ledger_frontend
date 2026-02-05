export const PieSeriesData = (
    id: string,
    center: string,
    radius: number = 26,
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
});

export const calendarAndPieOptions = (
    legend: string[],
    cellSize: number[],
    selectedMonth: string,
    scatterData: object[],
    pieSeries: object[] = [],
    pieData: object[] = [],
) => ({
    tooltip: {},
    legend: {
        data: legend,
        bottom: 20,
    },
    calendar: {
        top: "center",
        left: "5%",
        right: "55%",
        orient: "vertical",
        cellSize: cellSize,
        yearLabel: {
            show: true,
            fontSize: 30,
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
        monthLabel: {
            show: true,
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
                // formatter: function (params) {
                //     return echarts.time.format(params.value[0], "{dd}", false);
                // },
                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                fontSize: 12,
            },
            data: scatterData,
        },
        {
            type: "pie",
            radius: "75%",
            data: pieData,
            tooltip: {
                trigger: "item",
            },
            center: ["75%", "50%"],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
        ...pieSeries,
    ],
});
