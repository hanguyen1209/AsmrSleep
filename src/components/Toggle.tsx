import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Switch} from 'react-native';

const Toggle = (props: any) => (
  <View style={styles.container}>
    <Switch
      trackColor={{true: '#FF5757', false: 'white'}}
      thumbColor={!props.isEnabled ? 'white' : 'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={props.onValueChange}
      value={props.isEnabled}
      style={{justifyContent: 'center', alignItems: 'center'}}></Switch>
  </View>
);
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Toggle;
