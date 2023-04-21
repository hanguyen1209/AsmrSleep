import React, {useEffect, useRef, useState} from 'react';
import {pt} from '../Utils';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import * as images from '../assets';

const IntensityCard = (props: any) => {
  const [icon, setIcon] = useState(null);
  useEffect(() => {
    switch (props.type) {
      case 1:
        setIcon(images.softIcon);
        break;
      case 2:
        setIcon(images.mediumIcon);
        break;
      case 3:
        setIcon(images.intenseIcon);
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
    flex: 1,
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
    fontSize: 14 * pt,
    fontWeight: 'bold',
  },
  icon: {
    width: 35 * pt,
    height: 35 * pt,
    resizeMode: 'contain',
  },
});
export default IntensityCard;
