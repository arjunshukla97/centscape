import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Product from '../../service/models/product';
import normalize from '../../utils/functions';
import {AnimatedSkeleton} from '../skeleton';
import {getBrandName, IMAGES, THEME} from '../../utils/constants';
type Props = {
  product: Product | null;
  containerStyle?: ViewStyle;
  resizeImage?: boolean;
  clear?: () => void;
};
export const WishListCard = ({
  product,
  containerStyle,
  resizeImage,
  clear,
}: Props) => {
  if (product == null || !product)
    return (
      <View style={{...styles.container, ...containerStyle}}>
        <View style={styles.imageContainer}>
          <AnimatedSkeleton style={styles.image} />
        </View>
        <View style={{...styles.textContainer, width: '60%'}}>
          <AnimatedSkeleton style={styles.skeletonTextLoader} />
          <AnimatedSkeleton style={styles.skeletonTextLoader} />
          <AnimatedSkeleton style={styles.skeletonTextLoader} />
        </View>
      </View>
    );
  else
    return (
      <View style={{...styles.container, ...containerStyle}}>
        {clear && (
          <Pressable
            style={styles.floatingButton}
            accessibilityLabel="Clear preview item"
            onPress={clear}>
            <Text style={styles.plus}>X</Text>
          </Pressable>
        )}
        <View style={styles.imageContainer}>
          <Image
            source={
              product?.image ? {uri: product.image} : IMAGES.PLACEHOLDER_IMAGE
            }
            style={styles.image}
            resizeMode={resizeImage ? 'contain' : undefined}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.brand}>
            {product?.siteName ? getBrandName(product.siteName) : 'N/A'}
          </Text>
          <Text style={styles.product} numberOfLines={2}>
            {product?.title || 'N/A'}
          </Text>
          <Text style={styles.brand}>
            {product.price ? product.currency + ' ' + product.price : 'N/A'}
          </Text>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: THEME.transparent,
    paddingVertical: '2.5%',
    paddingHorizontal: '2.5%',
    marginBottom: normalize(0.5),
  },
  brand: {
    fontWeight: '800',
    fontSize: normalize(15),
  },
  product: {
    fontWeight: '400',
    fontSize: normalize(15),
  },
  imageContainer: {
    width: '40%',
    alignItems: 'center',
  },
  textContainer: {
    maxWidth: '60%',
    paddingHorizontal: '5%',
    justifyContent: 'space-evenly',
  },
  image: {
    height: normalize(120),
    width: normalize(120),
    borderRadius: normalize(15),
  },
  floatingButton: {
    height: normalize(25),
    width: normalize(25),
    borderRadius: normalize(20),
    backgroundColor: THEME.black,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: normalize(-5),
    right: normalize(-5),
  },
  plus: {
    color: THEME.white,
    fontWeight: '800',
    fontSize: normalize(14),
  },
  skeletonTextLoader: {
    height: normalize(20),
    width: '90%',
    alignSelf: 'center',
  },
});
