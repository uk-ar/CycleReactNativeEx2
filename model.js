import Rx from 'rx';
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
  // sync searchedBooksStatus$ & savedBooksStatus$
  /* .do(i=>console.log("items:",JSON.stringify(i)))
   * .distinctUntilChanged(x => JSON.stringify(x),(a,b)=>a!==b) */
      .shareReplay();

  const limit = 2;

  /* const dataSource$ =
   *   Rx.Observable.combineLatest(
   *     books$// .do(i => console.log('books', i))
   *     ,
   *     actions.selectedSection$// .do(i => console.log('selectedSection', i))
   *     ,
   *     actions.booksLoadingState$// .do(i => console.log('booksLoadingState', i))
   *     ,
   *     (books, selectedSection, booksLoadingState) => {
   *       const sections = {
   *         search: { close: selectedSection, loadingState: booksLoadingState },
   *         search_end: { count: Object.keys(books.search).length,
   *           section: 'search' },
   *         liked: { close: selectedSection, loadingState: booksLoadingState },
   *         liked_end: { count: Object.keys(books.liked).length, section: 'like' },
   *         borrowed: { close: selectedSection, loadingState: booksLoadingState },
   *         borrowed_end: { count: Object.keys(books.borrowed).length,
   *           section: 'borrowed' },
   *         done: { close: selectedSection, loadingState: booksLoadingState },
   *         done_end: { count: Object.keys(books.done).length, section: 'done' }
   *       };
   *       const sectionIdentities =
   *         selectedSection ?
   *         [selectedSection, `${selectedSection}_end`] :
   *         Object.keys(books);
   *       // Object.keys(items).filter(i => i !== 'sections');
   *       return ({
   *         dataBlob: { ...books, sections },
   *         sectionIdentities,
   *         //rowIdentities
   *       });
   *     })
   *     //.do(i=>console.log("items:",i.dataBlob))
   *     .scan(
   *       (datasource, { dataBlob, sectionIdentities }) =>
   *       //  (datasource, { dataBlob, sectionIdentities, rowIdentities }) => {
   *          datasource.cloneWithRowsAndSections(
   *           // dataBlob, sectionIdentities, rowIdentities);
   *           dataBlob, sectionIdentities)
   *       , new ListView.DataSource({
   *         rowHasChanged: (r1, r2) => r1 !== r2,
   *         sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
   *         getSectionHeaderData: (dataBlob, sectionID) =>
   *           dataBlob.sections[sectionID]
   *       }))*/
      // .do(i=>console.log("items2:",i._dataBlob))
      // .do(i => console.log('datasource:', i));
      // .subscribe()

      // .do(i => console.log('rowIDs?:', i));
  // FIXME:bug with select done
  // Maybe scroll position keeped when transition
      /* const rowIDs =
     * selectedSection ?
     * undefined :
     * sectionIDs.map(sectionID =>
     *   Object.keys(items[sectionID]).slice(0, limit || undefined));
     * console.log("row:",rowIDs);*/

  /* const counts$ =
   *   items$.map(genCounts);*/
  // const items = genItems(searchedBooks, savedBooks);
  // const counts = genCounts(items);
  const state$ = Rx
    .Observable
    .combineLatest(
      actions.searchedBooksStatus$,
      actions.savedBooksStatus$,
      actions.selectedSection$,
      actions.booksLoadingState$.startWith(false).distinctUntilChanged(),
      selectedBook$.startWith(null).distinctUntilChanged(),
      (searchedBooks, savedBooks,selectedSection, booksLoadingState,
       navigationState, selectedBook, i) => ({
         searchedBooks, savedBooks, selectedSection, booksLoadingState,
         navigationState, selectedBook, i }));
  return state$;
}

module.exports = model;
