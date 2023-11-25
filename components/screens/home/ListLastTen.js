import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {custom_color} from '../../../constants/Colors';
import * as Animatable from 'react-native-animatable';

function ListLastTen({latestRecords}) {
  const bahtSign = '\u0E3F';
  const [isListOpen, setListOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  useEffect(() => {
    if (isListOpen && !animationComplete) {
      const animationDuration = 500; // animation duration
      const animationInterval = 100; // animation interval

      let index = 0;
      const interval = setInterval(() => {
        if (index < latestRecords.length) {
          setAnimationComplete(false);
          index++;
        } else {
          clearInterval(interval);
          setAnimationComplete(true);
        }
      }, animationInterval);

      return () => clearInterval(interval);
    }
  }, [isListOpen, latestRecords, animationComplete]);
  if (!latestRecords) {
    return (
      <View>
        <Text style={styles.rejectText}>loading records</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleList}>
        <Text
          style={[
            styles.listhead,
            isListOpen ? styles.listheadOpen : styles.listheadClosed,
          ]}>
          Last Ten Records {isListOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {isListOpen && (
        <View style={styles.recordsContainer}>
          {latestRecords.map((item, index) => (
            <Animatable.View
              key={index}
              animation={isListOpen ? 'slideInDown' : 'slideOutUp'}
              style={[
                styles.listItem,
                {
                  opacity: animationComplete ? 1 : 0,
                  transform: [
                    {
                      translateY: isListOpen ? 0 : -40 * (index + 1),
                    },
                  ],
                },
              ]}
              duration={200} // Adjust the animation duration as needed
              delay={index * 50} // Adjust the delay to stagger the animations
            >
              {!item.source ? (
                <>
                  <Text style={styles.expenseDate}>{item.date}</Text>
                  <Text style={styles.expensePurpose}>{item.keyword}</Text>
                  <Text style={styles.expenseAmount}>
                    {bahtSign}
                    {item.amount}
                  </Text>
                  <Text style={styles.expenseDescription}>
                    {item.description.length > 13
                      ? `${item.description.slice(0, 13)}...`
                      : item.description}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.incomeDate}>{item.date}</Text>
                  <Text style={styles.incomeSource}>{item.source}</Text>
                  <Text style={styles.incomeAmount}>
                    {bahtSign}
                    {item.amount}
                  </Text>
                </>
              )}
            </Animatable.View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,

    borderColor: custom_color.light.dark_border,
    borderWidth: 1,
    borderRadius: 3,
  },
  list: {
    marginBottom: 5,

    maxHeight: 160,
    borderWidth: 1,

    borderColor: custom_color.light.dark_border,
  },
  listhead: {
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: custom_color.light.carrot_orange,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontFamily: 'LilitaOne-Regular',
    borderRadius: 2,
    borderBottomWidth: 3,
    borderColor: custom_color.light.carrot_orange_2,
  },
  listItem: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#E9E9E9ff',
    borderColor: custom_color.light.black,
    borderWidth: 1,
    borderRadius: 20,
  },
  expenseDate: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 8,
  },
  expensePurpose: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    paddingRight: 5,
    borderLeftWidth: 1,
    borderColor: '#000000ff',
  },
  expenseAmount: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
  },
  expenseDescription: {
    flex: 2,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderColor: '#FF0000ff',
    borderRightWidth: 20,
    borderRadius: 10,
  },

  incomeDate: {
    flex: 0.48,
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 7,
    paddingRight: 5,
  },
  incomeSource: {
    flex: 1.15,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000000ff',
  },
  incomeAmount: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderColor: '#000000ff',
    borderRightWidth: 20,
    borderRadius: 10,
  },

  listheadOpen: {
    backgroundColor: custom_color.light.carrot_orange, // Change to desired open color
  },
  listheadClosed: {
    backgroundColor: custom_color.light.orange_web, // Change to desired closed color
  },
});

export default ListLastTen;
