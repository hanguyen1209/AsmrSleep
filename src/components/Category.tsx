import React from 'react';
import {pt} from '../Utils';
import {StyleSheet, View, Text} from 'react-native';
import DashedLine from 'react-native-dashed-line';

const Category = (props: any) => {
  return (
    <View style={styles.container}>
      <DashedLine
        style={styles.dashed}
        dashLength={10}
        dashThickness={3}
        dashGap={5}
        dashColor="white"
        dashStyle={{borderRadius: 3}}
      />
      <View style={styles.box}>
        <Text style={styles.title}>{props.title}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35 * pt,
  },
  box: {
    backgroundColor: 'white',
    borderRadius: 10 * pt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#FF5757',
    paddingHorizontal: 15 * pt,
    paddingVertical: 8 * pt,
    fontSize: 14 * pt
  },
  dashed: {
    backgroundColor: 'black',
    width: 309 * pt,
    position: 'absolute',
    top: '50%',
  },
});
export default Category;
