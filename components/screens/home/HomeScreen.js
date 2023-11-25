import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import HomeHeader from './HomeHeader';
import HomeMenu from './HomeMenu';
import ListLastTen from './ListLastTen';
import custom_color from '../../../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {getLatestExpenses} from '../../../database/Expense';

export default function HomeScreen({navigation}) {
  const [screenIsReady, setScreenIsReady] = useState(true);
  const [latestRecords, setLatestRecords] = useState([]);
  async function loadRecords() {
    try {
      const newRecordsData = await getLatestExpenses();
      setLatestRecords(newRecordsData);
      setScreenIsReady(true);
    } catch (error) {
      setScreenIsReady(true);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadRecords();
    }, []),
  );
  if (!screenIsReady) {
    return (
      <ScrollView style={styles.container}>
        <HomeHeader />
        <View>
          <Text style={styles.rejectText}>loading records</Text>
        </View>
      </ScrollView>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <HomeHeader />
      <HomeMenu navigation={navigation} />
      {screenIsReady ? (
        <ListLastTen latestRecords={latestRecords} />
      ) : (
        <View>
          <Text style={styles.loadingText}>Loading records...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',

    backgroundColor: 'white',
    height: '100%',
  },
  loadingText: {
    fontSize: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 16,
  },
  rejectText: {
    alignContent: 'center',
    textAlign: 'center',
  },
});
