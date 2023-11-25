import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ProgressBar from 'react-native-progress/Bar';
import {custom_color} from '../../../constants/Colors';
import {
  insertIncome,
  getIncome,
  clearAllIncome,
} from '../../../database/Income';
import {
  insertExpense,
  clearAllExpenses,
  getAllExpenses,
} from '../../../database/Expense';

function Settings() {
  const [loadingBarVisible, setLoadingBarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [incomeRecords, setIncomeRecords] = useState([]);
  const [expenseRecords, setExpenseRecords] = useState([]);

  const [progress, setProgress] = useState(0);
  const clearIcon = require('../../../assets/buttons/clear.png');
  const loadIcon = require('../../../assets/buttons/load.png');

  async function loadIncome() {
    const income = await getIncome();
    setIncomeRecords(income);
    setLoading(false);
  }

  async function loadExpenses() {
    const expense = await getAllExpenses();
    setExpenseRecords(expense);
    setLoading(false);
  }

  useEffect(() => {
    loadIncome();
    loadExpenses();
  }, []);

  const loadFromFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle();

      if (result.type === 'application/json') {
        const fileUri = result.uri;

        const fileContent = await RNFS.readFile(fileUri, 'utf8');
        const localRecords = JSON.parse(fileContent).expense_details;
        const totalRecords = localRecords.length;

        let processedRecords = 0;
        setLoadingBarVisible(true);
        for (let x = 0; x < localRecords.length; x++) {
          if (localRecords[x].is_income) {
            const incomeObject = {
              source: localRecords[x].purpose,
              amount: localRecords[x].amount,
              date: localRecords[x].date,
            };

            const existingIncomeRecord = incomeRecords.find(
              income =>
                income.source === incomeObject.source &&
                income.amount === incomeObject.amount &&
                income.date === incomeObject.date,
            );
            if (existingIncomeRecord) {
              ToastAndroid.show('Duplicate/s Detected', ToastAndroid.SHORT);
              return;
            }
            try {
              const result = await insertIncome(incomeObject);
              processedRecords++;
            } catch (error) {
              setLoadingBarVisible(false);
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
            }
          } else {
            const expenseObject = {
              keyword: localRecords[x].purpose,
              amount: localRecords[x].amount,
              description: localRecords[x].description,
              date: localRecords[x].date,
              isMonthly: localRecords[x].is_monthly,
              isBill: localRecords[x].is_bill,
            };

            const existingExpenseRecord = expenseRecords.find(
              expense =>
                expense.description === expenseObject.description &&
                expense.date === expenseObject.date &&
                expense.keyword === expenseObject.keyword &&
                expense.amount === expenseObject.amount,
            );

            if (existingExpenseRecord) {
              ToastAndroid.show('Duplicate/s Detected', ToastAndroid.SHORT);
              setLoadingBarVisible(false);
              return;
            }
            try {
              const result = await insertExpense(expenseObject);
              processedRecords++;
            } catch (error) {
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
              setLoadingBarVisible(false);
            }
          }
          setProgress(((x + 1) / totalRecords) * 100);
        }

        ToastAndroid.show(
          `Successfully loaded ${totalRecords} Records`,
          ToastAndroid.SHORT,
        );
        setLoadingBarVisible(false);
      } else if (result.type === 'cancel') {
        // Handle cancel action
      } else {
        // Handle other cases
        setLoadingBarVisible(false);
      }
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
      setLoadingBarVisible(false);
    }
  };

  const showClearConfirmIncome = () => {
    Alert.alert(
      'Clear All Income Records',
      'Are you sure you want to clear income records?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: handleClearAllIncomeRecords,
        },
      ],
      {cancelable: false},
    );
  };

  const handleClearAllIncomeRecords = async () => {
    try {
      const response = await clearAllIncome();
      ToastAndroid.show(response, ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  };

  const showClearConfirmExpense = () => {
    Alert.alert(
      'Clear All Expense Records',
      'Are you sure you want to clear expense records?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: handleClearAllExpenseRecords,
        },
      ],
      {cancelable: false},
    );
  };

  const handleClearAllExpenseRecords = async () => {
    try {
      const response = await clearAllExpenses();
      ToastAndroid.show(response, ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons_container}>
        <View style={styles.load_buttons}>
          <TouchableOpacity
            onPress={loadFromFile}
            style={styles.button_container}>
            <Image source={loadIcon} style={styles.icon} />
            <Text style={styles.buttonText}>Load Records from json</Text>
          </TouchableOpacity>

          {loadingBarVisible && (
            <View style={styles.progressbar}>
              <ProgressBar
                progress={progress / 100}
                width={280}
                height={25}
                color={custom_color.light.orange_peel}
              />
            </View>
          )}
        </View>
        <View style={styles.clearButtons}>
          <TouchableOpacity
            onPress={showClearConfirmIncome}
            style={styles.button_container}>
            <Image source={clearIcon} style={styles.icon} />
            <Text style={styles.buttonText}>Clear All Income Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showClearConfirmExpense}
            style={styles.button_container}>
            <Image source={clearIcon} style={styles.icon} />
            <Text style={styles.buttonText}>Clear All Expense Records</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flexDirection: 'column', alignItems: 'center'},
  buttonText: {fontSize: 20, fontFamily: 'LilitaOne-Regular'},
  buttons_container: {marginVertical: 50},
  button_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtons: {
    marginTop: 50,
    padding: 20,
    backgroundColor: 'rgba(255, 204, 204, 0.7) ',
    borderWidth: 5,
  },
});

export default Settings;
