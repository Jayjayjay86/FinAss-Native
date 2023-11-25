import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {custom_color} from '../../../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {getAllExpenses} from '../../../database/Expense';
import {getIncome} from '../../../database/Income';
const Totals = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({
    expensesByKeyword: false,
    expensesByMonth: false,
    allExpenses: false,
    incomesByKeyword: false, // Added a new state for income records
    incomesByMonth: false,
  });
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
      const incomedata = await getIncome();
      setExpenses(expensedata);
      setIncome(incomedata);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }
  const [selectedMonth, setSelectedMonth] = useState(null);
  // Calculate total income for each keyword
  const keywordIncomeTotals = {};
  income.forEach(income => {
    if (keywordIncomeTotals[income.keyword]) {
      keywordIncomeTotals[income.keyword] += income.amount;
    } else {
      keywordIncomeTotals[income.keyword] = income.amount;
    }
  });

  // Calculate total income for each month
  const monthIncomeTotals = {};
  income.forEach(income => {
    const date = new Date(income.date);
    const yearMonth = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthIncomeTotals[yearMonth]) {
      monthIncomeTotals[yearMonth].total += income.amount;
      monthIncomeTotals[yearMonth].incomes.push(income);
    } else {
      monthIncomeTotals[yearMonth] = {
        total: income.amount,
        incomes: [income],
      };
    }
  });
  const toggleExpanded = section => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [section]: !prevExpanded[section],
    }));

    // Clear the selected month when collapsing the "Expenses by Month" section
    if (section === 'expensesByMonth' && !expanded.expensesByMonth) {
      setSelectedMonth(null);
    }
  };

  const toggleMonth = month => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  // Calculate total expenses for each keyword
  const keywordTotals = {};
  expenses.forEach(expense => {
    if (keywordTotals[expense.keyword]) {
      keywordTotals[expense.keyword] += expense.amount;
    } else {
      keywordTotals[expense.keyword] = expense.amount;
    }
  });

  // Calculate total expenses for each month
  const monthTotals = {};
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const yearMonth = `${date.getFullYear()}-${date.getMonth()}`;
    if (monthTotals[yearMonth]) {
      monthTotals[yearMonth].total += expense.amount;
      monthTotals[yearMonth].expenses.push(expense);
    } else {
      monthTotals[yearMonth] = {total: expense.amount, expenses: [expense]};
    }
  });
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleExpanded('expensesByKeyword')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Expenses by Keyword</Text>
            {expanded.expensesByKeyword ? (
              <Text style={styles.collapseText}>Collapse</Text>
            ) : (
              <Text style={styles.expandText}>Expand</Text>
            )}
          </View>
        </TouchableOpacity>
        {expanded.expensesByKeyword && (
          <View style={styles.sectionContent}>
            {Object.keys(keywordTotals).map((keyword, index) => (
              <View key={`${keyword}-${index}`} style={styles.keywordItem}>
                <Text style={styles.keywordItemText}>
                  {keyword}: ${keywordTotals[keyword]}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleExpanded('incomesByKeyword')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Income by Keyword</Text>
            {expanded.incomesByKeyword ? (
              <Text style={styles.collapseText}>Collapse</Text>
            ) : (
              <Text style={styles.expandText}>Expand</Text>
            )}
          </View>
        </TouchableOpacity>
        {expanded.incomesByKeyword && (
          <View style={styles.sectionContent}>
            {Object.keys(keywordIncomeTotals).map((keyword, index) => (
              <View key={`${keyword}-${index}`} style={styles.keywordItem}>
                <Text style={styles.keywordItemText}>
                  {keyword}: ${keywordIncomeTotals[keyword]}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleExpanded('expensesByMonth')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Expenses by Month</Text>
            {expanded.expensesByMonth ? (
              <Text style={styles.collapseText}>Collapse</Text>
            ) : (
              <Text style={styles.expandText}>Expand</Text>
            )}
          </View>
        </TouchableOpacity>
        {expanded.expensesByMonth && (
          <View style={styles.sectionContent}>
            {Object.keys(monthTotals).map(yearMonth => (
              <View key={yearMonth} style={styles.monthItem}>
                <TouchableOpacity
                  onPress={() => toggleMonth(yearMonth)}
                  style={styles.dateItemLink}>
                  <Text style={styles.dateItemText}>{yearMonth}</Text>
                </TouchableOpacity>
                {selectedMonth === yearMonth && (
                  <View>
                    <Text style={styles.dateDetails}>
                      Total: ${monthTotals[yearMonth].total}
                    </Text>
                    {monthTotals[yearMonth].expenses.map((expense, index) => (
                      <View
                        key={`${expense.date}-${index}`}
                        style={styles.expenseItem}>
                        <Text style={styles.expenseItemLabel}>
                          Date: {expense.date}
                        </Text>
                        <Text style={styles.expenseItemLabel}>
                          Description: {expense.description}
                        </Text>
                        <Text style={styles.expenseItemLabel}>
                          Keyword: {expense.keyword}
                        </Text>
                        <Text style={styles.expenseItemLabel}>
                          Amount: ${expense.amount}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleExpanded('incomesByMonth')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Income by Month</Text>
            {expanded.incomesByMonth ? (
              <Text style={styles.collapseText}>Collapse</Text>
            ) : (
              <Text style={styles.expandText}>Expand</Text>
            )}
          </View>
        </TouchableOpacity>
        {expanded.incomesByMonth && (
          <View style={styles.sectionContent}>
            {Object.keys(monthIncomeTotals).map(yearMonth => (
              <View key={yearMonth} style={styles.monthItem}>
                <TouchableOpacity
                  onPress={() => toggleMonth(yearMonth)}
                  style={styles.dateItemLink}>
                  <Text style={styles.dateItemText}>{yearMonth}</Text>
                </TouchableOpacity>
                {selectedMonth === yearMonth && (
                  <View>
                    <Text style={styles.dateDetails}>
                      Total: ${monthIncomeTotals[yearMonth].total}
                    </Text>
                    {monthIncomeTotals[yearMonth].incomes.map(
                      (income, index) => (
                        <View
                          key={`${income.date}-${index}`}
                          style={styles.incomeItem}>
                          <Text style={styles.incomeItemLabel}>
                            Date: {income.date}
                          </Text>
                          <Text style={styles.incomeItemLabel}>
                            Description: {income.description}
                          </Text>
                          <Text style={styles.incomeItemLabel}>
                            Keyword: {income.keyword}
                          </Text>
                          <Text style={styles.incomeItemLabel}>
                            Amount: ${income.amount}
                          </Text>
                        </View>
                      ),
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: custom_color.light.lightest_background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
    backgroundColor: custom_color.light.lightest_background,
    borderRadius: 5,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    backgroundColor: custom_color.light.platinum,
    padding: 10,
  },
  keywordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keywordItemText: {
    fontSize: 16,
  },
  monthItem: {
    marginBottom: 10,
  },
  dateItemLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  dateItemText: {
    fontSize: 16,
    color: custom_color.light.link_text,
  },
  dateDetails: {
    fontSize: 16,
    marginLeft: 15,
  },
  collapseText: {
    color: custom_color.light.carrot_orange,
    fontSize: 16,
  },
  expandText: {
    color: custom_color.light.green,
    fontSize: 16,
  },
  expenseItem: {
    backgroundColor: custom_color.light.lightest_background,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  expenseItemLabel: {
    fontSize: 16,
  },
});

export default Totals;
