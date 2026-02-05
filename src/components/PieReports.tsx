import { DatePicker, Flex, Space } from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import EChartsReact from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { calendarAndPieOptions, PieSeriesData } from "../assets/StaticData";
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
        const month = selectedMonth!.split("-")[1];
        const year = selectedMonth!.split("-")[0];

        if (isFetched.current) return;
        isFetched.current = true;

        axios
            .get(`/api/pie/1/${year}/${month}`)
            .then((response) => {
                const data = (response.data as Result<calendarData>)
                    .data as calendarData;

                const pieData = data.categoryNameList.map((name) => ({
                    name,
                    value: 0,
                }));

                const scatterData: object[] = [];
                const calendarPieDatas: object[] = [];
                for (const entry of Object.keys(data.dateMap)) {
                    const [date, m] = [entry, data.dateMap[entry]];
                    let tempSum: number = 0;
                    Object.values(m).forEach((amount) => {
                        tempSum += amount;
                    });
                    scatterData.push([date, tempSum.toFixed(2)]);

                    const eachDayPieData: object[] = [];
                    Object.keys(m).forEach((categoryName) => {
                        pieData.find(
                            (item) => item.name === categoryName,
                        )!.value += m[categoryName];
                        eachDayPieData.push({
                            name: categoryName,
                            value: m[categoryName],
                        });
                    });
                    calendarPieDatas.push(
                        PieSeriesData(`pie-${date}`, date, 26, eachDayPieData),
                    );
                }

                const options = calendarAndPieOptions(
                    data.categoryNameList,
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
