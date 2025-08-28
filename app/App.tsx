import {StatusBar} from 'expo-status-bar';
import {LogBox, SafeAreaView, StyleSheet} from 'react-native';
import Wishlist from './src/components/wishlist';
import {THEME} from './src/utils/constants';
import Toast from 'react-native-toast-message';
LogBox.ignoreAllLogs();
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Wishlist />
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
  },
});
