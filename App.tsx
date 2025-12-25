/**
 * @format
 */

import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import OnboardingFlow from './src/screens/OnboardingFlow';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/OtpScreen';
import DeviceListScreen, { Device } from './src/screens/device/DeviceListScreen';
import PreviewScreen from './src/screens/device/PreviewScreen';

type Route = 'welcome' | 'onboarding' | 'login' | 'otp' | 'devices' | 'preview';

function App(): React.JSX.Element {
  const [route, setRoute] = useState<Route>('welcome');
  const [mobile, setMobile] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(undefined);

  const handleDone = () => setRoute('login');
  const handleGetStarted = () => setRoute('onboarding');
  const handleHaveAccount = () => setRoute('login');

  const goToOtp = (value: string) => {
    setMobile(value);
    setRoute('otp');
  };

  const goBackToLogin = () => setRoute('login');

  let screen = (
    <WelcomeScreen
      onGetStarted={handleGetStarted}
      onHaveAccount={handleHaveAccount}
    />
  );

  if (route === 'onboarding') {
    screen = (
      <OnboardingFlow onDone={handleDone} onBackToWelcome={() => setRoute('welcome')} />
    );
  } else if (route === 'login') {
    screen = <LoginScreen onContinue={goToOtp} />;
  } else if (route === 'otp') {
    screen = (
      <OtpScreen
        mobile={mobile}
        onBack={goBackToLogin}
        onVerify={() => setRoute('devices')}
      />
    );
  } else if (route === 'devices') {
    screen = (
      <DeviceListScreen
        onDevicePress={device => {
          setSelectedDevice(device);
          setRoute('preview');
        }}
      />
    );
  } else if (route === 'preview') {
    screen = (
      <PreviewScreen
        device={selectedDevice}
        onBack={() => setRoute('devices')}
      />
    );
  }

  return <SafeAreaProvider>{screen}</SafeAreaProvider>;
}

export default App;
