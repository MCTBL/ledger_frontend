export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    password: string;
}

export interface MessageResponse {
    message: string;
}

export interface Bill {
    id: number;
    userId: number;
    categoryId: number;
    amount: number;
    isConsume: boolean;
    billDate: Date;
    billDescription: string;
}

export interface pieChartData {
    categoryNameList: string[];
    dateMap: Record<string, Record<string, number>>;
    dateList: string[];
}

export interface barChartData {
    categoryNameList: string[];
    dateMap: Record<string, Record<string, number>>;
    dateList: string[];
    YMList: string[];
}

export interface waterfallChartData {
    eachDayBill: Record<string, number[]>;
    YMDList: string[];
}

export interface Category {
    id: number;
    categoryName: string;
    categoryDescription: string | null;
}

export interface User {
    id: number;
    userName: string;
    passwordHash: string;
    role: number;
}

export interface Result<T> {
    code: number;
    message: string;
    data: T;
    timestamp: number;
}

export interface LoginResponse {
    token: string;
    userId: number;
    userName: string;
}

export interface waterfallParam {
    value: number | string;
    name: string;
    seriesName: string;
}
