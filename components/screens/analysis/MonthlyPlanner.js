import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {custom_color} from '../../../constants/Colors';
import {PieChart} from 'react-native-chart-kit';
import {Picker} from '@react-native-picker/picker';
import {getAllExpenses} from '../../../database/Expense';
import {useFocusEffect} from '@react-navigation/native';

const MonthlyPlanner = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const bahtSign = '\u0E3F';
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [uniqueKeywords, setUniqueKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    setLoading(true);
    try {
      const expensedata = await getAllExpenses();
      setExpenses(expensedata);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  const totalForSelectedMonth = expenses
    .filter(
      expense =>
        new Date(expense.date).getMonth() === selectedMonth &&
        expense.isMonthly === 1,
    )
    .reduce((total, expense) => total + expense.amount, 0);

  useEffect(() => {
    const monthlyBillRecords = expenses.filter(expense => {
      return (
        expense.isMonthly === 1 &&
        new Date(expense.date).getMonth() === selectedMonth
      );
    });

    const uniqueKeywords = Array.from(
      new Set(monthlyBillRecords.map(expense => expense.keyword)),
    );
    setUniqueKeywords(uniqueKeywords);
  }, [selectedMonth, expenses]);

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    return `#${'0'.repeat(6 - randomColor.length)}${randomColor}`;
  };

  const pieChartData = uniqueKeywords.map(keyword => {
    const totalAmount = expenses
      .filter(
        expense =>
          expense.keyword === keyword &&
          new Date(expense.date).getMonth() === selectedMonth &&
          expense.isMonthly === 1,
      )
      .reduce((total, expense) => total + expense.amount, 0);

    return {
      name: keyword,
      amount: totalAmount,
      color: getRandomColor(),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    };
  });

  const uniqueMonths = Array.from(
    new Set(expenses.map(expense => new Date(expense.date).getMonth())),
  );

  function getMonthName(monthIndex) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[monthIndex];
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={itemValue => setSelectedMonth(itemValue)}>
        {uniqueMonths.map((month, index) => (
          <Picker.Item key={index} label={getMonthName(month)} value={month} />
        ))}
      </Picker>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total for {getMonthName(selectedMonth)}:
        </Text>
        <Text style={styles.totalAmount}>
          {bahtSign}
          {totalForSelectedMonth}
        </Text>
      </View>

      <FlatList
        style={styles.listContainer}
        data={Array.from(new Set(uniqueKeywords))}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              setSelectedKeyword(selectedKeyword === item ? null : item)
            }
            style={styles.keywordItem}>
            <Text style={styles.keywordText}>{item}</Text>
            <Text style={styles.keywordTotal}>
              Total: {bahtSign}
              {expenses
                .filter(
                  expense =>
                    expense.keyword === item &&
                    new Date(expense.date).getMonth() === selectedMonth,
                )
                .reduce((total, expense) => total + expense.amount, 0)}
            </Text>
            {selectedKeyword === item && (
              <View style={styles.expensesAccordion}>
                {expenses
                  .filter(
                    expense =>
                      expense.keyword === item &&
                      new Date(expense.date).getMonth() === selectedMonth &&
                      expense.isMonthly === 1,
                  )
                  .map((expense, index) => (
                    <View key={index} style={styles.expenseItem}>
                      <Text>{expense.date}</Text>
                      <Text>{expense.isMonthly}</Text>
                      <Text>{expense.description}</Text>
                      <Text>
                        {bahtSign}
                        {expense.amount}
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      <PieChart
        data={pieChartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: '90%'},
  listContainer: {
    margin: 15,
  },
  keywordItem: {
    padding: 10,
    backgroundColor: custom_color.light.platinum,
    borderColor: custom_color.light.black,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalAmount: {margin: 5},
  totalText: {
    margin: 5,

    fontSize: 18,
    fontFamily: 'LilitaOne-Regular',
  },

  keywordText: {
    fontSize: 18,
    fontFamily: 'LilitaOne-Regular',
  },
  keywordTotal: {
    fontSize: 16,
    color: custom_color.light.carrot_orange,
  },
  expensesAccordion: {
    padding: 10,
    borderColor: custom_color.light.black,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
  },
  expenseItem: {
    flexDirection: 'column',
    marginVertical: 5,
    padding: 10,
    backgroundColor: custom_color.light.platinum,
    borderColor: custom_color.light.black,
    borderWidth: 1,
    borderRadius: 20,
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default MonthlyPlanner;
