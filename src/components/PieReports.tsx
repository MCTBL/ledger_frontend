import { DatePicker, Flex, Space } from "antd";
import axios from "axios";
import EChartsReact from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { pieOptions, static_data } from "../assets/static_data";

export default function PieReports() {
    // var [pieOpt, setPieOpt] = useState({ ...pieOptions });

    const calendar = useRef<HTMLElement>(null);
    const chartRef = useRef<EChartsReact>(null);

    const [selectedMonth, setSelectedMonth] = useState<string>("2025-12");

    const updateSelectedMonth = (month: string | string[]) => {
        if (Array.isArray(month)) {
            month = month[0];
        }
        setSelectedMonth(month);
    };

    useEffect(() => {
        const month = selectedMonth.split("-")[1];
        const year = selectedMonth.split("-")[0];

        const api = axios.create({
            baseURL: static_data.server,
            withCredentials: true, // 跨域请求时发送cookies
            timeout: 10000,
        });

        api.get(`/pie/1/${year}/${month}`).then((response) => {
            if (chartRef.current) {
                // chartRef.current.getEchartsInstance().setOption({});
            }
            console.log(response.data);
        });
    }, [calendar, selectedMonth]);

    return (
        <Flex gap="middle" vertical style={{ height: "100%" }}>
            <Flex flex={2} vertical>
                <Flex flex={1} gap={"middle"}>
                    <h3>这里是饼图报表页面内容</h3>
                    <Space>
                        <DatePicker onChange={(_, dateString) => updateSelectedMonth(dateString)} picker="month" />
                    </Space>
                </Flex>
                <Flex flex={15} ref={calendar}>
                    <EChartsReact option={{ ...pieOptions }} ref={chartRef} />
                </Flex>
            </Flex>
            <Flex flex={1}>
                <Flex>这里是饼图报表页面内容</Flex>
            </Flex>
        </Flex>
    );
}
