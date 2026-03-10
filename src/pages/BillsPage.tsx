import {
    AutoComplete,
    Button,
    DatePicker,
    Flex,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Space,
    Table,
    type TableColumnsType,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import type {
    billTableData,
    Category,
    getBillsData,
    Result,
} from "../types/defines";

export default function BillsPage() {
    const [data, setData] = useState<billTableData[]>([]);
    const isFetched = useRef(false);
    const [cateFilters, setCateFilters] = useState<
        { text: string; value: string }[]
    >([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateData, setUpdataData] = useState({} as billTableData);
    const [allCategory, setAllCategory] = useState<string[]>([]);
    const [editOrNew, setEditOrNew] = useState<boolean>(false);

    const columns: TableColumnsType<billTableData> = [
        {
            title: "日期",
            dataIndex: "date",
            key: "date",
            align: "center",
            width: "20%",
            sorter: (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
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
            onFilter: (value, record) =>
                record.category.startsWith(value as string),
        },
        {
            title: "金额",
            dataIndex: "amount",
            key: "amount",
            align: "center",
            width: "20%",
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
            align: "center",
            width: "25%",
        },
        {
            title: "操作",
            key: "actions",
            align: "center",
            width: "15%",
            render: (_, record) => (
                <Space>
                    <Button
                        color="primary"
                        onClick={() => openEditModal(record)}
                        variant="filled"
                        autoInsertSpace={false}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确认删除？"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger variant="filled" autoInsertSpace={false}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const openEditModal = (record: billTableData, isEdit: boolean = true) => {
        setIsModalOpen(true);
        setUpdataData(record);
        setEditOrNew(isEdit);
    };

    function closeEditModal() {
        setIsModalOpen(false);
        setUpdataData({} as billTableData);
    }

    const handleDelete = (id: number) => {
        // TODO
        console.log(id);
    };

    const handleSubmit = (temp: SyntheticEvent) => {
        temp.nativeEvent.preventDefault();
        console.log(updateData);
        // TODO
    };

    const getOptions = () =>
        allCategory.map((v) => {
            return { value: v };
        });

    const handleUpdataDataChange = (
        which: string,
        newValue: string | number | null,
    ) => {
        const newState = { ...updateData };
        switch (which) {
            case "date":
                newState.date = newValue as string;
                break;
            case "category":
                newState.category = newValue as string;
                break;
            case "amount":
                newState.amount = newValue as number | 0;
                break;
            case "description":
                newState.description = newValue as string;
                break;
        }
        setUpdataData(newState);
    };

    const { user } = useAuth();

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        axios
            .get(`/api/bills/get/${user!.id}`)
            .then((response) => {
                const data = (response.data as Result<getBillsData>)
                    .data as getBillsData;
                const categoryList: Category[] = data.categories;
                const bills = data.bills;

                const categoriesMap = new Map<number, string>();
                categoryList.forEach((cate) => {
                    categoriesMap.set(cate.id, cate.categoryName);
                });
                setAllCategory(
                    categoryList.map((c) => {
                        return c.categoryName;
                    }),
                );

                setCateFilters(
                    categoryList.map((cate) => ({
                        text: cate.categoryName,
                        value: cate.categoryName,
                    })),
                );

                const tableData: billTableData[] = bills.map((bill) => ({
                    key: bill.id,
                    id: bill.id,
                    date: new Date(bill.billDate).toLocaleString("zh-CN", {
                        hour12: false,
                    }),
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
                    <Button
                        type="primary"
                        onClick={() => {
                            openEditModal(
                                {
                                    key: 0,
                                    id: 0,
                                    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                                    category: "",
                                    amount: 0,
                                    description: "",
                                },
                                false,
                            );
                        }}
                    >
                        添加账单
                    </Button>
                </Space>
            </Flex>
            <Flex flex={15} justify="center">
                <Table<billTableData>
                    columns={columns}
                    dataSource={data}
                    style={{ width: "90%", height: "100%" }}
                />
            </Flex>
            <Modal
                title={editOrNew ? "编辑" : "新增"}
                open={isModalOpen}
                centered={true}
                onCancel={closeEditModal}
                onOk={handleSubmit}
            >
                <Flex vertical gap="middle">
                    <Flex gap="middle">
                        <Flex flex={1} align="center" justify="center">
                            <Flex flex={3}>日期：</Flex>
                            <DatePicker
                                value={dayjs(updateData.date)}
                                showTime={{ format: "HH:mm:ss" }}
                                format="YYYY-MM-DD HH:mm:ss"
                                onChange={(_, value) =>
                                    handleUpdataDataChange(
                                        "date",
                                        value as string,
                                    )
                                }
                                style={{ flex: 8 }}
                            ></DatePicker>
                        </Flex>
                        <Flex flex={1} align="center" justify="center">
                            <Flex flex={2}>类别：</Flex>
                            <AutoComplete
                                style={{ flex: 8 }}
                                onChange={(value) =>
                                    handleUpdataDataChange("category", value)
                                }
                                options={getOptions()}
                                allowClear={true}
                                backfill={true}
                                value={updateData.category}
                            />
                        </Flex>
                    </Flex>
                    <Flex gap="middle">
                        <Flex flex={1} align="center" justify="center">
                            <Flex flex={3}>金额：</Flex>
                            <InputNumber
                                suffix="￥"
                                value={updateData.amount}
                                onChange={(value) =>
                                    handleUpdataDataChange("amount", value)
                                }
                                precision={3}
                                style={{ flex: 8 }}
                            ></InputNumber>
                        </Flex>
                        <Flex flex={1} align="center" justify="center">
                            <Flex flex={3}>备注：</Flex>
                            <Input
                                style={{ flex: 8 }}
                                onChange={(element) =>
                                    handleUpdataDataChange(
                                        "description",
                                        element.target.value,
                                    )
                                }
                                allowClear={true}
                                value={updateData.description}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Modal>
        </Flex>
    );
}
