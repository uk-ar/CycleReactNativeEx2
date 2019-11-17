import Rx from 'rxjs/Rx';
import _ from 'lodash';
import { StackNavigator } from 'react-navigation';

import {
  UIManager,
  ListView,
  LayoutAnimation
} from 'react-native';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
} from './constants';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

function model(actions) {
  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */

  const selectedBook$ = actions.goToBookView$;

  function genItems(searchedBooks, savedBooks) {
    // move to model?
    function booksToObject(books) {
      // https://github.com/eslint/eslint/issues/5284
      /* eslint prefer-const:0 */
      return books.reduce((acc, book) => {
        acc[book.key] = book;
        return acc;
      }, {});
    }
    const obj = booksToObject(savedBooks);
    return {
      search: booksToObject(
        searchedBooks.map(book => obj[`isbn-${book.isbn}`] || book)),
      liked: booksToObject(
        savedBooks.filter(book => book.bucket === 'liked')),
      borrowed: booksToObject(
        savedBooks.filter(book => book.bucket === 'borrowed')),
      done: booksToObject(
        savedBooks.filter(book => book.bucket === 'done')),
    };
  }
  // selectedSection triggers scroll and update value when animation end
  // update with animation when selectedSection$ changed
  const books$ =
    // Rx.Observable.just(null);
    Rx.Observable.combineLatest(
      actions.searchedBooksStatus$// .do(i => console.log('searched books'))
      // searchedBooks$//.do(i => console.log('searched books'))
      ,
      actions.savedBooksStatus$// .do(i => console.log('saved books st:',i))
      ,
      genItems)
      // .debounce(1)// Millisecond
      .shareReplay();

  const limit = 2;

  //const state$ =  actions.press$
  const state1$ = Rx.Observable
                   .combineLatest(
                     actions.changeQuery$.startWith(""),
                     actions.press$.startWith(""),
                   )//.subscribe();
  const state$ = state1$//actions.press$//actions.changeQuery$//
  return state$;
}

module.exports = model;
