import {useState,useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DigitalClockComponent = ({scale=1.0, is24HourFormat=false, fontFamily='Dseg14Classic-Italic', scaleY=1.3, darkMode=false, backgroundOpacity=0.05, showDayMonth=false }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [showColon, setShowColon] = useState(true);
  const [ampm,setAmpm] = useState('');
  const [dayMonth,setDayMonth] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      //now.setHours(now.getHours() - 12); // use to test 24-hour display
      
      let hrs = now.getHours()
      // if 12 hour format, convert to number between 0 and 12
      hrs = is24HourFormat ? hrs : hrs % 12 || 12;
      // if 24 hour format, lead time with zero, otherwise, lead with blank "!" for this font.
      let hours = is24HourFormat? String(hrs).padStart(2, '0') : String(hrs).padStart(2, '!');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}${showColon ? ':' : ' '}${minutes}`);
      setAmpm( now.getHours() < 12 ? 'AM' : 'PM' );
      setShowColon((prev) => !prev);

      const dayOfWeek = now.toLocaleDateString('default', {weekday:'short'});
      const monthName = now.toLocaleString('default', { month: 'short' });
      const dayOfMonth = now.toLocaleString('default', { day: 'numeric' });

      const dayString = (`${dayOfWeek}, ${monthName} ${dayOfMonth}`).replace(/ /g,"!")
      setDayMonth( dayString )  
    };

    const timeInterval = setInterval(updateTime, 1000); // Update time every 0.1 second

    // Clear intervals when component unmounts
    return () => {
      clearInterval(timeInterval);
    };
  }, [currentTime,showColon,ampm,is24HourFormat,darkMode]);

  let tildeString = "~".repeat( dayMonth.length );
  return (
    <View style={{transform:[{scale},{scaleY}]}} >
      <View style={styles.container}>
        {/* First Column */}
        <View style={styles.column}>
          <View style={styles.row}>
            <View style={styles.background}>
              <Text style={[styles.timeText,
                            darkMode? styles.textColorDark : styles.textColorNormal,          
                            {opacity:backgroundOpacity},{fontFamily}]}>~~:~~</Text>
            </View>
            <Text style={[styles.timeText, darkMode? styles.textColorDark : styles.textColorNormal, {fontFamily}]}>{currentTime}</Text>
          </View>
        </View>
        { is24HourFormat ? '' :    
          <View style={[styles.column, styles.border]}>
          {/* Row 1 */}
          <View style={[styles.row, styles.border]}>
            <View style={styles.background}>
              <Text style={[styles.amPmText,
                            darkMode ? styles.textColorDark : styles.textColorNormal,
                            {opacity: backgroundOpacity},
                            styles.amPmBackgroundText,{fontFamily}]}>~~</Text>
            </View>
            <Text style={[styles.amPmText,{fontFamily},
                          darkMode ? styles.textColorDark : styles.textColorNormal
                          ]}>{ampm=="AM" ? "AM" : "!!"}</Text>
          </View>
          {/* Row 2 */}
          <View style={[styles.row, styles.border]}>
            <View style={styles.background}>
              <Text style={[styles.amPmText,
                            darkMode ? styles.textColorDark : styles.textColorNormal,
                            {opacity: backgroundOpacity},
                            {fontFamily}]}>~~</Text>
            </View>
            <Text style={[styles.amPmText,
                          darkMode ? styles.textColorDark : styles.textColorNormal,
                          {fontFamily}]}>{ampm=="PM" ? "PM" : "!!"}</Text>
          </View>
        </View>
        }
      </View>
      {/* show day month */}
      { showDayMonth ? 
      <View style={styles.dayMonthContainer}>
        <View style={styles.background}>
          <Text style={[styles.daymonthText,
                        darkMode ? styles.textColorDark : styles.textColorNormal,
                        {opacity: backgroundOpacity},
                        {fontFamily}]}>{tildeString}</Text>
        </View>
        <Text style={[styles.daymonthText,
                          darkMode ? styles.textColorDark : styles.textColorNormal,
                          {fontFamily}]}>{dayMonth}</Text>
      </View>
      : ''
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'flex-start', // Align items at the start (top) of the container
  },
  dayMonthContainer: {
    flexDirection: 'column', // Align children horizontally
    alignItems: 'center', // Align items at the start (top) of the container
    marginTop: 2,
  },
  column: {
    justifyContent: 'flex-start', // Align children at the start of the column
  },
  row: {
    justifyContent: 'center', // Center text vertically in row
    alignItems: 'center', // Center text horizontally in row
  },
  background: {
    position: 'absolute',
    zIndex: 1,
  },  
  timeText: {
    fontSize: 36, // Increased font size
    marginVertical: 0, // Ensure no vertical margin
  },
  amPmText: {
    fontSize: 18, // Adjust as needed
    marginVertical: 0, // Ensure no vertical margin
  },
  daymonthText: {
    fontSize: 12,
    marginVertical: 0,
  },
  textColorNormal : {
    color:'black',
    backgroundColor: 'white',
  },
  textColorDark : {
    color:'white',
    backgroundColor: 'black',
  },
});


