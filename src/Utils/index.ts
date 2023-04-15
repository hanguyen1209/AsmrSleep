import {Dimensions} from 'react-native';
import RNFS from 'react-native-fs';
export const pt = Dimensions.get('screen').width / 414;

export const fixUrlSound = (url: string) => {
  let fullUrl = 'file://' + url;
  if (url.includes('https://')) fullUrl = url.slice(0, -1) + '.mp3';
  console.log(fullUrl, 'fullUrl')
  return fullUrl;
};
