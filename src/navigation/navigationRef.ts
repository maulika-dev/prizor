import { createNavigationContainerRef } from '@react-navigation/native';
import { RootRoutes, RootStackParamList } from '../navigation/routes';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetToLogin() {
    if (!navigationRef.isReady()) return;

    navigationRef.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    });
}

export function resetToDevices() {
    if (!navigationRef.isReady()) return;
    navigationRef.reset({
        index: 0,
        routes: [{ name: 'Devices' }],
    });
}
export function resetToAddTab() {
    if (!navigationRef.isReady()) return;
    navigationRef.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
    });
}
