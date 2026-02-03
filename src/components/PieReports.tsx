import { Flex } from "antd";
import { useEffect } from "react";

export default function PieReports() {
    // var [pieOpt, setPieOpt] = useState({ ...pieOptions });

    useEffect(() => {
        console.log(window.innerWidth);
    });

    return (
        <Flex gap="middle" vertical style={{ height: "100%" }}>
            <Flex flex={2} vertical>
                <Flex flex={1}>
                    <h3>这里是饼图报表页面内容</h3>
                </Flex>
                <Flex flex={15}>calendar</Flex>
            </Flex>
            <Flex flex={1}>
                <Flex>这里是饼图报表页面内容</Flex>
            </Flex>
        </Flex>
    );
}
