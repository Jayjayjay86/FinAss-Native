import React, {useState, useEffect, useCallback} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import HomeScreen from './components/screens/home/HomeScreen';
import ListAll from './components/screens/list/ListAll';
import CreateRecord from './components/screens/create/CreateRecords';
import AnalysisChoice from './components/screens/analysis/AnalysisChoice';
import Settings from './components/screens/settings/Settings';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const Stack = createNativeStackNavigator();
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  useEffect(() => {
    async function prepare() {
      try {
        SplashScreen.hide();
      } finally {
        setAppIsReady(true);

        await onLoadedRevealApp();
      }
    }

    prepare();
  }, []);

  const onLoadedRevealApp = useCallback(async () => {
    if (appIsReady) {
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="List"
          component={ListAll}
          options={{
            headerTitle: 'Back',
            headerTitleStyle: {
              fontSize: 18,
              color: 'black',
              fontFamily: 'LilitaOne-Regular',
            },
          }}
        />
        <Stack.Screen
          name="Create"
          component={CreateRecord}
          options={{
            headerTitle: 'Back',
            headerTitleStyle: {
              fontSize: 18,
              color: 'black',
              fontFamily: 'LilitaOne-Regular',
            },
          }}
        />
        <Stack.Screen
          name="Analysis"
          component={AnalysisChoice}
          options={{
            headerTitle: 'Back',
            headerTitleStyle: {
              fontSize: 18,
              color: 'black',
              fontFamily: 'LilitaOne-Regular',
            },
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerTitle: 'Back',
            headerTitleStyle: {
              fontSize: 18,
              color: 'black',
              fontFamily: 'LilitaOne-Regular',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
