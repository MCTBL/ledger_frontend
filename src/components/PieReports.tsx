import { DatePicker, Flex, Space } from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import EChartsReact from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { calendarAndPieOptions, PieSeriesData } from "../assets/StaticData";
import type { pieChartData, Result } from "../types/defines";

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
            .get(`/api/data/pie/1/${year}/${month}`)
            .then((response) => {
                const data = (response.data as Result<pieChartData>)
                    .data as pieChartData;

                const dateMap = data.dateMap;
                const categoryList = data.categoryNameList;

                const pieData = categoryList.map((name) => ({
                    name,
                    value: 0,
                }));
                const scatterData: object[] = [];
                const calendarPieDatas: object[] = [];

                for (const entry of Object.entries(dateMap)) {
                    const date = entry[0];
                    const eachDay = entry[1];
                    const dayHasCategories = Object.keys(eachDay);
                    const eachDayPieData: object[] = [];
                    let eachDayConsume = 0;
                    for (const t of categoryList) {
                        if (dayHasCategories.includes(t)) {
                            pieData.find((item) => item.name === t)!.value +=
                                eachDay[t];
                            eachDayPieData.push({
                                name: t,
                                value: eachDay[t],
                            });
                            eachDayConsume += eachDay[t];
                        }
                    }
                    scatterData.push([data, eachDayConsume]);
                    calendarPieDatas.push(
                        PieSeriesData(`pie-${date}`, date, 30, eachDayPieData),
                    );
                }

                const options = calendarAndPieOptions(
                    categoryList,
                    [70, 70],
                    selectedMonth,
                    scatterData,
                    calendarPieDatas,
                    pieData,
                );
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
                );
                setChartOptions(options);
                console.log(error);
            });

        // return () => {};
    }, [selectedMonth]);

    return (
        <Flex gap="middle" vertical style={{ height: "100%" }}>
            <Flex flex={1} vertical>
                <Flex flex={1} gap={"large"} align="center" justify="left">
                    <h3>支出占比可视化</h3>
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
                    ) : (
                        <div>加载中...</div>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}
