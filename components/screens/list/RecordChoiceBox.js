import React, {useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {custom_color} from '../../../constants/Colors';

const RecordChoiceBox = ({
  record,
  handleShowConfirmDelete,
  handleShowEditExpenseRecord,
  handleShowEditIncomeRecord,
  setShowEditIncomeRecord,
  setShowEditExpenseRecord,
  showEditIncomeRecord,
  showEditExpenseRecord,
}) => {
  const handleEditRecord = () => {
    if (record.source) {
      handleShowEditIncomeRecord(record);
      setShowEditIncomeRecord(!showEditIncomeRecord);
      return;
    } else {
      handleShowEditExpenseRecord(record);
      setShowEditExpenseRecord(!showEditExpenseRecord);
      return;
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Please Choose.</Text>
      <Text style={styles.heading}>
        {record.date}-{record.description}
      </Text>

      <View style={styles.button_container}>
        <TouchableOpacity onPress={() => handleEditRecord(record)}>
          <Text style={styles.edit_button}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.button_container}>
        <TouchableOpacity onPress={() => handleShowConfirmDelete(record)}>
          <Text style={styles.button}> Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '90%',
    backgroundColor: custom_color.light.lightest_background,
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
  },
  button_container: {flexDirection: 'column', margin: 5},
  button_label: {},
  edit_button: {},
  button: {
    fontFamily: 'LilitaOne-Regular',
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
    backgroundColor: custom_color.light.red,
    borderTopWidth: 1,
    borderColor: custom_color.light.dark_border,
  },
  edit_button: {
    fontFamily: 'LilitaOne-Regular',
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
    backgroundColor: custom_color.light.orange_peel,
    borderTopWidth: 1,
    borderColor: custom_color.light.dark_border,
  },
});
export default RecordChoiceBox;
