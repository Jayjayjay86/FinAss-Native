import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {custom_color} from '../../../constants/Colors';

export default function HomeMenuListItem({item, onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.listItem}>
        <Image source={item.icon} style={styles.icon} />
        <Text style={styles.label}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 30,
    marginLeft: 10,
  },
  label: {
    flex: 1,
    fontFamily: 'LilitaOne-Regular',
    fontSize: 18,
    paddingBottom: 4,
    borderBottomWidth: 2,
  },
});
