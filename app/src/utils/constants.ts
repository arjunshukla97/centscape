export const NETWORK_IP = '192.168.1.5';
export const PORT = '3000';
export const THEME = {
  primary: '#72b354',
  lighPrimary: '#ddf5d5',
  secondary: '#3d3d3d',
  text: '#12202F',
  white: '#ffffff',
  black: '#000000',
  background: '#e5e5e5',
  transparent: 'transparent',
  transparency40: 'rgba(0,0,0,0.4)',
  placeholder: '#868686',
  skeleton: '#E0E0E0',
};

export const IMAGES = {
  AVATAR: require('../../assets/avatar.jpeg'),
  EMPTY_WISHLIST: require('../../assets/emptylist.png'),
  PLACEHOLDER_IMAGE: require('../../assets/placeholder.jpeg'),
  CLIPBOARD: require('../../assets/icons/clipboard.png'),
};

export const URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)*?([\w-]+)\.(?:[a-z]{2,})(?:\.[a-z]{2,})?$/i;

export const getBrandName = (url: string) => {
     const match = url.match(URL_REGEX);
    if (match) {
      const brand = match[1];
      return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
    }
    return '';
  }