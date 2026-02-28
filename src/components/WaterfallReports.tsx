import { DatePicker, Flex, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import EChartsReact from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { waterfallOptions } from "../assets/StaticData";
import { useAuth } from "../hooks/useAuth";
import type { Result, waterfallChartData } from "../types/defines";

export default function WaterfallReports() {
    const now: Dayjs = dayjs();
    const isFetched = useRef(false);

    const [selectedMonthRange, setSelectedMonthRange] = useState<string[]>([
        now.format("YYYY-MM-DD"),
        now.format("YYYY-MM-DD"),
    ]);
    const [chartOptions, setChartOptions] = useState<object>({});
    const [loaded, setLoaded] = useState<boolean>(false);

    const updateSelectedMonth = (month: string[]) => {
        setSelectedMonthRange(month);
        isFetched.current = false;
    };

    const { user } = useAuth();

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        const start = selectedMonthRange[0];
        const end = selectedMonthRange[1];

        axios
            .get(`/api/data/waterfall/${user?.id}/${start}~${end}`)
            .then((response) => {
                const data = (response.data as Result<waterfallChartData>)
                    .data as waterfallChartData;

                const dateList = data.YMDList;
                const eachDayBill = data.eachDayBill;

                const incomeData: (number | string)[] = [];
                const expenseData: (number | string)[] = [];
                const placeHolderData: (number | string)[] = [];
                let deposit = 0;
                for (const date of dateList) {
                    const dayBill = eachDayBill[date];
                    if (dayBill > 0) {
                        incomeData.push(dayBill.toFixed(2));
                        expenseData.push(0);
                    } else {
                        incomeData.push(0);
                        expenseData.push(dayBill.toFixed(2));
                    }
                    placeHolderData.push(deposit);
                    deposit += dayBill;
                }
                const opts = waterfallOptions(
                    dateList,
                    placeHolderData,
                    incomeData,
                    expenseData,
                );

                console.log(opts);
                setChartOptions(opts);
                setLoaded(true);
            })
            .catch((error) => {
                setChartOptions(waterfallOptions());
                console.log(error);
            });
    }, [selectedMonthRange, user?.id]);

    return (
        <Flex gap="middle" vertical style={{ height: "100%" }}>
            <Flex flex={1} vertical>
                <Flex flex={1} gap={"large"} align="center" justify="left">
                    <h3>收入支出瀑布图</h3>
                    <Space>
                        <DatePicker.RangePicker
                            onChange={(_, dateString) =>
                                updateSelectedMonth(dateString)
                            }
                            value={[
                                dayjs(selectedMonthRange[0]),
                                dayjs(selectedMonthRange[1]),
                            ]}
                            picker="date"
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
