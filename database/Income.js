import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';

export const insertIncome = async incomeData => {
  try {
    const existingIncomeRecords = await AsyncStorage.getItem('income');
    const incomeRecords = existingIncomeRecords
      ? JSON.parse(existingIncomeRecords)
      : [];

    const uniqueId = uuid.v4();
    const newIncomeRecord = {id: uniqueId, ...incomeData};

    incomeRecords.push(newIncomeRecord);

    await AsyncStorage.setItem('income', JSON.stringify(incomeRecords));

    return Promise.resolve('Income inserted successfully');
  } catch (error) {
    console.error('Error inserting income:', error);
    return Promise.reject('Failed to insert income. Please try again.');
  }
};

export const getIncome = async () => {
  try {
    const incomeRecords = await AsyncStorage.getItem('income');
    return Promise.resolve(incomeRecords ? JSON.parse(incomeRecords) : []);
  } catch (error) {
    console.error('Error getting income Records:', error);
    return Promise.reject('Failed to get income records. Please try again.');
  }
};

export const clearAllIncome = async () => {
  try {
    await AsyncStorage.removeItem('income');
    return Promise.resolve('All income records cleared');
  } catch (error) {
    return Promise.reject(
      'Failed to clear all income records. Please try again.',
    );
  }
};

export const getIncomeById = async incomeId => {
  try {
    const incomeRecords = await AsyncStorage.getItem('income');
    const parsedIncomeRecords = incomeRecords ? JSON.parse(incomeRecords) : [];

    const foundIncome = parsedIncomeRecords.find(
      income => income.id === incomeId,
    );

    return Promise.resolve(foundIncome || null);
  } catch (error) {
    return Promise.reject('Failed to get income by ID. Please try again.');
  }
};

export const getPaginatedIncome = async (page = 1, pageSize = 10) => {
  try {
    // Get the income from AsyncStorage
    const income = await AsyncStorage.getItem('income');
    const parsedincome = income ? JSON.parse(income) : [];

    // Calculate the start and end indices for the current page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Extract the records for the current page
    const paginatedincome = parsedincome.slice(startIndex, endIndex);

    return Promise.resolve(paginatedincome);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const getIncomeByDate = async date => {
  try {
    const incomeRecords = await AsyncStorage.getItem('income');
    const parsedIncomeRecords = incomeRecords ? JSON.parse(incomeRecords) : [];

    const incomeRecordsByDate = parsedIncomeRecords.filter(
      income => income.date === date,
    );

    return Promise.resolve(incomeRecordsByDate);
  } catch (error) {
    return Promise.reject('Failed to get income by date. Please try again.');
  }
};

export const removeIncome = async incomeId => {
  try {
    const incomeRecords = await AsyncStorage.getItem('income');
    const parsedIncomeRecords = incomeRecords ? JSON.parse(incomeRecords) : [];

    const updatedIncomeRecords = parsedIncomeRecords.filter(
      income => income.id !== incomeId,
    );

    await AsyncStorage.setItem('income', JSON.stringify(updatedIncomeRecords));

    return Promise.resolve(`Income with ID ${incomeId} removed successfully`);
  } catch (error) {
    return Promise.reject('Failed to remove income. Please try again.');
  }
};

export const updateIncome = async (incomeId, updatedData) => {
  try {
    const incomeRecords = await AsyncStorage.getItem('income');
    const parsedIncomeRecords = incomeRecords ? JSON.parse(incomeRecords) : [];

    const updatedIncomeRecords = parsedIncomeRecords.map(income =>
      income.id === incomeId ? {...income, ...updatedData} : income,
    );

    await AsyncStorage.setItem('income', JSON.stringify(updatedIncomeRecords));

    return Promise.resolve(`Income with ID ${incomeId} updated successfully`);
  } catch (error) {
    return Promise.reject('Failed to update income. Please try again.');
  }
};

export const getLatestIncomeRecords = async (limit = 10) => {
  try {
    const incomeRecords = await AsyncStorage.getItem('income');
    const parsedIncomeRecords = incomeRecords ? JSON.parse(incomeRecords) : [];

    const latestIncomeRecords = parsedIncomeRecords.slice(-limit);

    return Promise.resolve(latestIncomeRecords);
  } catch (error) {
    return Promise.reject(
      'Failed to get latest income records. Please try again.',
    );
  }
};
