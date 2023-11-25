import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';

// Replace insertExpense function
export const insertExpense = async expenseData => {
  try {
    // Get the existing expenses from AsyncStorage (if any)
    const existingExpenses = await AsyncStorage.getItem('expenses');
    const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];

    // Generate a unique ID for the new expense
    const uniqueId = uuid.v4();

    // Add the new expense with a unique ID
    const newExpense = {id: uniqueId, ...expenseData};

    expenses.push(newExpense);

    // Save the updated expenses to AsyncStorage
    await AsyncStorage.setItem('expenses', JSON.stringify(expenses));

    return Promise.resolve('Expense added successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};

// Replace getExpenses function
export const getAllExpenses = async () => {
  try {
    // Get the expenses from AsyncStorage
    const expenses = await AsyncStorage.getItem('expenses');
    return Promise.resolve(expenses ? JSON.parse(expenses) : []);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getExpenses = async (page = 1, pageSize = 10) => {
  try {
    // Get the expenses from AsyncStorage
    const expenses = await AsyncStorage.getItem('expenses');
    const parsedExpenses = expenses ? JSON.parse(expenses) : [];

    // Calculate the start and end indices for the current page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Extract the records for the current page
    const paginatedExpenses = parsedExpenses.slice(startIndex, endIndex);

    return Promise.resolve(paginatedExpenses);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const clearAllExpenses = async () => {
  try {
    await AsyncStorage.removeItem('expenses');
    return Promise.resolve('All expenses cleared successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getExpenseById = async expenseId => {
  try {
    const expenses = await AsyncStorage.getItem('expenses');
    const parsedExpenses = expenses ? JSON.parse(expenses) : [];

    const foundExpense = parsedExpenses.find(
      expense => expense.id === expenseId,
    );

    if (foundExpense) {
      return Promise.resolve(foundExpense);
    } else {
      return Promise.reject(`Expense not found for ID ${expenseId}`);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getExpensesByDate = async date => {
  try {
    const expenses = await AsyncStorage.getItem('expenses');
    const parsedExpenses = expenses ? JSON.parse(expenses) : [];

    const expensesByDate = parsedExpenses.filter(
      expense => expense.date === date,
    );

    if (expensesByDate.length > 0) {
      return Promise.resolve(expensesByDate);
    } else {
      return Promise.reject('No expenses found for the specified date');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeExpense = async expenseId => {
  try {
    const expenses = await AsyncStorage.getItem('expenses');
    const parsedExpenses = expenses ? JSON.parse(expenses) : [];

    const updatedExpenses = parsedExpenses.filter(
      expense => expense.id !== expenseId,
    );

    if (parsedExpenses.length > updatedExpenses.length) {
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      return Promise.resolve(`Expense with ID ${expenseId} removed`);
    } else {
      return Promise.reject('Expense not found to remove');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateExpense = async (expenseId, updatedData) => {
  try {
    console.log(expenseId, updatedData);

    const expenses = await AsyncStorage.getItem('expenses');
    const parsedExpenses = expenses ? JSON.parse(expenses) : [];

    const updatedExpenses = parsedExpenses.map(expense =>
      expense.id === expenseId ? {...expense, ...updatedData} : expense,
    );

    const updatedExpensesString = JSON.stringify(updatedExpenses);

    await AsyncStorage.setItem('expenses', updatedExpensesString);

    if (expenses !== updatedExpensesString) {
      return Promise.resolve(`Expense with ID ${expenseId} updated`);
    } else {
      return Promise.reject('Expense not found to update');
    }
  } catch (error) {
    throw error;
  }
};
export const getLatestExpenses = async (limit = 10) => {
  try {
    const expenses = await AsyncStorage.getItem('expenses');
    const parsedExpenses = expenses ? JSON.parse(expenses) : [];

    const latestExpenses = parsedExpenses.slice(-limit);
    return Promise.resolve(latestExpenses); // Add "return" here
  } catch (error) {
    return Promise.reject(error); // Add "return" here
  }
};
