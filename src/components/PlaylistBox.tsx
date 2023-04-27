import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as images from '../assets';
import {pt, refactorSoundData} from '../Utils';
import api from '../apis';
import {PlaylistSoundItem} from '.';

const PlaylistBox = (props: any) => {
    
  const copyPlaylistPrompt = () =>
    Alert.alert(`Do you want to copy Playlist: ${props.name} ?`, '', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
            props.navigation?.navigate('Modal', {
            sounds: data,
          });
        },
      },
    ]);
  const [data, setData] = useState([]);
  const _renderItems = useMemo(() => {
    return data.map((item: any, index) => (
      <View key={'--i+' + index + item.id} style={styles.itemBox}>
        <PlaylistSoundItem {...item} />
      </View>
    ));
  }, [data.length]);
  useEffect(() => {
    api
      .get('sounds/ids/' + props.soundIds)
      .then(res => {
        setData(res.data.data);
      })
      .catch(err => console.log(err.message, 'ERRR'));
  }, []);
  return (
    <View style={styles.constainer}>
      <TouchableOpacity style={styles.header} onPress={copyPlaylistPrompt}>
        <Text style={styles.title}>{props.name}</Text>
        <Image style={styles.copy} resizeMode="contain" source={images.copy} />
      </TouchableOpacity>
      {data.length ? _renderItems : null}
    </View>
  );
};
const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    borderRadius: 10 * pt,
    borderWidth: 1 * pt,
    borderColor: '#FF5757',
  },
  header: {
    flexDirection: 'row',
    padding: 10 * pt,
    backgroundColor: '#FF5757',
    borderTopLeftRadius: 10 * pt,
    borderTopRightRadius: 10 * pt,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17 * pt,
    paddingHorizontal: 8 * pt,
    flex: 1,
  },
  copy: {
    width: 30 * pt,
    height: 30 * pt,
    resizeMode: 'contain',
  },
  soundItem: {
    color: 'white',
    fontSize: 15 * pt,
  },
  itemBox: {
    borderColor: '#FF5757',
    borderTopWidth: 1 * pt,
    padding: 15 * pt,
  },
});
export default PlaylistBox;
