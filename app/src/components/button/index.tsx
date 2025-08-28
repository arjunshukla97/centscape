import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import normalize from '../../utils/functions';
import {THEME} from '../../utils/constants';

interface Props {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disable?: boolean;
  accessibilityLabel?: string;
}
export const Button = ({
  text,
  onPress,
  style,
  textStyle,
  loading,
  disable,
  accessibilityLabel,
}: Props) => {
  return (
    <Pressable
      style={{
        ...styles.container,
        backgroundColor: disable ? THEME.background : THEME.primary,
        ...style,
      }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disable || loading}>
      {loading ? (
        <ActivityIndicator color={THEME.white} />
      ) : (
        <Text
          style={{
            ...styles.text,
            color: disable ? THEME.text : THEME.white,
            ...textStyle,
          }}>
          {text}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '40%',
    height: normalize(40),

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(12),
    marginTop: normalize(15),
    paddingHorizontal: normalize(15),
  },
  text: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
});
