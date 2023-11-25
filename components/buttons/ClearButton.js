import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

const ClearButton = (title, onPress) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});
export default ClearButton;
