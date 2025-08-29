import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {WishListCard} from './wishlistCard';
import Product from '../../service/models/product';
import {database} from '../../service/database';
import {WishListModal} from './wishlistModal';
import {useCallback, useEffect, useMemo, useState} from 'react';
import normalize, {loop} from '../../utils/functions';
import * as Linking from 'expo-linking';
import {IMAGES, LOCALHOST, NETWORK_IP, THEME} from '../../utils/constants';
import {Button} from '../button';
import {Avatar} from '../avatar';

export const WishList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [productlists, setProductlists] = useState<Product[] | null>(null);
  const url = Linking.useLinkingURL();

  useEffect(() => {
    const sub = database
      .get<Product>('products')
      .query()
      .observe()
      .subscribe(values =>
        // I have intentionally set a delay of 2s,
        //  just for visibility of skeleton loaders
        setTimeout(() => {
          setProductlists(values);
          setLoading(false);
        }, 2000),
      );

    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    if (url) {
      const {queryParams} = Linking.parse(url);
      if (queryParams?.url && !queryParams?.url.includes(NETWORK_IP) && !queryParams?.url.includes(LOCALHOST)) {
        setOpen(true);
        setText(
          Array.isArray(queryParams.url) ? queryParams.url[0] : queryParams.url,
        );
      }
    }
  }, [url]);

  const updateProducts = (item: Product) => {
    if (productlists != null) {
      setProductlists([...productlists, item]);
    } else {
      setProductlists([item]);
    }
  };

  const _renderWishlistCard = useCallback(({item}: {item: Product}) => {
    return <WishListCard product={item} />;
  }, []);
  const _listHeaderComponent = useMemo(() => {
    return (
      <>
        <View style={styles.circle} />
        <View style={styles.avatarWrapper}>
          <Avatar size={80} />
          <Text style={styles.welcomeText}>
            Hey Arjun,{`\n`}Good to see you again!
          </Text>
        </View>
        <View style={styles.listHeaderWrapper}>
          <Text style={styles.header}>My Wishlist </Text>
          {!loading && (
            <Pressable
              style={styles.floatingButton}
              accessibilityLabel="Open Add to wishlist modal"
              onPress={() => setOpen(true)}>
              <Text style={styles.plus}>+</Text>
            </Pressable>
          )}
        </View>
      </>
    );
  }, [loading]);

  const _listEmptyComponent = useMemo(() => {
    if (loading) {
      return <View>{loop(5, WishListCard, {product: null})}</View>;
    }
    return (
      <View style={styles.emptyListContainer}>
        <Image
          source={IMAGES.EMPTY_WISHLIST}
          resizeMode="contain"
          style={styles.emptyImage}
        />
        <Text style={styles.emptyImageText}>
          Your wishlist is currently empty!
        </Text>
        <Button
          text="Add to Wishlist"
          accessibilityLabel="Open Add to wishlist modal"
          onPress={() => setOpen(true)}
        />
      </View>
    );
  }, [loading]);

  const _separatorComponent = () => {
    if (productlists?.length) return <View style={styles.separator} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productlists}
        ListHeaderComponent={_listHeaderComponent}
        ListHeaderComponentStyle={styles.headerComponentStyle}
        contentContainerStyle={styles.contentStyle}
        renderItem={_renderWishlistCard}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={_separatorComponent}
        ItemSeparatorComponent={_separatorComponent}
        ListEmptyComponent={_listEmptyComponent}
      />
      <WishListModal
        open={open}
        setOpen={setOpen}
        value={text}
        setValue={setText}
        updateProducts={updateProducts}
      />
    </View>
  );
};

export default WishList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.transparent,
    justifyContent: 'center',
  },
  header: {
    fontSize: normalize(26),
    fontWeight: '800',
    marginHorizontal: '5%',
  },
  floatingButton: {
    height: normalize(25),
    width: normalize(25),
    borderRadius: normalize(40),
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    color: THEME.white,
    fontSize: normalize(18),
    marginTop: -normalize(3),
    fontWeight: '600',
  },

  circle: {
    height: normalize(600),
    width: normalize(600),
    borderRadius: normalize(300),
    backgroundColor: THEME.lighPrimary,
    left: -normalize(200),
    top: -normalize(400),
    position: 'absolute',
  },
  avatarWrapper: {
    justifyContent: 'center',
    marginBottom: normalize(70),
    width: '70%',
  },
  welcomeText: {
    marginLeft: normalize(15),
    marginTop: normalize(15),
    fontSize: normalize(18),
    fontWeight: '500',
    alignSelf: 'center',
  },
  listHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    height: normalize(300),
    width: normalize(300),
    alignSelf: 'center',
  },
  emptyImageText: {
    fontSize: normalize(15),
    fontWeight: '500',
  },
  separator: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: normalize(12),
    height: 0,
    borderBottomWidth: 1,
    borderColor: THEME.background,
  },
  headerComponentStyle: {
    marginVertical: normalize(15),
    alignSelf: 'flex-start',
  },
  contentStyle: {
    paddingBottom: normalize(30),
  },
});
