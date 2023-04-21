import {Dimensions} from 'react-native';
import {Sound} from '../store/Sounds';
import store from '../store';
export const pt = Dimensions.get('screen').width / 414;
export const fixUrlSound = (url: string) => {
  let fullUrl;
  if (url.includes('https://')) {
    fullUrl = url.slice(0, -1) + '.mp3';
  } else {
    fullUrl = 'file://' + url;
  }
  return fullUrl;
};
export const refactorSoundData: any = (data: Sound[]) => {
  const listSoundDownloaded: any = store.getState().sounds;
  return data.map(item => {
    const _url = listSoundDownloaded[item.url];
    if (_url) {
      item.url = _url.url;
      item.online = false;
    }
    return item;
  });
};
