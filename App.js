import { useCallback, useState, useEffect} from 'react';
import { Text, View, StyleSheet, StatusBar, Platform, Dimensions, TouchableOpacity } from 'react-native';
import FullScreen from "react-full-screen";

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import * as Brightness from 'expo-brightness';

import SwipeableScreens from './components/SwipeableScreens';
import {DigitalClockComponent} from './components/DigitalClockComponent';


const RoundButton = ({name,darkMode, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { borderColor: darkMode ? 'white' : 'black' },
      ]}
    >
      <Text style={[styles.buttonText, darkMode? styles.textColorDark : styles.textColorNormal]}>{name}</Text>
    </TouchableOpacity>
  );
};


const App = () => {
  const [darkMode,setDarkMode] = useState( false );
  const [brightness,setBrightness] = useState( 0.05 );
  const [scale,setScale] = useState( 2.0 );
  const [dayMonth,setDayMonth] = useState( true );
  const [fontsLoaded, fontError] = useFonts({
    'Dseg14Classic-Italic': require('./assets/fonts/DSEG14Classic-Italic.ttf')
  });

  const [isFullScreen, setIsFullScreen] = useState(false);

  const goFullScreen = () => {
    const elem = document.documentElement; // Get the document's root element

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    goFullScreen();
  };

  const refreshPageHard = () => {
    window.location.reload(true);
  };

  useEffect(() => {
    const adjustBrightness = async () => {
      try {
        // On iOS, request permission first
        if (Platform.OS === 'ios') {
          const { status } = await Brightness.requestPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to adjust brightness was denied');
            return;
          }
        }
        if (Platform.OS !== 'web') {
          await Brightness.setBrightnessAsync( darkMode ? brightness : 0.80 );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const hideNavigationBar = () =>{
      if (Platform.OS==='android'){
        NavigationBar.setVisibilityAsync('hidden');
      }
    }

    adjustBrightness();
    hideNavigationBar();

    // Optional: Return a cleanup function to reset brightness when the app is closed or goes to background
    return () => {
    };
  }, [brightness,darkMode]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const Screen1 = () =>{
    return (
      <View style={[styles.appContainer,darkMode? styles.textColorDark : styles.textColorNormal]}>
        <DigitalClockComponent scale={scale} darkMode={darkMode} showDayMonth={dayMonth} />
      </View>
    );
  }

  const initialLayout = { width: Dimensions.get('window').width };

  return (
    <>
    <StatusBar hidden />
    <View style={[styles.appContainer,darkMode? styles.textColorDark : styles.textColorNormal]}>
      <Screen1 />

      {/* Three round buttons */}
      <View style={styles.buttonContainer}>
        <RoundButton name={"DM"} darkMode={darkMode} onPress={() => {setDarkMode( ! darkMode )}} />
        <RoundButton name={"DayMon"} darkMode={darkMode} onPress={() => {setDayMonth( ! dayMonth )}} />
        <RoundButton name={"Full"} darkMode={darkMode} onPress={() => {handleFullScreen()}} />
        <RoundButton name={"Reload"} darkMode={darkMode} onPress={() => {refreshPageHard()}} />
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColorNormal:{
    color:'black',
    backgroundColor: 'white'
  },
  textColorDark:{
    color:'white',
    backgroundColor: 'black'
  },
  tabViewContainer: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    backgroundColor: '#f4f4f4',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  indicator: {
    backgroundColor: '#2196f3',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },  
});

export default App;




