import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import {custom_color} from '../../../constants/Colors';
import RecordChoiceBox from './RecordChoiceBox';
import ConfirmDelete from './ConfirmDelete';
import EditExpense from './EditExpense';
import EditIncome from './EditIncome';
import {
  getAllExpenses,
  getExpenses,
  removeExpense,
  updateExpense,
} from '../../../database/Expense';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import {useFocusEffect} from '@react-navigation/native';
import {getIncome, removeIncome, updateIncome} from '../../../database/Income';

function ListAllScreen() {
  const [combinedData, setCombinedData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const bahtSign = '\u0E3F';
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showIncomes, setShowIncomes] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [showRecordChoiceBox, setShowRecordChoiceBox] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditExpenseRecord, setShowEditExpenseRecord] = useState(false);
  const [showEditIncomeRecord, setShowEditIncomeRecord] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const recordsUpdated = () => {
    loadData();
  };
  useEffect(() => {
    loadData();
  }, [page]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [page]),
  );

  async function loadData() {
    setLoading(true);
    try {
      // Fetch all income and expense records
      const allIncomeRecords = await getIncome();
      const allExpenseRecords = await getAllExpenses();

      // Combine all records
      const combinedData = [...allIncomeRecords, ...allExpenseRecords];

      // Filter records based on search query
      const filteredData = combinedData.filter(item => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();

        // Check if the item matches the search query
        return (
          item.description &&
          typeof item.description === 'string' &&
          item.description.toLowerCase().includes(lowerCaseSearchQuery)
        );
      });

      // Sort the filtered data by date in descending order
      filteredData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      // Calculate total count and total pages
      const totalCount = combinedData.length;
      const totalPages = Math.ceil(filteredData.length / 10);

      // Paginate the filtered data
      const paginatedData = filteredData.slice((page - 1) * 10, page * 10);

      // Check if there are more pages
      if (filteredData.length <= page * 10) {
        setHasMore(false);
      }

      setCombinedData(paginatedData);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }

  const handleRecordSelection = record => {
    setSelectedRecord(record);
    setShowRecordChoiceBox(true);
  };
  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1); // Increment the page number
    }
  };
  const filterData = () => {
    const filtered = combinedData.filter(item => {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();

      // Check if the item matches the search query
      const matchesSearchQuery =
        item.description &&
        typeof item.description === 'string' &&
        item.description.toLowerCase().includes(lowerCaseSearchQuery);

      // Check if the item is an income or expense based on checkboxes
      const isExpense = !item.source;
      const showIncome = showIncomes && item.source;
      const showExpense = showExpenses && !item.source;

      return (
        (showIncome || showExpense || (!showIncomes && !showExpenses)) &&
        (matchesSearchQuery || !searchQuery)
      );
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery, showIncomes, showExpenses]);

  const renderListItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleRecordSelection(item)}>
      {!item.source ? (
        <>
          <Text style={styles.expenseDate}>{item.date}</Text>
          <Text style={styles.expensePurpose}>{item.keyword}</Text>
          <Text style={styles.expenseAmount}>
            {bahtSign}
            {item.amount}
          </Text>
          <Text style={styles.expenseDescription}>
            {item.description.length > 13
              ? `${item.description.slice(0, 13)}...`
              : item.description}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.incomeDate}>{item.date}</Text>
          <Text style={styles.incomeSource}>{item.source}</Text>
          <Text style={styles.incomeAmount}>
            {bahtSign}
            {item.amount}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  if (Loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (combinedData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noRecordsText}>No records found.</Text>
      </View>
    );
  }
  const handleShowConfirmDelete = record => {
    setSelectedRecord(record);
    setShowConfirmDelete(true);
  };
  const handleShowEditExpenseRecord = item => {
    setSelectedRecord(item);
    setShowEditExpenseRecord(true);
  };
  const handleShowEditIncomeRecord = item => {
    setSelectedRecord(item);
    setShowEditIncomeRecord(true);
  };
  const onSaveExpenseRecord = (recordId, newRecord) => {
    updateExpense(recordId, newRecord)
      .then(response => {
        loadData();
        ToastAndroid.show(response, ToastAndroid.SHORT);
        setShowEditExpenseRecord(!showEditExpenseRecord);
        setShowRecordChoiceBox(!showRecordChoiceBox);
      })
      .catch(error => {
        ToastAndroid.show(error);
      });
  };
  const onSaveIncomeRecord = (recordId, newRecord) => {
    updateIncome(recordId, newRecord)
      .then(response => {
        loadData();
        ToastAndroid.show(response, ToastAndroid.SHORT);

        setShowEditIncomeRecord(!showEditIncomeRecord);
        setShowRecordChoiceBox(!showRecordChoiceBox);
      })
      .catch(error => {
        ToastAndroid.show(error);
      });
  };

  const onDeleteExpenseRecord = recordId => {
    removeExpense(recordId)
      .then(response => {
        loadData();
        ToastAndroid.show(response, ToastAndroid.SHORT);
        setShowConfirmDelete(!showConfirmDelete);
        setShowRecordChoiceBox(!showRecordChoiceBox);
      })
      .catch(error => {
        ToastAndroid.show(error);
      });
  };
  const onDeleteIncomeRecord = recordId => {
    removeIncome(recordId)
      .then(response => {
        loadData();
        ToastAndroid.show(response, ToastAndroid.SHORT);
        setShowConfirmDelete(!showConfirmDelete);
        setShowRecordChoiceBox(!showRecordChoiceBox);
      })
      .catch(error => {
        ToastAndroid.show(error);
      });
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      {searchQuery ? null : (
        <>
          <Text style={styles.resultCount}>
            {totalCount} record{totalCount !== 1 ? 's' : ''} total
          </Text>
          <Text style={styles.pageNumber}>
            Page {page} of {totalPages}
          </Text>
        </>
      )}
      <View style={styles.checkboxes}>
        <View style={styles.checkbox_container}>
          <Text style={styles.checkbox_title}>Show Incomes</Text>
          <BouncyCheckbox
            size={25}
            fillColor={custom_color.light.carrot_orange}
            unfillColor={custom_color.light.dark_border}
            iconStyle={{borderColor: 'red'}}
            innerIconStyle={{borderWidth: 2}}
            textStyle={{fontFamily: 'JosefinSans-Regular'}}
            onPress={newValue => setShowIncomes(newValue)}
            value={showIncomes}
          />
        </View>
        <View style={styles.checkbox_container}>
          <Text style={styles.checkbox_title}>Show Expenses</Text>
          <BouncyCheckbox
            size={25}
            fillColor={custom_color.light.carrot_orange}
            unfillColor={custom_color.light.dark_border}
            iconStyle={{borderColor: 'red'}}
            innerIconStyle={{borderWidth: 2}}
            textStyle={{fontFamily: 'JosefinSans-Regular'}}
            onPress={newValue => setShowExpenses(newValue)}
            value={showExpenses}
          />
        </View>
      </View>
      <View style={styles.menu_container}>
        <Text style={styles.listhead}>All Records</Text>
        <FlatList
          data={filteredData.length > 0 ? filteredData : combinedData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderListItem}
          ListFooterComponent={
            <TouchableOpacity onPress={handleLoadMore}>
              <Text style={styles.button}>Load More</Text>
            </TouchableOpacity>
          }
        />
      </View>

      {/* MODAL WINDOWS BELOW */}
      <Modal visible={showConfirmDelete} animationType="slide">
        <ConfirmDelete
          record={selectedRecord}
          handleDeleteExpense={onDeleteExpenseRecord}
          handleDeleteIncome={onDeleteIncomeRecord}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmDelete(!showConfirmDelete)}>
          <Text style={styles.button}>Cancel</Text>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showEditExpenseRecord} animationType="slide">
        <EditExpense record={selectedRecord} onSave={onSaveExpenseRecord} />
        <TouchableOpacity
          onPress={() => setShowEditExpenseRecord(!showEditExpenseRecord)}>
          <Text style={styles.button}>Cancel</Text>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showEditIncomeRecord} animationType="slide">
        <EditIncome record={selectedRecord} onSave={onSaveIncomeRecord} />
        <TouchableOpacity
          onPress={() => setShowEditIncomeRecord(!showEditIncomeRecord)}>
          <Text style={styles.button}>Cancel</Text>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showRecordChoiceBox} animationType="slide">
        <RecordChoiceBox
          record={selectedRecord}
          handleShowConfirmDelete={handleShowConfirmDelete}
          handleShowEditExpenseRecord={handleShowEditExpenseRecord}
          handleShowEditIncomeRecord={handleShowEditIncomeRecord}
          setShowEditIncomeRecord={setShowEditIncomeRecord}
          setShowEditExpenseRecord={setShowEditExpenseRecord}
          showEditExpenseRecord={showEditExpenseRecord}
          showEditIncomeRecord={showEditIncomeRecord}
        />
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => setShowRecordChoiceBox(!showRecordChoiceBox)}>
          <Text style={styles.button}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
    height: '100%',
    backgroundColor: custom_color.light.lightest_background,
  },
  menu_container: {
    margin: 5,
    maxHeight: '60%',
    backgroundColor: custom_color.light.orange_web,
    borderColor: custom_color.light.dark_border,
    borderWidth: 1,
    borderRadius: 3,
  },
  pageNumber: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  checkboxes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 30,
    justifyContent: 'space-around',
  },
  resultCount: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  checkbox_container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  checkbox_title: {
    fontFamily: 'LilitaOne',
    fontSize: 15,
    marginBottom: 15,
  },
  checkbox: {height: 40, width: 40, borderRadius: 5},
  searchInput: {
    fontSize: 18,
    backgroundColor: custom_color.light.carrot_orange,
    padding: 8,
    paddingHorizontal: 20,
    margin: 10,
    borderColor: custom_color.light.dark_border,
    borderWidth: 1,
    borderRadius: 5,
  },
  list: {marginBottom: 20, borderRadius: 5},
  listhead: {
    fontSize: 18,
    fontFamily: 'LilitaOne',
    backgroundColor: custom_color.light.list_background,
    padding: 10,
    marginBottom: 10,
    borderRadius: 2,
    borderBottomWidth: 3,
    borderColor: custom_color.light.light_border,
  },
  listItem: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginVertical: 10,
    padding: 10,
    backgroundColor: custom_color.light.platinum,
    borderColor: custom_color.light.darkest_border,
    borderWidth: 1,
    borderRadius: 20,
  },
  expenseDate: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 10,
    paddingRight: 5,
  },
  expensePurpose: {
    flex: 0.8,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: custom_color.light.darkest_border,
  },
  expenseAmount: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
  },
  expenseDescription: {
    flex: 2,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderColor: custom_color.light.bright_border,
    borderRightWidth: 20,
    borderRadius: 10,
  },

  incomeDate: {
    flex: 0.48,
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 7,
    paddingRight: 5,
  },
  incomeSource: {
    flex: 1.15,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: custom_color.light.darkest_border,
  },
  incomeAmount: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderColor: custom_color.light.darkest_border,
    borderRightWidth: 20,
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
  },
  noRecordsText: {
    fontSize: 20,
    textAlign: 'center',
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

export default ListAllScreen;
