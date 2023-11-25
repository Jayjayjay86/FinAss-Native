import React, {useState} from 'react';
import {View, Text, TextInput, Switch, StyleSheet} from 'react-native';
import SubmitButton from '../../buttons/SubmitButton';
import {custom_color} from '../../../constants/Colors';
import {getExpenses} from '../../../database/Expense';

const EditExpense = ({record, onSave}) => {
  const {expenseRecords} = getExpenses();
  const [editedExpense, setEditedExpense] = useState({...record});

  const handleSave = () => {
    onSave(record.id, editedExpense);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Expense</Text>

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={editedExpense.date}
        onChangeText={text => setEditedExpense({...editedExpense, date: text})}
      />
      <Text style={styles.label}>Keyword</Text>
      <TextInput
        style={styles.input}
        value={editedExpense.keyword.toString()}
        onChangeText={text =>
          setEditedExpense({
            ...editedExpense,
            keyword: parseFloat(text) || 0,
          })
        }
        keyboardType="text"
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={editedExpense.description.toString()}
        onChangeText={text =>
          setEditedExpense({
            ...editedExpense,
            description: text,
          })
        }
        keyboardType="text"
      />
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={editedExpense.amount.toString()}
        onChangeText={text =>
          setEditedExpense({
            ...editedExpense,
            amount: parseFloat(text) || 0,
          })
        }
        keyboardType="numeric"
      />
      <Text style={styles.label}>Is Monthly</Text>
      <Switch
        value={editedExpense.isMonthly === 1}
        onValueChange={value =>
          setEditedExpense({...editedExpense, isMonthly: value ? 1 : 0})
        }
        thumbColor={custom_color.light.dim_gray}
        trackColor={{
          false: custom_color.light.platinum,
          true: custom_color.light.orange_web,
        }}
      />
      <Text style={styles.label}>Is Bill</Text>
      <Switch
        value={editedExpense.isBill === 1}
        onValueChange={value =>
          setEditedExpense({...editedExpense, isBill: value ? 1 : 0})
        }
        thumbColor={custom_color.light.dim_gray}
        trackColor={{
          false: custom_color.light.platinum,
          true: custom_color.light.orange_web,
        }}
      />

      <SubmitButton onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    height: '90%',
  },
  heading: {
    fontFamily: 'LilitaOne',
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'LilitaOne',
  },
});

export default EditExpense;
