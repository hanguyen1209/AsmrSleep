import { Dimensions, Platform } from "react-native";

export const pt = Dimensions.get('screen').width / 414

export const fixUrlSound = (url: String) => {
    const fullUrl =  url.slice(0,-1) + '.mp3'
    return fullUrl;
}
