import { DatePicker, Flex, Space } from "antd";
import axios from "axios";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import EChartsReact from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { barOptions, barSeriesData } from "../assets/StaticData";
import type { barChartData, Result } from "../assets/TypesDefine";

export default function BarReports() {
    const now: Dayjs = dayjs();
    const isFetched = useRef(false);

    const [selectedMonthRange, setSelectedMonthRange] = useState<string[]>([
        now.format("YYYY-MM"),
        now.format("YYYY-MM"),
    ]);
    const [chartOptions, setChartOptions] = useState<object>({});
    const [loaded, setLoaded] = useState<boolean>(false);

    const updateSelectedMonth = (month: string[]) => {
        setSelectedMonthRange(month);
        isFetched.current = false;
    };

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        const start = selectedMonthRange[0];
        const end = selectedMonthRange[1];

        axios
            .get(`/api/data/bar/1/${start}-01~${end}-01`)
            .then((response) => {
                const data = (response.data as Result<barChartData>)
                    .data as barChartData;

                const dateMap = data.dateMap;
                const categoryList = data.categoryNameList;
                const YMList = data.YMList;

                const cateMap = new Map();
                categoryList.forEach((cate) => {
                    cateMap.set(cate, []);
                });

                for (const date of Object.values(YMList)) {
                    const eachDay = dateMap[date];
                    const dayHasCategories = Object.keys(eachDay);
                    for (const key of cateMap.keys()) {
                        if (dayHasCategories.includes(key)) {
                            cateMap.get(key).push(eachDay[key]);
                        } else {
                            cateMap.get(key).push(0);
                        }
                    }
                }

                const barSeries: object[] = [];

                for (const entry of cateMap.entries()) {
                    barSeries.push(barSeriesData(entry[0], entry[1]));
                }

                const bOpts = barOptions(YMList, barSeries);
                setChartOptions(bOpts);

                setLoaded(true);
            })
            .catch((error) => {
                setChartOptions(barOptions());
                console.log(error);
            });

        // return () => {};
    }, [selectedMonthRange]);

    return (
        <Flex gap="middle" vertical style={{ height: "100%" }}>
            <Flex flex={1} vertical>
                <Flex flex={1} gap={"large"} align="center" justify="left">
                    <h3>每月各类开销占比</h3>
                    <Space>
                        <DatePicker.RangePicker
                            onChange={(_, dateString) =>
                                updateSelectedMonth(dateString)
                            }
                            value={[
                                dayjs(selectedMonthRange[0]),
                                dayjs(selectedMonthRange[1]),
                            ]}
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
