import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {getExpenses, insertExpense} from '../../database/Expense';
import {custom_color} from '../../constants/Colors';
import SubmitButton from '../buttons/SubmitButton';
import {Picker} from '@react-native-picker/picker';

function ExpenseForm({currentExpenseRecords}) {
  const {expenseRecords} = getExpenses();
  const monthsInYear = [
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
  const currentDate = new Date();
  const [date, setDate] = useState({
    day: currentDate.getDate().toString(),
    month: monthsInYear[currentDate.getMonth()],
    year: currentDate.getFullYear().toString(),
  });
  const [years, setYears] = useState([]);

  const currentYear = currentDate.getFullYear();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [isBill, setIsBill] = useState(false);

  const [expenseData, setExpenseData] = useState({
    keyword: '',
    amount: 0,
    description: '',
    date: '',
    isMonthly: 0,
    isBill: 0,
  });
  useEffect(() => {
    const yearsArray = Array.from({length: currentYear - 1970 + 1}, (_, i) =>
      (currentYear - i).toString(),
    );
    setYears(yearsArray);
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = Array.from(
    {
      length: getDaysInMonth(
        monthsInYear.indexOf(date.month) + 1,
        parseInt(date.year),
      ),
    },
    (_, i) => (i + 1).toString(),
  );

  const handleYearChange = year => {
    setDate(prevDate => ({
      ...prevDate,
      year,
    }));
  };

  const handleMonthChange = month => {
    setDate(prevDate => ({
      ...prevDate,
      month,
    }));
  };

  const handleExpenseSubmission = async () => {
    const formattedDate = `${date.year}-${
      monthsInYear.indexOf(date.month) + 1
    }-${date.day}`;

    const updatedExpenseData = {
      ...expenseData,
      date: formattedDate,
    };
    try {
      const response = await insertExpense(updatedExpenseData);

      ToastAndroid.show('Expense Record added Correctly', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <View style={styles.day}>
          <Text style={styles.pickerLabel}>Day</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={date.day}
              onValueChange={value => setDate({...date, day: value})}
              style={styles.picker}>
              {daysInMonth.map(day => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.month}>
          <Text style={styles.pickerLabel}>Month</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={date.month}
              onValueChange={value => handleMonthChange(value)}
              style={styles.picker}>
              {monthsInYear.map(month => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.year}>
          <Text style={styles.pickerLabel}>Year</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={date.year}
              onValueChange={value => handleYearChange(value)}
              style={styles.picker}>
              {years.map(year => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      <Text style={styles.date}>
        {date.month} {date.day}, {date.year}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={text => {
          setDescription(text);
          setExpenseData({...expenseData, description: text});
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={text => {
          setAmount(text);
          setExpenseData({...expenseData, amount: text});
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Keyword"
        value={keyword}
        onChangeText={text => {
          setKeyword(text);
          setExpenseData({...expenseData, keyword: text});
        }}
      />
      <View style={styles.checkbox_container}>
        <Text style={styles.checkbox_title}>Is Monthly?</Text>
        <Switch
          value={isMonthly}
          onValueChange={value => {
            setIsMonthly(value);
            setExpenseData({...expenseData, isMonthly: value});
          }}
          trackColor={{
            false: custom_color.light.dim_gray,
            true: custom_color.light.orange_web,
          }}
          thumbColor={
            isBill ? custom_color.light.platinum : custom_color.light.platinum
          }
        />
      </View>
      <View style={styles.checkbox_container}>
        <Text style={styles.checkbox_title}>Is Bill?</Text>
        <Switch
          value={isBill}
          onValueChange={value => {
            setIsBill(value);
            setExpenseData({...expenseData, isBill: value});
          }}
          trackColor={{
            false: custom_color.light.dim_gray,
            true: custom_color.light.orange_web,
          }}
          thumbColor={
            isBill ? custom_color.light.platinum : custom_color.light.platinum
          }
        />
      </View>
      <SubmitButton onPress={handleExpenseSubmission}></SubmitButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    padding: 16,
  },

  date: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 10,
  },
  checkbox_title: {
    flex: 1,
    alignSelf: 'center',
    fontFamily: 'LilitaOne',
    fontSize: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  checkbox_container: {
    flexDirection: 'row',
    margin: 5,
    marginVertical: 15,
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: custom_color.light.dark_border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  pickerLabel: {
    textAlign: 'center',
    fontFamily: 'LilitaOne-Regular',
    paddingVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    margin: 20,
    borderRadius: 20,
    borderColor: custom_color.light.dark_border,
    backgroundColor: custom_color.light.platinum,
  },

  picker: {
    width: 70,
  },
  day: {},
  month: {},
  year: {},
});

export default ExpenseForm;
