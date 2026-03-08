import type { waterfallParam } from "../types/defines";

export const STATIC_FIELDS = {
    auth_token: "token",
    auth_user: "auth_user",
};

export const PieSeriesData = (id: string, center: string, radius: number = 30, data: object[] = []) => ({
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

export const barSeriesData = (name: string, data: string[]) => ({
    name: name,
    type: "bar",
    stack: "total",
    label: {
        show: true,
    },
    data: data,
    legendHoverLink: true,
    emphasis: {
        focus: "series",
    },
});

export const calendarAndPieOptions = (
    legend: string[],
    cellSize: number[],
    selectedMonth: string,
    scatterData: object[] = [],
    pieSeries: object[] = [],
    pieData: object[] = [],
) => ({
    legend: {
        data: legend,
        bottom: "1%",
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
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
            nameMap: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
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
            radius: "50%",
            data: pieData,
            tooltip: {
                trigger: "item",
            },
            label: {
                formatter: "{b}:{c}元",
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

export const barOptions = (xData: string[] = [], barSeries: object[] = []) => ({
    tooltip: {
        trigger: "axis",
        axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
        },
    },
    legend: {},
    xAxis: {
        type: "category",
        data: xData,
    },
    yAxis: {
        type: "value",
    },
    series: barSeries,
});

export const waterfallOptions = (
    dateList: string[] = [],
    placeHolderData: (number | string)[] = [],
    incomeData: (number | string)[] = [],
    expenseData: (number | string)[] = [],
) => ({
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
        formatter: function (params: waterfallParam[]) {
            let outToolTip = params[0].name + "<br/>";
            outToolTip += params[1].seriesName + " : " + Number(params[1].value).toFixed(2) + "<br/>";
            outToolTip += params[2].seriesName + " : " + Number(params[2].value).toFixed(2) + "<br/>";
            outToolTip += "结余 : " + (Number(params[0].value) + Number(params[1].value) + Number(params[2].value)).toFixed(2) + "<br/>";
            return outToolTip;
        },
    },
    legend: {
        data: ["支出", "收入"],
    },
    xAxis: {
        type: "category",
        data: dateList,
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            name: "Placeholder",
            type: "bar",
            stack: "Total",
            stackStrategy: "all",
            silent: true,
            itemStyle: {
                borderColor: "transparent",
                color: "transparent",
            },
            emphasis: {
                itemStyle: {
                    borderColor: "transparent",
                    color: "transparent",
                },
            },
            data: placeHolderData,
        },
        {
            name: "收入",
            type: "bar",
            stack: "Total",
            stackStrategy: "all",
            label: {
                show: true,
                position: "top",
                formatter: function (p: waterfallParam) {
                    return Number(p.value) === 0 ? "" : Number(p.value).toFixed(2);
                },
            },
            data: incomeData,
        },
        {
            name: "支出",
            type: "bar",
            stack: "Total",
            stackStrategy: "all",
            label: {
                show: true,
                position: "bottom",
                formatter: function (p: waterfallParam) {
                    return Number(p.value) === 0 ? "" : Number(p.value).toFixed(2);
                },
            },
            data: expenseData,
        },
    ],
});
