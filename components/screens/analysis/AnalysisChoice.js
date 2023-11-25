import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';

import {custom_color} from '../../../constants/Colors';

import DebtCalculator from './DebtCalculator';
import MonthlyPlanner from './MonthlyPlanner';

import TotalOverview from './TotalOverview';

function RecordAnalysis() {
  const [showDebtCalculator, setShowDebtCalculator] = useState(false);
  const [showExpenseByKeyword, setShowExpenseByKeyword] = useState(false);
  const [showMonthlyBills, setShowMonthlyBills] = useState(false);
  const [showFiftyDayOverview, setShowFiftyDayOverview] = useState(false);
  const [showTotals, setShowTotals] = useState(false);
  const calcIcon = require('../../../assets/buttons/debtcalc.png');
  const totalIcon = require('../../../assets/buttons/total.png');
  const monthlyIcon = require('../../../assets/buttons/monthly.png');

  const handleOpenDebtCollector = () => {
    if (showDebtCalculator) {
      setShowDebtCalculator(false);
    } else {
      setShowDebtCalculator(true);
    }
  };
  const handleOpenMonthlyBills = () => {
    if (showMonthlyBills) {
      setShowMonthlyBills(false);
    } else {
      setShowMonthlyBills(true);
    }
  };
  const handleOpenFiftyDayOverview = () => {
    if (showFiftyDayOverview) {
      setShowFiftyDayOverview(false);
    } else {
      setShowFiftyDayOverview(true);
    }
  };
  const handleOpenTotals = () => {
    if (showTotals) {
      setShowTotals(false);
    } else {
      setShowTotals(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.button_container}>
        <Image source={calcIcon} style={styles.icon} />
        <TouchableOpacity
          onPress={handleOpenDebtCollector}
          style={styles.analysis_button}>
          <Text style={styles.button_text}>Debt Calculator</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.button_container}>
        <Image source={monthlyIcon} style={styles.icon} />
        <TouchableOpacity
          onPress={handleOpenMonthlyBills}
          style={styles.analysis_button}>
          <Text style={styles.button_text}>Monthly Planner</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.button_container}>
        <Image source={totalIcon} style={styles.icon} />
        <TouchableOpacity
          onPress={handleOpenTotals}
          style={styles.analysis_button}>
          <Text style={styles.button_text}>Totals</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showDebtCalculator} animationType="slide">
        <DebtCalculator></DebtCalculator>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => setShowDebtCalculator(!showDebtCalculator)}>
          <Text style={styles.button}>Close</Text>
        </TouchableOpacity>
      </Modal>
      <Modal visible={showMonthlyBills} animationType="slide">
        <MonthlyPlanner></MonthlyPlanner>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => setShowMonthlyBills(!showMonthlyBills)}>
          <Text style={styles.button}>Close</Text>
        </TouchableOpacity>
      </Modal>
      <Modal visible={showTotals} animationType="slide">
        <TotalOverview></TotalOverview>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => setShowTotals(!showTotals)}>
          <Text style={styles.button}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: 50,
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: custom_color.light.lightest_background,
    height: '100%',
    width: '100%',
  },

  button_container: {
    flexDirection: 'row',
    padding: 10,
  },
  analysis_button: {
    marginVertical: 5,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 30,
    marginLeft: 10,
  },
  button_text: {
    flex: 1,
    fontFamily: 'LilitaOne-Regular',
    fontSize: 18,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderColor: custom_color.light.black,
    minWidth: 170,
  },
  button: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15,
    backgroundColor: custom_color.light.carrot_orange,
    borderTopWidth: 1,
    borderColor: custom_color.light.dark_border,
  },
});

export default RecordAnalysis;
