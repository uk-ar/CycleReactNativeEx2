const STORAGE_KEY = '@CycleReactNativeEx:inBox';
// books search api cannot use query keyword
const RAKUTEN_SEARCH_API =
'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?format=json&booksGenreId=001&applicationId=1088506385229803383&formatVersion=2&keyword=';
const RAKUTEN_ISBN_API =
'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&applicationId=1088506385229803383&formatVersion=2&isbnjan=';

const LIBRARY_ID = 'Tokyo_Fuchu';
//const LIBRARY_ID = 'Tokyo_Inagi';

const CALIL_STATUS_API = `http://api.calil.jp/check?callback=no&appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=${LIBRARY_ID}&format=json&isbn=`;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
// mojibake シンプ Q思考
// NGsearch:ぐらと
// ああ　あ

const MOCKED_MOVIES_DATA = [
  { title: 'ぐりとぐらの絵本7冊セット',
    author: '',
    thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
    libraryStatus: {
      exist: false,
      rentable: false,
      reserveUrl: '',
    },
    isbn: '9784834032147',
    active: true,
  },
  { title: 'はじめてのABCえほん',
    author: '仲田利津子/黒田昌代',
    thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200',
    isbn: '9784828867472',
    active: true,
  },
  { title: 'ぐりとぐら(複数蔵書)',
    author: '中川李枝子/大村百合子',
    thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200',
    isbn: '9784834000825',
    libraryStatus: {
      exist: true,
      rentable: true,
      reserveUrl: 'http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f',
    },
    active: true,
  },
  { title: 'ぐりとぐらの1ねんかん(単一蔵書)',
    author: '中川李枝子/山脇百合子（絵本作家）',
    isbn: '9784834014655',
    libraryStatus: {
      exist: true,
      rentable: true,
      reserveUrl: 'https://library.city.fuchu.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1009710046217' },
    thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4655/9784834014655.jpg?_ex=200x200',
    active: true,
  },
  { title: 'IA／UXプラクティス',
    author: '坂本貴史',
    isbn: '9784862463241',
    libraryStatus: {
      exist: true,
      rentable: false,
      reserveUrl: '',
    },
    thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
    active: true,
  },
  //size 200x200 largeImageUrl 64x64
];

import materialColor from 'material-colors';

const itemsInfo = {
  search: {
    icon: 'search',
    text: '検索'
  },
  liked: {
    icon: 'heart-o',
    backgroundColor: materialColor.lightBlue[500],
    text: '読みたい'
  },
  borrowed: {
    icon: 'bookmark-o',
    backgroundColor: materialColor.green[500],
    text: '借りてる'
  },
  done: {
    icon: 'check-square-o',
    backgroundColor: materialColor.amber[500],
    text: '読んだ'
  }
};

import {
  Text,
  View,
  UIManager,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
  TextInput,
  NativeModules,
} from 'react-native';

import util from 'util';
function debugRenderRow(rowData, sectionID, columnID) {
  console.log('row:', rowData, sectionID, columnID);
  return (<View style={{ height: 400, borderColor: columnID % 2 ? 'yellow' : 'green', borderWidth: 3 }}><Text>row:{util.inspect(rowData)}</Text></View>);
}

// remove to index.js.android may overwrite by copy
// UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

function log(str) {
  return function (params) {
    console.log(`${str}:`, params);
  };
}

let TouchableElement = TouchableHighlight;
if (Platform.OS === 'android') {
  TouchableElement = TouchableNativeFeedback;
}
const FAIcon = require('react-native-vector-icons/FontAwesome');

module.exports = {
  //Touchable,
  //itemsInfo,
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  RAKUTEN_ISBN_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
  //TouchableElement,
};
