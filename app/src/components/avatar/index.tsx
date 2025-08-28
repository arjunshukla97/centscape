import {StyleSheet, Image, View} from 'react-native';
import normalize from '../../utils/functions';
import {IMAGES, THEME} from '../../utils/constants';

interface AvatarProps {
  size: number;
}

export const Avatar = (props: AvatarProps) => {
  const {size} = props;

  return (
    <View
      style={[
        styles.container,
        {
          height: normalize(size),
          width: normalize(size),
          borderRadius: normalize(size / 2),
        },
      ]}>
      <Image
        source={IMAGES.AVATAR}
        style={{
          height: normalize(size - 10),
          width: normalize(size - 10),
          borderRadius: normalize(size - 10 / 2),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(30),
    marginLeft: normalize(15),
  },
});
