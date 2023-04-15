import {Dimensions} from 'react-native';
export const pt = Dimensions.get('screen').width / 414;
export const fixUrlSound = (url: string) => {
  let fullUrl = 'file://' + url;
  if (url.includes('https://')) fullUrl = url.slice(0, -1) + '.mp3';
  return fullUrl;
};
