import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Switch} from 'react-native';

const Toggle = (props: any) => (
  <View style={styles.container}>
    <Switch
      trackColor={{true: '#FF5757', false: 'white'}}
      thumbColor={!props.isEnabled ? 'white' : 'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={props.onFaddingOut}
      value={props.isEnabled}
      style={{justifyContent: 'center', alignItems: 'center'}}
    />
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
