import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ToastAndroid,
} from 'react-native';
import {custom_color} from '../../../constants/Colors';

const ConfirmDelete = ({record, handleDeleteExpense, handleDeleteIncome}) => {
  const handleDeleteRecord = () => {
    if (record.source) {
      handleDeleteIncome(record.id);
    } else {
      handleDeleteExpense(record.id);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Are You Sure you wish to delete? </Text>
      <Text style={styles.sub_heading}>
        {record.description ? record.description : record.source}
      </Text>
      <View style={styles.button_container}>
        <TouchableOpacity style={styles.button} onPress={handleDeleteRecord}>
          <Text style={styles.button_label}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 5,
    height: '90%',
    backgroundColor: custom_color.light.lightest_background,
  },
  heading: {
    fontFamily: 'LilitaOne',
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
  },
  sub_heading: {
    fontFamily: 'LilitaOne',
    textAlign: 'center',
    fontSize: 25,
    padding: 15,
  },
  button_container: {},
  button_label: {},
  button: {
    fontFamily: 'LilitaOne',
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
    backgroundColor: custom_color.light.red,
    borderTopWidth: 1,
    borderColor: custom_color.light.dark_border,
  },
});
export default ConfirmDelete;
