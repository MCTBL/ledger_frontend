import {
    AutoComplete,
    Button,
    DatePicker,
    Flex,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Space,
    Table,
    Tooltip,
    type TableColumnsType,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState, type SyntheticEvent } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import type {
    Bill,
    billTableData,
    Category,
    getBillsData,
    Result,
} from "../types/defines";

export default function BillsPage() {
    const [data, setData] = useState<billTableData[]>([]);
    const [filteredData, setFilteredData] = useState<billTableData[]>([]);
    const [isFetched, setFetched] = useState(false);
    const [cateFilters, setCateFilters] = useState<
        { text: string; value: string }[]
    >([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateData, setUpdataData] = useState({} as billTableData);
    const [allCategory, setAllCategory] = useState<string[]>([]);
    const [editOrNew, setEditOrNew] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [filterRange, setFilterRange] = useState<(string | number)[]>([
        "",
        "",
    ]);

    const columns: TableColumnsType<billTableData> = [
        {
            title: "日期",
            dataIndex: "date",
            key: "date",
            align: "center",
            width: "20%",
            sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
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
        axios
            .delete(`/api/bills/delete/${user!.id}/${id}`)
            .then((res) => {
                const d = res.data as Result<string>;
                if (d.code != 200) throw d.message;
                setFetched(false);
                messageApi.open({
                    type: "success",
                    content: "删除成功",
                });
            })
            .catch((res) => {
                messageApi.open({
                    type: "error",
                    content: `删除失败 ${res}`,
                });
            });
    };

    const handleSubmit = (temp: SyntheticEvent) => {
        temp.nativeEvent.preventDefault();
        if (updateData.amount === 0) {
            messageApi.open({
                type: "error",
                content: `金额不可为 0`,
            });
        } else if (
            updateData.category == undefined ||
            updateData.category.length == 0
        ) {
            messageApi.open({
                type: "error",
                content: `类别不可为空`,
            });
        } else {
            const newBill = {
                id: updateData.id,
                userId: user!.id,
                categoryId: 0,
                amount: Math.abs(Number(updateData.amount)),
                consume: updateData.amount > 0 ? false : true,
                billDate: updateData.date,
                billDescription: updateData.description,
            } as Bill;

            if (editOrNew) {
                axios
                    .post(`/api/bills/update/${updateData.category}`, newBill)
                    .then((response) => {
                        const d = response.data as Result<string>;
                        if (d.code != 200) throw d.message;
                        setFetched(false);
                        closeEditModal();
                        messageApi.open({
                            type: "success",
                            content: `账单修改成功`,
                        });
                    })
                    .catch((res) => {
                        messageApi.open({
                            type: "error",
                            content: `修改失败 ${res}`,
                        });
                    });
            } else {
                axios
                    .post(`/api/bills/add/${updateData.category}`, newBill)
                    .then((response) => {
                        const d = response.data as Result<string>;
                        if (d.code != 200) throw d.message;
                        setFetched(false);
                        closeEditModal();
                        messageApi.open({
                            type: "success",
                            content: `账单添加成功`,
                        });
                    })
                    .catch((res) => {
                        messageApi.open({
                            type: "error",
                            content: `添加失败 ${res}`,
                        });
                    });
            }
        }
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
                newState.date = dayjs(newValue).format("YYYY-MM-DD HH:mm:ss");
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
        if (isFetched) return;
        setFetched(true);

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
                    date: bill.billDate,
                    category: categoriesMap.get(bill.categoryId) || "",
                    amount: bill.consume ? -bill.amount : bill.amount,
                    description: bill.billDescription,
                }));
                setData(tableData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user, isFetched]);

    useEffect(() => {
        let newFilteredData = data;
        if (filterRange[0] != null && (filterRange[0] as string).length != 0) {
            newFilteredData = newFilteredData.filter(
                (d) => d.amount >= Number(filterRange[0]),
            );
        }
        if (filterRange[1] != null && (filterRange[1] as string).length != 0) {
            newFilteredData = newFilteredData.filter(
                (d) => d.amount <= Number(filterRange[1]),
            );
        }
        setFilteredData(newFilteredData);
    }, [data, filterRange]);

    return (
        <>
            {contextHolder}
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
                                        date: dayjs().format(
                                            "YYYY-MM-DD HH:mm:ss",
                                        ),
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
                    <Space>
                        <Tooltip title="下限, 留空不限制">
                            <InputNumber
                                onChange={(value) => {
                                    setFilterRange([
                                        value as number,
                                        filterRange[1],
                                    ]);
                                }}
                                value={filterRange[0]}
                            ></InputNumber>
                        </Tooltip>
                    </Space>
                    <Space> ~ </Space>
                    <Space>
                        <Tooltip title="上限, 留空不限制">
                            <InputNumber
                                onChange={(value) => {
                                    setFilterRange([
                                        filterRange[0],
                                        value as number,
                                    ]);
                                }}
                                value={filterRange[1]}
                            ></InputNumber>
                        </Tooltip>
                    </Space>
                </Flex>
                <Flex flex={15} justify="center">
                    <Table<billTableData>
                        columns={columns}
                        dataSource={filteredData}
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
                                        handleUpdataDataChange(
                                            "category",
                                            value,
                                        )
                                    }
                                    options={getOptions()}
                                    allowClear={true}
                                    backfill={true}
                                    value={updateData.category as ""}
                                    status={
                                        updateData.category == undefined ||
                                        updateData.category.length == 0
                                            ? "error"
                                            : ""
                                    }
                                />
                            </Flex>
                        </Flex>
                        <Flex gap="middle">
                            <Flex flex={1} align="center" justify="center">
                                <Flex flex={3}>金额：</Flex>
                                <InputNumber
                                    style={{ flex: 8 }}
                                    suffix="￥"
                                    value={updateData.amount}
                                    onChange={(value) =>
                                        handleUpdataDataChange("amount", value)
                                    }
                                    precision={3}
                                    status={
                                        Number(updateData.amount) == 0
                                            ? "error"
                                            : ""
                                    }
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
        </>
    );
}
