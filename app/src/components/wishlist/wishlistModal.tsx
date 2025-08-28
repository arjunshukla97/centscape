import {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  fetchAndSaveProduct,
  saveToDb,
} from '../../service/services/productService';
import {WishListCard} from './wishlistCard';
import Product from '../../service/models/product';
import normalize from '../../utils/functions';
import * as Clipboard from 'expo-clipboard';
import {Button} from '../button';
import {IMAGES, THEME} from '../../utils/constants';
import Toast from 'react-native-toast-message';
interface WishListModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  value?: string;
  setValue: (text: string) => void;
  updateProducts: (products: Product) => void;
}

export const WishListModal = (props: WishListModalProps) => {
  const {open, setOpen, value = '', setValue, updateProducts} = props;
  const [data, setData] = useState<Product>();
  const [loading, setLoading] = useState(false);
  const [loadPreview, setLoadPreview] = useState(false);

  const fetchDeeplinkPreview = useCallback(
    async (deeplink: string) => {
      setLoading(true);
      setLoadPreview(true);
      setValue(deeplink);
      fetchData(deeplink);
    },
    [setValue],
  );

  useEffect(() => {
    if (value) {
      fetchDeeplinkPreview(value);
    }
  }, [value, fetchDeeplinkPreview]);
  const copyText = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text?.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'Please provide a valid link',
      });
      return;
    }
    setValue(text);
  };

  const fetchData = async (url: string) => {
    try {
      setLoading(true);

      const response = await fetchAndSaveProduct(url);

      if (response?.success) {
        setData(response.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Oops!',
          text2:
            response.message ||
            response.error.message ||
            'Something went wrong',
        });
        clear();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Unable to fetch product',
      });
      clear();
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    if (!data) return;

    setLoading(true);

    try {
      const response = await saveToDb(data);

      if (response.success) {
        if (response?.product && response.product != null) {
          updateProducts(response.product as Product);
        }
        Toast.show({
          type: 'success',
          text1: 'Wohoo!',
          text2: 'One more item added to your wishlist',
        });
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Oops!',
          text2: response?.message || 'Something went wrong',
        });
        clear();
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'Something went wrong',
      });
      setLoading(false);
    }
  };

  const closeModal = () => {
    clear();
    setOpen(false);
  };

  const clear = () => {
    setData(undefined);
    setValue('');
    setLoadPreview(false);
    setLoading(false);
  };
  return (
    <Modal visible={open} transparent={true}>
      <Pressable
        style={styles.container}
        accessibilityLabel="Close Add to Wishlist Modal"
        onPress={closeModal}>
        <Pressable style={styles.modal} onPress={e => e.stopPropagation()}>
          <Text style={styles.heading}>Add to Wishlist</Text>
          {loadPreview ? (
            <>
              <WishListCard
                product={data ? data : null}
                containerStyle={styles.wishlistContainer}
                clear={!loading ? clear : undefined}
              />
              <Text style={styles.text}>
                Looks good? Tap Add to Wishlist to save this item.
              </Text>
            </>
          ) : null}
          {!data && (
            <>
              <Text style={styles.text}>
                Found something you love? Drop the product link below to add it
                to your wishlist.
              </Text>
              <View style={styles.textinputContainer}>
                <View style={{...styles.textinput, justifyContent: 'center'}}>
                  <Text
                    numberOfLines={1}
                    style={{color: value ? THEME.text : THEME.placeholder}}>
                    {value ? value : 'Paste your link here!'}
                  </Text>
                </View>

                <Pressable
                  accessibilityLabel="Paste Link"
                  onPress={copyText}
                  style={styles.iconContainer}>
                  {loading ? (
                    <ActivityIndicator color={THEME.black} />
                  ) : (
                    <Image
                      source={IMAGES.CLIPBOARD}
                      style={{height: normalize(30), width: normalize(30)}}
                    />
                  )}
                </Pressable>
              </View>
            </>
          )}

          {data && (
            <Button
              text="ADD TO WISHLIST"
              accessibilityLabel="Add to Wishlist"
              onPress={saveData}
              style={{width: '60%'}}
              loading={loading}
            />
          )}
        </Pressable>
      </Pressable>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.transparency40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    height: 'auto',
    width: '85%',
    backgroundColor: THEME.white,
    borderRadius: normalize(15),
    alignItems: 'center',
    padding: normalize(25),
  },
  textinputContainer: {
    flexDirection: 'row',
    height: normalize(45),
    backgroundColor: THEME.background,
    width: '100%',
    alignSelf: 'center',
    borderRadius: normalize(8),
    marginTop: normalize(15),
    overflow: 'hidden',
  },
  textinput: {
    backgroundColor: THEME.background,
    height: '100%',
    width: '87%',
    paddingHorizontal: normalize(10),
  },
  heading: {
    fontWeight: '800',
    fontSize: normalize(22),
  },
  text: {
    fontWeight: '500',
    fontSize: normalize(15),
    marginTop: normalize(15),
  },
  floatingButton: {
    height: normalize(25),
    width: normalize(25),
    borderRadius: normalize(20),
    backgroundColor: 'black',
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
  wishlistContainer: {
    shadowColor: THEME.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    width: '105%',
    borderRadius: normalize(15),
    backgroundColor: THEME.white,
    marginTop: normalize(15),
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  iconContainer: {
    width: '13%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
