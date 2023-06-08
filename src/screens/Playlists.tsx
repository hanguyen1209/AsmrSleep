import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Share} from 'react-native';
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
import {App, setInitial} from '../store/App';
import {
  Playlist as PlaylistType,
  updateIsLoop,
  updateIsMix,
} from '../store/Playlist';
import {pt} from '../Utils';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-clipboard/clipboard';
import {LIST_MESSAGE_SHARE} from '../config';

const Playlists = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const _renderPlaylist = ({item, index}: any) => {
    return <SoundBar {...item} soundId={index} />;
  };

  const [shareLoading, setShareLoading] = useState(false);

  const playlist = useSelector(
    (store: {playlist: Array<PlaylistType>}) => store.playlist,
  );

  const playlistCurrentIndex = useSelector(
    (state: {app: App}) => state.app.playlistCurrentIndex,
  );

  const _changeLooping = () => {
    dispatch(updateIsLoop({id: playlistCurrentIndex}));
    dispatch(setInitial());
  };

  const _changeMixing = () => {
    dispatch(updateIsMix({id: playlistCurrentIndex}));
    dispatch(setInitial());
  };

  useEffect(() => {
    if (!playlist.length) navigation.goBack();
  }, [playlist.length]);

  const onShare = async (link: String) => {
    try {
      const random = Math.floor(Math.random() * 10);
      const result = await Share.share({
        message: `${link}\n${LIST_MESSAGE_SHARE[random]}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const generateLink = async function buildLink(ids: String) {
    const link = await dynamicLinks().buildShortLink({
      link: 'https://asmr-sleep.gappvn.com#' + ids,
      domainUriPrefix: 'https://asmr-sleep.gappvn.com',
      ios: {
        bundleId: 'com.gappvn.asmr-sleep',
        appStoreId: '1664664165',
        fallbackUrl:
          'https://apps.apple.com/vn/app/cover-letter-templates/id1664664165',
      },
      android: {
        packageName: 'com.asmrsleep',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.CoverLetter',
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    });
    return link;
  };
  const _share = async () => {
    setShareLoading(true);
    if (playlist[playlistCurrentIndex]?.sounds) {
      const arr: (Number | null)[] = [];
      playlist[playlistCurrentIndex]?.sounds.forEach((value, index) => {
        arr.push(value.id);
      });
      if (arr) {
        setTimeout(() => {
          setShareLoading(false);
        }, 1500);
        const ids = arr.join(',');
        const Buffer = require('buffer').Buffer;
        const encodedStr = new Buffer(ids).toString('base64');
        if (encodedStr) {
          const link = await generateLink(encodedStr);
          if (link) {
            Clipboard.setString(link);
            onShare(link);
          }
        }
      }
    }
  };

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
          {/* <TouchableOpacity>
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
          </TouchableOpacity> */}
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
      {playlist.length ? (
        <View style={styles.bottom}>
          <View style={styles.toggleBox}>
            <Toggle
              isEnabled={playlist[playlistCurrentIndex]?.isLoop}
              onValueChange={_changeLooping}></Toggle>
            <Text style={styles.toggleTitle}>Loop</Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {shareLoading ? (
              <ActivityIndicator style={styles.share} />
            ) : (
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
                <Text style={styles.shareTitle}>
                  Share {`\n`} your playlist
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.toggleBox}>
            <Toggle
              isEnabled={playlist[playlistCurrentIndex]?.isMix}
              onValueChange={_changeMixing}></Toggle>
            <Text style={styles.toggleTitle}>Mix</Text>
          </View>
        </View>
      ) : null}
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
