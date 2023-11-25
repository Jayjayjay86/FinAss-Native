import React, {useState, useEffect} from 'react';
import {custom_color} from '../../../constants/Colors';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const DebtCalculator = () => {
  const [debtAmount, setDebtAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [weeklyPayment, setWeeklyPayment] = useState('');
  const bahtSign = '\u0E3F';
  const [results, setResults] = useState({
    payoffTime: '',
    totalInterest: '',
  });

  const calculatePayoffTime = () => {
    if (debtAmount && interestRate && weeklyPayment) {
      const principal = parseFloat(debtAmount);
      const rate = parseFloat(interestRate) / 100 / 52; // Convert annual interest rate to weekly rate
      const payment = parseFloat(weeklyPayment);

      // Calculate the number of weeks to pay off the debt
      const n =
        Math.log(payment / (payment - rate * principal)) / Math.log(1 + rate);

      // Calculate the total interest paid
      const totalInterestPaid = n * payment - principal;

      return {
        payoffTime: `${Math.ceil(n)} weeks`,
        totalInterest: `${bahtSign}${totalInterestPaid.toFixed(2)}`,
      };
    } else {
      return {
        payoffTime: '',
        totalInterest: '',
      };
    }
  };

  const copyToClipboard = async () => {
    const textToCopy = `Estimated Payoff Time: ${results.payoffTime}\nTotal Interest Paid: ${results.totalInterest}`;
    Clipboard.setString(textToCopy);
  };

  useEffect(() => {
    // Calculate and update results whenever inputs change
    const updatedResults = calculatePayoffTime();
    setResults(updatedResults);
  }, [debtAmount, interestRate, weeklyPayment]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Debt Payoff Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Debt Amount"
        value={debtAmount}
        onChangeText={text => setDebtAmount(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChangeText={text => setInterestRate(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weekly Payment"
        value={weeklyPayment}
        onChangeText={text => setWeeklyPayment(text)}
        keyboardType="numeric"
      />

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Estimated Payoff Time: {results.payoffTime}
        </Text>
        <Text style={styles.resultText}>
          Total Interest Paid: {results.totalInterest}
        </Text>
      </View>

      <Button title="Copy Results" onPress={copyToClipboard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: custom_color.light.lightest_background,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: custom_color.light.dark_border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default DebtCalculator;
