import {StyleSheet, View} from 'react-native';
import React from 'react';
import HomeListItem from './HomeListItem';

export default function HomeMenu({navigation}) {
  const navigateToScreen = itemId => {
    if (itemId == 1) {
      navigation.navigate('List');
    } else if (itemId == 2) {
      navigation.navigate('Create');
    } else if (itemId == 3) {
      navigation.navigate('Analysis');
    } else if (itemId == 4) {
      navigation.navigate('Settings');
    }
  };
  const menuListData = [
    {
      id: '1',
      icon: require('../../../assets/buttons/search.png'),
      label: 'Search Records',
    },
    {
      id: '2',
      icon: require('../../../assets/buttons/add.png'),
      label: 'Create New Record',
    },
    {
      id: '3',
      icon: require('../../../assets/buttons/chart.png'),
      label: 'View Records and Analysis',
    },

    {
      id: '4',
      icon: require('../../../assets/buttons/settings.png'),
      label: 'Settings',
    },
  ];

  return (
    <View style={styles.container}>
      {menuListData.map(item => (
        <HomeListItem
          key={item.id}
          item={item}
          onPress={() => navigateToScreen(item.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginRight: 20,
    marginBottom: 10,
  },
});
