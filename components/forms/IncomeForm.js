import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {getIncome, insertIncome} from '../../database/Income';
import SubmitButton from '../buttons/SubmitButton';
import {Picker} from '@react-native-picker/picker';
import {custom_color} from '../../constants/Colors';

function IncomeForm({currentIncomeRecords}) {
  const {incomeRecords} = getIncome();
  const [date, setDate] = useState({
    day: '1',
    month: 'January',
    year: '2023',
  });
  const [years, setYears] = useState([]);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [incomeData, setIncomeData] = useState({
    date: date,
    amount: amount,
    source: source,
  });

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

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

  useEffect(() => {
    const yearsArray = Array.from({length: currentYear - 1970 + 1}, (_, i) =>
      (currentYear - i).toString(),
    );
    setYears(yearsArray);
  }, []);

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
      day: '1',
    }));
  };

  const handleIncomeSubmission = () => {
    const formattedDate = `${date.day}-${
      monthsInYear.indexOf(date.month) + 1
    }-${date.year}`;

    setIncomeData(prevData => ({
      ...prevData,
      date: formattedDate,
    }));

    insertIncome(incomeData)
      .then(response => {
        ToastAndroid.show(response, ToastAndroid.SHORT);
      })
      .catch(error => {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      });
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
        placeholder="Source"
        value={source}
        onChangeText={text => {
          setSource(text);
          setIncomeData({...incomeData, source: text});
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={text => {
          setAmount(text);
          setIncomeData({...incomeData, amount: text});
        }}
      />
      <SubmitButton onPress={handleIncomeSubmission}></SubmitButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
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
  checkbox_title: {flex: 1, alignSelf: 'center'},
  dateContainer: {paddingVertical: 10, flexDirection: 'row'},
  checkbox_container: {
    flexDirection: 'row',
    margin: 5,
    marginVertical: 15,
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  picker: {
    margin: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  pickerLabel: {
    paddingVertical: 10,
    textAlign: 'center',
    fontFamily: 'LilitaOne',
  },
  pickerContainer: {
    borderWidth: 1,
    margin: 10,
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

export default IncomeForm;
