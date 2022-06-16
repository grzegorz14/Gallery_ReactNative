import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Main from "./components/Main"
import Gallery from "./components/Gallery"
import BigPhoto from "./components/BigPhoto"
import Camera from './components/Camera'
import Settings from './components/Settings'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            title: 'Main',
            headerShown: false
          }} />
        <Stack.Screen name="Gallery" component={Gallery}
          options={{
            title: "Photos from DCIM directory",
            headerStyle: {
              backgroundColor: '#2a9d8f',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }}
        />
        <Stack.Screen name="BigPhoto" component={BigPhoto}
          options={{
            title: "Photo",
            headerStyle: {
              backgroundColor: '#2a9d8f',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }}
        />
        <Stack.Screen name="Settings" component={Settings}
          options={{
            title: "Settings",
            headerStyle: {
              backgroundColor: '#2a9d8f',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }}
        />
        <Stack.Screen name="Camera" component={Camera}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;