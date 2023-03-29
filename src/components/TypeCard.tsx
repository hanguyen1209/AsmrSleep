import React, {useEffect, useRef, useState} from 'react';
import {pt} from '../Utils';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import * as images from '../assets';

const TypeCard = (props: any) => {
  const [icon, setIcon] = useState(null);
  useEffect(() => {
    switch (props.type) {
      case 'Whispering':
        setIcon(images.whisper);
        break;
      case 'Tapping':
        setIcon(images.tap);
        break;
      case 'Scratching':
        setIcon(images.scratch);
        break;
      case 'Rain sounds':
        setIcon(images.rain);
        break;
      case 'Rustling':
        setIcon(images.rust);
        break;
      case 'Mouth sounds':
        setIcon(images.mouth);
        break;
      case 'Positive messages':
        setIcon(images.message);
        break;
      case 'Brushing':
        setIcon(images.brush);
        break;
      case 'Page Turning':
        setIcon(images.page);
        break;
      default:
        break;
    }
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        {icon ? (
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        ) : null}
      </View>
      <View style={styles.textRow}>
        <Text style={styles.text}>{props.name}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20 * pt,
    width: '22%'
  },
  iconRow: {
    padding: 10 * pt,
  },
  textRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FF5757',
    textTransform: 'uppercase',
    fontSize: 12 * pt,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  icon: {
    width: 35 * pt,
    height: 35 * pt,
    resizeMode: 'contain',
  },
});
export default TypeCard;
