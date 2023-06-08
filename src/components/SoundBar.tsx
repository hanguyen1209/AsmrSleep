import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fixUrlSound, pt} from '../Utils';
import * as images from '../assets';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Player} from '@react-native-community/audio-toolkit';
import {useDispatch, useSelector} from 'react-redux';
import {App, changeCurrentPlaylistIndex, setInitial} from '../store/App';
import {
  adjustVolumnSound,
  deletePlaylist,
  deleteSoundInPlaylist,
  Playlist as PlaylistType,
  updateSoundDownloaded,
} from '../store/Playlist';
import {Sound, addSound, resetSound} from '../store/Sounds';
import {default as api} from '../apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DownloadResult = {
  jobId: number;
  statusCode: number;
  bytesWritten: number;
};

const SoundBar = (props: any) => {
  const [icon, setIcon] = useState();
  const dispatch = useDispatch();
  const RNFS = require('react-native-fs');
  const filePath = RNFS.CachesDirectoryPath + '/' + 'id' + props.id + '.mp3';

  const playlist = useSelector(
    (store: {playlist: Array<PlaylistType>}) => store.playlist,
  );

  const playlistCurrentIndex = useSelector(
    (state: {app: App}) => state.app.playlistCurrentIndex,
  );

  const listSound: any = useSelector((state: {sounds: Sound}) => state.sounds);

  const playbackOptions = {
    continuesToPlayInBackground: true,
    mixWithOthers: true,
    loop: true,
  };
  const sound = useRef(
    new Player(fixUrlSound(props.url), playbackOptions),
  ).current;
  const isPreparing = useRef(false);
  const [disable, setDisable] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const checkIfFileAvailable = async () => {
    return await RNFS.exists(filePath);
  };

  const checkIfSoundStored = () => {
    return listSound[props.url] ? true : false;
  };

  const downloadFileDone = () => {
    const data = {
      soundId: props.id,
      url: filePath,
      name: props.name,
      volume: props.volume || .5,
      _url: props.url,
      soundIDinList: props.soundId,
    };
    dispatch(addSound({data}));
    setDownloadLoading(false);
  };

  const startDownload = async () => {
    const downloadOptions = {
      fromUrl: fixUrlSound(props.url),
      toFile: filePath,
      connectionTimeout: 180000,
      readTimeout: 180000,
      cacheable: false,
      background: false,
      backgroundTimeout: 180000,
      progressInterval: 100,
    };
    const download = RNFS.downloadFile(downloadOptions);
    download.promise
      .then(async (res: DownloadResult) => {
        if (res.statusCode == 200 && res.bytesWritten) {
          const data = {
            soundId: props._id,
            id: await AsyncStorage.getItem('uid'),
          };
          api
            .post('/sounds/download', data)
            .then(() => {
              downloadFileDone();
              updateUrlAndOnlineStatus();
            })
            .catch(err => {
              setDownloadLoading(false);
              setDownloaded(false);
              console.log(err.message, 'ERRRR1');
            });
        }
      })
      .catch((err: any) => {
        setDownloadLoading(false);
        setDownloaded(false);
      });
  };

  const updateUrlAndOnlineStatus = () => {
    dispatch(
      updateSoundDownloaded({
        soundId: props.soundId,
        id: playlistCurrentIndex,
        url: filePath,
      }),
    );
    setDownloadLoading(false);
    setDownloaded(true);
  };

  const _downloadFile = async () => {
    setDownloadLoading(true);
    if (await checkIfFileAvailable()) {
      if (!checkIfSoundStored()) {
        downloadFileDone();
      }
      updateUrlAndOnlineStatus();
    } else {
      startDownload();
    }
  };

  useEffect(() => {
    setDownloaded(!props.online);
  }, [props.online]);

  useEffect(() => {
    Icon.getImageSource('circle', 15, 'white').then(setIcon);
  }, []);

  useEffect(() => {
    // if (isPreparing.current == true) return;
    // isPreparing.current = true;
    // sound.prepare(err => {
    //   if (!err) {
    //     sound.volume = parseInt(props.volume);
    //     setDisable(false);
    //   } else {
    //     setDisable(true);
    //   }
    //   isPreparing.current = false;
    // });
    return () => {
      sound.destroy();
    };
  }, [downloaded, sound]);

  const _removeSound = () => {
    if (playlist[playlistCurrentIndex].sounds.length == 1) {
      dispatch(deletePlaylist({id: playlistCurrentIndex}));
      dispatch(
        changeCurrentPlaylistIndex({
          id: playlistCurrentIndex > 0 ? playlistCurrentIndex - 1 : 0,
        }),
      );
    } else {
      dispatch(
        deleteSoundInPlaylist({
          id: playlistCurrentIndex,
          soundId: props.soundId,
        }),
      );
    }
    dispatch(setInitial());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => _removeSound()}>
        <Image
          style={styles.remove}
          source={images.closeWhiteRound}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.main}>
        <View style={styles.above}>
          <View style={{flex: 1}}>
            <Text style={styles.text1}>{props.name}</Text>
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            <Image
              style={{width: 20 * pt, height: 20 * pt, opacity: 0.7}}
              resizeMode="contain"
              source={images.volume}
            />
          </View>
        </View>
        <View style={styles.below}>
          <Slider
            disabled={disable}
            style={{maxHeight: 20 * pt}}
            minimumValue={0}
            maximumValue={1}
            value={props.volume}
            maximumTrackTintColor="#FFFFFF"
            minimumTrackTintColor={'#FF5757'}
            thumbImage={icon}
            onSlidingComplete={value => {
              dispatch(
                adjustVolumnSound({
                  id: playlistCurrentIndex,
                  soundId: props.soundId,
                  volume: value,
                }),
              );
              dispatch(setInitial());
            }}
          />
          <Text style={styles.text2}>ID: {props.id}</Text>
        </View>
      </View>
      {!downloadLoading ? (
        downloaded ? (
          <View>
            <Image
              style={styles.download}
              source={images.doneGray}
              resizeMode="contain"
            />
          </View>
        ) : (
          <TouchableOpacity onPress={_downloadFile} disabled={disable}>
            <Image
              style={styles.download}
              source={disable ? images.downloadGray : images.downloadWhite}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )
      ) : (
        <ActivityIndicator style={styles.download}></ActivityIndicator>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20 * pt,
  },
  play: {
    width: 30 * pt,
    height: 30 * pt,
  },
  remove: {
    width: 30 * pt,
    height: 30 * pt,
    marginLeft: 10 * pt,
  },
  download: {
    width: 30 * pt,
    height: 30 * pt,
    marginHorizontal: 20 * pt,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20 * pt,
    height: 35 * pt,
  },
  above: {
    flex: 1,
    flexDirection: 'row',
  },
  below: {
    height: 15 * pt,
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 13 * pt,
    color: '#FF5757',
    flex: 1,
  },
  text2: {
    fontWeight: 'bold',
    fontSize: 10 * pt,
    color: 'gray',
  },
  disable: {
    opacity: 0.3,
  },
  enable: {
    opacity: 1,
  },
});
export default SoundBar;
