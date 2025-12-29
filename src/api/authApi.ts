import axiosInstance from './axiosInstance';

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface CheckAuthPayload {
    email?: string;
    mobile?: string;
    type: 'register' | 'forgot_password';
}

export async function sendLoginOtp(payload: CheckAuthPayload): Promise<ApiResponse> {
    try {
        const { data } = await axiosInstance.post<ApiResponse>(
            '/auth/check-auth',
            payload,
        );

        return data;
    } catch (error: any) {

        if (error.response && error.response.data) {
            return error.response.data as ApiResponse;
        }

        throw error;
    }
}

// Verify OTP and set password
export type RegisterResponse = {
    success: boolean;
    message?: string;
    authToken?: string;
    user?: {
        id: number;
        email: string | null;
        mobile: string;
        role?: string;
        login_type?: string;
        createdAt?: string;
        updatedAt?: string;
    };
};

export async function verifyOtpAndSetPassword(payload: {
    otp: string;
    // password?: string;
    // email?: string;
    mobile?: string;
}): Promise<RegisterResponse> {
    const { data } = await axiosInstance.post<RegisterResponse>(
        '/auth/register',
        payload,
    );
    return data;
}

export async function logoutApi(token: string): Promise<ApiResponse> {
    const { data } = await axiosInstance.post<ApiResponse>(
        '/auth/logout',
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return data;
}
