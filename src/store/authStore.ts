import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'AUTH_TOKEN';

let inMemoryToken: string | null = null;

/**
 * Save token (Login success)
 */
export const setAuthToken = async (token: string) => {
    inMemoryToken = token;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Get token (API calls)
 */
export const getAuthToken = async (): Promise<string | null> => {
    if (inMemoryToken) return inMemoryToken;

    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    inMemoryToken = token;
    return token;
};

/**
 * Remove token (Logout)
 */
export const clearAuthToken = async () => {
    inMemoryToken = null;
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
    const token = await getAuthToken();
    return !!token;
};
