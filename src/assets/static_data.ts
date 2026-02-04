export const pieOptions = {
    tooltip: {},
    legend: {
        data: ["Work", "Entertainment", "Sleep"],
        bottom: 20,
    },
    calendar: {
        top: "middle",
        left: "center",
        orient: "vertical",
        // cellSize: cellSize,
        yearLabel: {
            show: true,
            fontSize: 30,
        },
        dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        monthLabel: {
            show: true,
        },
        // range: ["2017-02"],
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
                // offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                fontSize: 14,
            },
            // data: scatterData,
        },
        // ...pieSeries,
    ],
};

export const static_data = {
    server: "http://localhost:9090",
};
