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
import {useDispatch, useSelector} from 'react-redux';
import * as images from '../assets';
import {Playlist, SoundBar, Toggle} from '../components';
import {App} from '../store/App';
import {
  Playlist as PlaylistType,
  updateIsLoop,
  updateIsMix,
} from '../store/Playlist';
import {pt} from '../Utils';

const Playlists = ({navigation}: any) => {
  const dispatch = useDispatch();
  const _renderPlaylist = ({item}: any) => {
    return <SoundBar {...item} />;
  };

  const playlist = useSelector(
    (store: {playlist: Array<PlaylistType>}) => store.playlist,
  );

  const playlistCurrentIndex = useSelector(
    (state: {app: App}) => state.app.playlistCurrentIndex,
  );

  const _changeLooping = () => {
    dispatch(updateIsLoop({id: playlistCurrentIndex}));
  };

  const _changeMixing = () => {
    dispatch(updateIsMix({id: playlistCurrentIndex}));
  };

  const _share = () => {};

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backTouch}>
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
        {playlist.map((item, index) => (
          <Playlist
            key={'p-' + index}
            text={item.name}
            isPlaying={index == playlistCurrentIndex}
            id={index}
          />
        ))}
      </ScrollView>

      <View style={styles.soundBars}>
        <FlatList
          data={playlist[playlistCurrentIndex]?.sounds}
          keyExtractor={(item, index) => `--${index}`}
          renderItem={_renderPlaylist}
        />
      </View>
      <View style={styles.bottom}>
        <View style={styles.toggleBox}>
          <Toggle
            isEnabled={playlist[playlistCurrentIndex].isLoop}
            onValueChange={_changeLooping}></Toggle>
          <Text style={styles.toggleTitle}>Loop</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={styles.share} onPress={_share}>
            <Image
              style={{
                resizeMode: 'contain',
                width: 30 * pt,
                height: 30 * pt,
              }}
              resizeMode="contain"
              source={images.shareIcon}
            />
            <Text style={styles.shareTitle}>Share {`\n`} your playlist</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toggleBox}>
          <Toggle
            isEnabled={playlist[playlistCurrentIndex].isMix}
            onValueChange={_changeMixing}></Toggle>
          <Text style={styles.toggleTitle}>Mix</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shareTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12 * pt,
  },
  bottom: {
    padding: 10 * pt,
    height: 100 * pt,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12 * pt,
    marginTop: 5 * pt,
  },
  toggleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 20 * pt,
  },
  share: {
    width: 130 * pt,
    height: 50 * pt,
    backgroundColor: '#FF5757',
    borderRadius: 15 * pt,
    borderWidth: 3 * pt,
    borderColor: 'white',
    marginBottom: 8 * pt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    flex: 1,
  },
});

export default Playlists;
