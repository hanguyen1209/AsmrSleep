import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {pt} from '../Utils';
import Toggle from './Toggle';

const SliderSmooth = (props: any) => {
  const [previewValue, setPreviewValue] = useState(props.timer.current);
  const [isFade, setFading] = useState(props.isFadingVolumn.current);
  return (
    <View style={{flex: 1}}>
      <Slider
        value={previewValue}
        step={1}
        onValueChange={value => setPreviewValue(value)}
        onSlidingComplete={value => {
          props.timer.current = value;
          props.volumnPercent.current = value;
        }}
        style={{maxHeight: 20 * pt, margin: 20 * pt}}
        minimumValue={0}
        maximumValue={120}
        maximumTrackTintColor="#FFFFFF"
        minimumTrackTintColor={'#FF5757'}
      />
      {previewValue > 0 ? (
        <Text style={styles.text}>
          Stop the sounds after:{' '}
          <Text
            style={[styles.text, {color: '#FF5757', backgroundColor: 'white'}]}>
            {previewValue}
          </Text>{' '}
          minute
          {previewValue > 1 ? 's' : ''}
        </Text>
      ) : (
        <Text style={[styles.text, {color: 'black'}]}>Timer's OFF</Text>
      )}
      <View
        style={{
          padding: 20 * pt,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Toggle
          isEnabled={isFade}
          onValueChange={() => {
            setFading(!isFade);
            props.isFadingVolumn.current = !props.isFadingVolumn.current;
          }}></Toggle>
        <Text style={[styles.text, {paddingLeft: 10 * pt}]}>
          Fading volumn {isFade ? 'ON' : 'OFF'}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 16 * pt,
    fontWeight: 'bold',
    color: 'white',
  },
});
export default SliderSmooth;
