import { Button, Flex, Popconfirm, Space, Table, type TableColumnsType } from "antd";
import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import type { billTableData, Category, getBillsData, Result } from "../types/defines";

export default function BillsPage() {
    const [data, setData] = useState<billTableData[]>([]);
    const isFetched = useRef(false);
    const [cateFilters, setCateFilters] = useState<{ text: string; value: string }[]>([]);
    const columns: TableColumnsType<billTableData> = [
        {
            title: "日期",
            dataIndex: "date",
            key: "date",
            align: "center",
            width: "20%",
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: "分类",
            dataIndex: "category",
            key: "category",
            align: "center",
            width: "10%",
            filters: cateFilters,
            filterMode: "menu",
            filterSearch: true,
            onFilter: (value, record) => record.category.startsWith(value as string),
        },
        { title: "金额", dataIndex: "amount", key: "amount", align: "center", width: "20%", sorter: (a, b) => a.amount - b.amount },
        { title: "描述", dataIndex: "description", key: "description", align: "center", width: "25%" },
        {
            title: "操作",
            key: "actions",
            align: "center",
            width: "15%",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => openEditModal(record)}>编辑</Button>
                    <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
                        <Button danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const openEditModal = (record: billTableData) => {
        // 打开编辑模态框，预填充 record 数据
    };

    const handleDelete = (id: number) => {
        // 调用 API 删除账单项，刷新表格数据
    };

    const { user } = useAuth();

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        axios
            .get(`/api/bills/get/${user!.id}`)
            .then((response) => {
                const data = (response.data as Result<getBillsData>).data as getBillsData;
                const categoryList: Category[] = data.categories;
                const bills = data.bills;

                const categoriesMap = new Map<number, string>();
                categoryList.forEach((cate) => {
                    categoriesMap.set(cate.id, cate.categoryName);
                });

                setCateFilters(categoryList.map((cate) => ({ text: cate.categoryName, value: cate.categoryName })));

                const tableData: billTableData[] = bills.map((bill) => ({
                    key: bill.id,
                    id: bill.id,
                    date: new Date(bill.billDate).toLocaleString("zh-CN", { hour12: false }),
                    category: categoriesMap.get(bill.categoryId) || "",
                    amount: bill.consume ? -bill.amount : bill.amount,
                    description: bill.billDescription,
                }));
                setData(tableData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user]);

    return (
        <Flex gap="middle" vertical style={{ height: "100%" }}>
            <Flex flex={1} gap="large" align="center" justify="left">
                <h3>账单详情</h3>
                <Space>
                    <Button type="primary" onClick={() => openEditModal({ key: 0, id: 0, date: "", category: "", amount: 0, description: "" })}>
                        添加账单
                    </Button>
                </Space>
            </Flex>
            <Flex flex={15} justify="center">
                <Table<billTableData> columns={columns} dataSource={data} style={{ width: "100%", height: "100%" }} />
            </Flex>
        </Flex>
    );
}
