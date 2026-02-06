import { DatePicker, Flex, Space } from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import EChartsReact from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import {
    barSeriesData,
    calendarAndPieOptions,
    PieSeriesData,
} from "../assets/StaticData";
import { type calendarData, type Result } from "../assets/TypesDefine";

export default function PieReports() {
    const now: Dayjs = dayjs();
    const isFetched = useRef(false);

    const [selectedMonth, setSelectedMonth] = useState<string>(
        now.format("YYYY-MM"),
    );
    const [chartOptions, setChartOptions] = useState<object>({});
    const [loaded, setLoaded] = useState<boolean>(false);

    const updateSelectedMonth = (month: string | string[]) => {
        if (Array.isArray(month)) {
            month = month[0];
        }
        setSelectedMonth(month);
        isFetched.current = false;
    };

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        const month = selectedMonth!.split("-")[1];
        const year = selectedMonth!.split("-")[0];

        axios
            .get(`/api/pie/1/${year}/${month}`)
            .then((response) => {
                const data = (response.data as Result<calendarData>)
                    .data as calendarData;

                const dateList = data.dateList;
                const categoryList = data.categoryNameList;

                const pieData = categoryList.map((name) => ({
                    name,
                    value: 0,
                }));

                const barData = new Map(
                    categoryList.map((name) => [name, [] as number[]]),
                );

                const scatterData: object[] = [];
                const calendarPieDatas: object[] = [];
                for (const date of dateList) {
                    const oneDayBills = data.dateMap[date];
                    let tempSum: number = 0;
                    for (const cate of categoryList) {
                        if (cate in oneDayBills) {
                            barData.get(cate)!.push(oneDayBills[cate]);
                            tempSum += oneDayBills[cate];
                        } else {
                            barData.get(cate)!.push(0);
                        }
                    }
                    scatterData.push([date, tempSum.toFixed(2)]);

                    const eachDayPieData: object[] = [];
                    Object.keys(oneDayBills).forEach((categoryName) => {
                        pieData.find(
                            (item) => item.name === categoryName,
                        )!.value += oneDayBills[categoryName];
                        eachDayPieData.push({
                            name: categoryName,
                            value: oneDayBills[categoryName],
                        });
                    });
                    calendarPieDatas.push(
                        PieSeriesData(`pie-${date}`, date, 30, eachDayPieData),
                    );
                }

                const barSeries: object[] = [];
                barData.forEach((v, k) => {
                    barSeries.push(
                        barSeriesData(
                            k,
                            v.map((n) => ({ name: k, value: n })),
                        ),
                    );
                });

                const options = calendarAndPieOptions(
                    categoryList,
                    [70, 70],
                    selectedMonth,
                    scatterData,
                    calendarPieDatas,
                    pieData,
                    dateList,
                    barSeries,
                );
                console.log(options);
                setChartOptions(options);

                setLoaded(true);
            })
            .catch((error) => {
                const options = calendarAndPieOptions(
                    [],
                    [70, 70],
                    selectedMonth,
                    [],
                    [],
                    [],
                    [],
                    [],
                );
                setChartOptions(options);
                console.log(error);
            });

        // return () => {};
    }, [selectedMonth]);

    return (
        <Flex gap="middle" vertical style={{ height: "100%" }}>
            <Flex flex={1} vertical>
                <Flex flex={1} gap={"middle"}>
                    <h3>这里是饼图报表页面内容</h3>
                    <Space>
                        <DatePicker
                            onChange={(_, dateString) =>
                                updateSelectedMonth(dateString)
                            }
                            value={dayjs(selectedMonth)}
                            picker="month"
                        />
                    </Space>
                </Flex>
                <Flex flex={15} align="center" justify="center">
                    {loaded ? (
                        <EChartsReact
                            option={{ ...chartOptions }}
                            style={{ height: "100%", width: "100%" }}
                            notMerge={true}
                        />
                    ) : null}
                </Flex>
            </Flex>
        </Flex>
    );
}
