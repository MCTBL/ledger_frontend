export type Bill = {
    id: number;
    userId: number;
    categoryId: number;
    amount: number;
    billDate: Date;
    billDescription: string;
};

export type calendarData = {
    categoryNameList: string[];
    dateMap: Record<string, Record<string, number>>;
};

export type Category = {
    id: number;
    categoryName: string;
    categoryDescription: string | null;
};

export type User = {
    id: number;
    userName: string;
    passwordHash: string;
    role: number;
};

export type Result<T> = {
    code: number;
    message: string;
    data: T;
    timestamp: number;
};
