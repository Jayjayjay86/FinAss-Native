import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {custom_color} from '../../constants/Colors';

const SubmitButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    alignSelf: 'center',
    backgroundColor: custom_color.light.orange_peel,
    borderWidth: 4,
    borderColor: custom_color.light.carrot_orange_2,
    borderRadius: 30,
    width: 200,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'LilitaOne',
    fontFamily: 'LilitaOne-Regular',
    padding: 10,
  },
});
export default SubmitButton;
