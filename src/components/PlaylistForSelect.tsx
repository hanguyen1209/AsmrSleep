import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {pt} from '../Utils';
interface PlaylistForSelectProps {
  isChosed: Boolean;
  name: String;
  totalSound: Number;
}
const PlaylistForSelect = (props: PlaylistForSelectProps) => {
  const {isChosed, name, totalSound} = props;
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isChosed ? '#FF5757' : 'white'},
      ]}>
      <View style={styles.rounded}></View>
      <Text
        style={{
          color: isChosed ? 'white' : '#FF5757',
          flex: 1,
          textAlign: 'center',
        }}>
        {name}
      </Text>
      <Text
        style={{
          color: isChosed ? 'white' : '#FF5757',
          fontSize: 9,
          padding: 10 * pt,
        }}>{`${totalSound} sound${totalSound > 1 ? 's' : ''}`}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15 * pt,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5 * pt,
    width: '60%',
    flexDirection: 'row',
    marginVertical: 15*pt
  },
  rounded: {
    width: 30 * pt,
    height: 30 * pt,
    backgroundColor: '#FF5757',
    margin: 5 * pt,
    borderRadius: 5 * pt,
  },
});
export default PlaylistForSelect;
