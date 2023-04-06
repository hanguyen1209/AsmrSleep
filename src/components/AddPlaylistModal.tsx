import React, {useContext, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addNewPlaylist, addToOldPlaylist} from '../store/Playlist';
import {Sound} from '../store/Sounds';
import {pt} from '../Utils';
import PlaylistForSelect from './PlaylistForSelect';
import {Playlist} from '../store/Playlist';

interface PlaylistForSelect {
  id: Number;
  name: String;
  isChosed: Boolean;
  totalSound: Number;
}
const AddPlaylistModal = ({navigation, route}: any) => {
  const [id, setChosedPlaylistId] = useState(null);
  const dispatch = useDispatch();
  const name = useRef('');
  const playlist = useSelector((state: any) => state.playlist);
  const _addToPlaylist = () => {
    if (id !== null) {
      const sound = {
        url: route.params.sound.url,
        id: route.params.sound.id,
        online: true,
        volumn: 80,
      };
      const data = {
        id,
        sound,
      };
      dispatch(addToOldPlaylist(data));
    } else if (name.current && id === null) {
      const data: {name: String; sounds: Array<Sound>} = {
        name: name.current,
        sounds: [
          {
            url: route.params.sound.url,
            id: route.params.sound.id,
            online: true,
            volumn: 80,
            name: route.params.sound.name
          },
        ],
      };
      dispatch(addNewPlaylist(data));
    } else return;
    navigation.goBack();
  };
  const _changeText = (text: string) => {
    name.current = text;
  };

  return (
    <View
      style={{flex: 10, flexDirection: 'column', justifyContent: 'flex-end'}}>
      <TouchableOpacity
        style={{flex: 4, width: '100%'}}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 6,
          width: '100%',
          backgroundColor: '#151515',
          alignSelf: 'center',
          borderRadius: 30 * pt,
        }}>
        <View style={{justifyContent: 'flex-end'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                height: 30 * pt,
                borderRadius: 5 * pt,
                justifyContent: 'center',
                margin: 30 * pt,
              }}>
              <TextInput
                onChangeText={_changeText}
                onFocus={() => {
                  setChosedPlaylistId(null);
                }}
                style={{fontSize: 15 * pt, paddingHorizontal: 10 * pt}}
                placeholder="Give it a name then click add button"
              />
            </View>
            <TouchableOpacity
              onPress={_addToPlaylist}
              style={{
                backgroundColor: '#FF5757',
                borderRadius: 5 * pt,
                marginRight: 30 * pt,
              }}>
              <Text
                style={{
                  color: 'white',
                  padding: 8 * pt,
                  fontWeight: '700',
                  fontSize: 15 * pt,
                }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {playlist.map((item: Playlist, index: any) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setChosedPlaylistId(index);
                }}
                key={'playlist-' + index}
                style={{flex: 1, alignItems: 'center'}}>
                <PlaylistForSelect
                  name={item.name}
                  isChosed={index == id}
                  totalSound={item.sounds.length}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};
export default AddPlaylistModal;
