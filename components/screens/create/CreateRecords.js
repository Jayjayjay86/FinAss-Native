import React, {useState, useEffect} from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import ExpenseForm from '../../forms/ExpenseForm';
import IncomeForm from '../../forms/IncomeForm';
import {custom_color} from '../../../constants/Colors';
import {getExpenses} from '../../../database/Expense';
import {getIncome} from '../../../database/Income';

export default function CreateRecord() {
  const [recordType, setRecordType] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  async function loadIncome() {
    const income = await getIncome();
    setIncomeRecords(income);
    setLoading(false);
  }
  async function loadExpenses() {
    const expense = await getExpenses();
    setExpenseRecords(expense);

    setLoading(false);
  }
  useEffect(() => {
    loadIncome();
    loadExpenses();
  }, []);

  useEffect(() => {
    if (recordType) {
      setIsModalVisible(true);
    }
  }, [recordType]);
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setRecordType(null);
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
      <Text style={styles.label}>Select Record Type:</Text>
      <View style={styles.picker_container}>
        <Picker
          style={styles.picker}
          selectedValue={recordType}
          onValueChange={itemValue => setRecordType(itemValue)}>
          <Picker.Item label="Select a record type" value={null} />
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>
      </View>

      <Modal visible={isModalVisible} animationType="slide">
        {recordType === 'expense' && (
          <ExpenseForm currentExpenseRecords={expenseRecords} />
        )}
        {recordType === 'income' && (
          <IncomeForm currentIncomeRecords={incomeRecords} />
        )}

        <TouchableOpacity onPress={handleCloseModal}>
          <Text style={styles.button}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    backgroundColor: custom_color.light.lightest_background,
  },
  picker: {},
  picker_container: {
    margin: 5,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: custom_color.light.dark_border,
    backgroundColor: custom_color.light.orange_peel,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'LilitaOne',
  },
  button: {
    fontFamily: 'LilitaOne',
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
    backgroundColor: custom_color.light.carrot_orange,
    borderTopWidth: 1,
    borderColor: custom_color.light.dark_border,
  },
});
