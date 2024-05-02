import React, { useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

const SwipeableScreens = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const screenLeft = (id) => {
    id = id - 1;
    if (id < 0) id = React.Children.count(children) - 1;
    return id;
  };

  const screenRight = (id) => {
    id = id + 1;
    if (id > React.Children.count(children) - 1) id = 0;
    return id;
  };

  const onGestureEvent = (event) => {
    const { velocityX } = event.nativeEvent;
    console.log("velocity: ", velocityX)
    if (velocityX < 0) {
      // Swipe Left
      setActiveIndex(current => screenRight(current));
    } else if (velocityX > 0) {
      // Swipe Right
      setActiveIndex(current => screenLeft(current));
    }
  };

  // Render only the active child based on activeIndex
  const activeChild = React.Children.toArray(children)[activeIndex];

  return (
    <View style={styles.container}>
      <PanGestureHandler onEnded={onGestureEvent}>
        <View style={styles.screenContainer}>
          {activeChild}
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth, // Ensure the container uses the full screen width
  },
  screenContainer: {
    flex: 1,
  },
});

export default SwipeableScreens;
