import React, {useEffect, useRef, useState} from 'react';
import {pt} from '../Utils';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import * as images from '../assets';

const TypeCard = (props: any) => {
  const [icon, setIcon] = useState(null);
  useEffect(() => {
    switch (props.type) {
      case 1:
        setIcon(images.whisper);
        break;
      case 2:
        setIcon(images.tap);
        break;
      case 3:
        setIcon(images.scratch);
        break;
      case 4:
        setIcon(images.rain);
        break;
      case 5:
        setIcon(images.rust);
        break;
      case 6:
        setIcon(images.mouth);
        break;
      case 7:
        setIcon(images.message);
        break;
      case 8:
        setIcon(images.brush);
        break;
      case 9:
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
    textTransform: 'capitalize',
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
