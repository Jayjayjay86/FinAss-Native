import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {getIncome} from '../../../database/Income';

const EditIncome = ({record, onSave}) => {
  const {incomeRecords} = getIncome();
  const [editedIncome, setEditedIncome] = useState({...record});

  const handleSave = () => {
    onSave(record.id, editedIncome);
  };

  return (
    <View style={styles.container}>
      <Text>Source</Text>
      <TextInput
        style={styles.input}
        value={editedIncome.source}
        onChangeText={text => setEditedIncome({...editedIncome, source: text})}
      />

      <Text>Amount</Text>
      <TextInput
        style={styles.input}
        value={editedIncome.amount.toString()}
        onChangeText={text =>
          setEditedIncome({
            ...editedIncome,
            amount: parseFloat(text) || 0,
          })
        }
        keyboardType="numeric"
      />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
});

export default EditIncome;
