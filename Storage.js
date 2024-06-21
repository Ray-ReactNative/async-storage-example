import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24 * 30,
  enableCache: true, //讀寫時內存中緩存數據
  sync: {},
});

global.storage = storage;
