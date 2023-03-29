import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as images from '../assets';
import {Playlist, SoundBar} from '../components';
import {pt} from '../Utils';

const FILES = [
  `https://asmrsound.s3.ap-southeast-1.amazonaws.com/Can't+Hide+-+Otis+McDonald.mp3`,
  `https://asmrsound.s3.ap-southeast-1.amazonaws.com/Emotional+Mess+-+Amy+Lynn+%26+the+Honey+Men.mp3`
];

const DATA = [
  {
    name: 's1',
    url: FILES[0],
    volumn: 30,
    id: 0,
  },
  {
    name: 's2',
    url: FILES[1],
    volumn: 50,
    id: 1,
  },
  // {
  //   name: 's3',
  //   url: FILES[2],
  //   volumn: 10,
  //   id: 2,
  // },
  // {
  //   name: 's4',
  //   url: FILES[3],
  //   volumn: 70,
  //   id: 3,
  // },
];

const Playlists = () => {
  const _renderPlaylist = ({item}: any) => {
    return <SoundBar {...item}/>;
  };
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backTouch}>
          <Image
            style={{height: 27 * pt, width: 20 * pt}}
            source={images.back}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.centerView}></View>
        <View style={styles.recordAndBrowser}>
          <TouchableOpacity>
            <Image
              style={{height: 35 * pt, width: 35 * pt}}
              source={images.browser}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.record}>
            <Image
              style={{height: 35 * pt, width: 35 * pt}}
              source={images.record}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={true}
        style={styles.playLists}>
        <Playlist text="test Playlist 1" isPlaying={true} />
        <Playlist text="test Playlist 2" isPlaying={false} />
        <Playlist text="Playlist 3" isPlaying={false} />
      </ScrollView>
      <View style={styles.soundBars}>
        <FlatList
          data={DATA}
          keyExtractor={(item, index) => `--${index}`}
          renderItem={_renderPlaylist}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * pt,
  },
  SafeAreaView: {
    flex: 1,
    paddingVertical: 20 * pt,
  },
  centerView: {
    flex: 1,
  },
  recordAndBrowser: {
    flexDirection: 'row',
  },
  record: {
    marginLeft: 20 * pt,
  },
  backTouch: {
    paddingRight: 20 * pt,
  },
  playLists: {
    padding: 20 * pt,
    maxHeight: 70 * pt,
  },
  soundBars: {
    padding: 20 * pt,
  },
});

export default Playlists;
