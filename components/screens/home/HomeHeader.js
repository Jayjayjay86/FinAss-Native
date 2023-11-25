import React, {Component} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {custom_color} from '../../../constants/Colors';

export default class HomeHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/header_logo.png')}
          style={styles.logo}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: custom_color.light.carrot_orange_2,
  },
  logo: {
    width: 300,
    height: 120,
    marginBottom: 20,
  },
});
