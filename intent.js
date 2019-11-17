import Rx from 'rx';
import _ from 'lodash';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID,
} from './constants';

import {
  InteractionManager,
} from 'react-native';

function intent(RN, HTTP) {
  // Actions
  const changeQuery$ = RN
    .select('search')
    .events('changeText')
    .map(([text]) => text)
    .startWith("foo")
    .do((e)=>console.log(e))

  const press$ = RN
    .select('search')
    .events('press')
    //.events('changeText')

  const requestSearchedBooks$ =
    changeQuery$.debounce(500)
                .filter(query => query.length > 1)
                .map(q => ({
                  category: 'search',
                  url: RAKUTEN_SEARCH_API + encodeURI(q),
                  headers: { 'Content-Type':
                             'application/json; charset=utf-8' },
                  accept: 'Accept-Language:ja,en-US;q=0.8,en;q=0.6'
                }));

  const searchedBooksResponse$ =
    HTTP.select('search')
        .switch()
        .map(res => res.text)
        .map(res => JSON.parse(res))
        .map(body =>
          body.Items
              .filter(book => book.isbn)
          // reject non book
              .filter(book =>
                book.isbn.startsWith('978') || book.isbn.startsWith('979'))
              .map(({ title, author, isbn, largeImageUrl }) => ({
                title: title.replace(/^【バーゲン本】/, ''),
                author,
                isbn,
                thumbnail: largeImageUrl,
              }))
        )
      .share();

  function createBooksStatusStream(books$, category) {
    function mergeBooksStatus(books, booksStatus) {
      return books.map((book) => {
        let libraryStatus;
        if ((booksStatus[book.isbn] !== undefined) && // not yet retrieve
            // sub library exist?
            (booksStatus[book.isbn][LIBRARY_ID].libkey !== undefined)) {
          const bookStatus = booksStatus[book.isbn][LIBRARY_ID];
          // TODO:support error case
          // if bookStatus.status == "Error"
          libraryStatus = {
            status: bookStatus.libkey,
            reserveUrl: bookStatus.reserveurl,
            rentable: _.values(bookStatus.libkey)
                       .some(i => i === '貸出可'),
            exist: Object.keys(bookStatus.libkey)
                         .length !== 0,
          };
        }
        // TODO:support books from search result
        // TODO:support books from saved result
        // TODO:move to booksStatusResponse$
        return ({
          ...book,
          libraryStatus,
          //active: true,
        });
      }
      );
    }

    const requestStatus$ =
      books$
        .map(books => books.map(book => book.isbn))
        .filter(isbns => isbns.length > 0)
        .map(q => ({
          category,
          url: CALIL_STATUS_API + encodeURI(q)
        }))
        .shareReplay();

    const booksStatusResponse$ =
      HTTP.select(category)
    // should handle as meta stream because of retry
          .map(stream =>
            stream.map(res => res.text)
                  .map(res => JSON.parse(res))
            // ok to retry but not output stream
            // .flatMap(result => result.continue === 1 ?
            //                 [result, Observable.throw(error)] : [result])
                  .flatMap(result => [{ ...result, continue: 0 }, result])
                  .map((result) => {
                    if (result.continue === 1) {
                      throw result;
                    }
                    return result;
                  })
                  .retryWhen(errors =>
                    errors.delay(2000)
                  )
                  .distinctUntilChanged(i => JSON.stringify(i))
                  .map(result => result.books))
          .switch();

    const booksStatus$ =
      Rx.Observable
        .combineLatest(
          books$,
          booksStatusResponse$.startWith({}),
          mergeBooksStatus,
        )
    // .switch()
        .distinctUntilChanged(i => JSON.stringify(i))
        .map(books =>
          books.map(book => ({ ...book, key: `isbn-${book.isbn}` })))
        .shareReplay();
    return ({
      booksStatus$,
      requestStatus$ });
  }

  const mockSearchedBooks = [
    /* { title: 'like:SOFT SKILLS', isbn: '9784822251550' },
     * { title: 'borrow:youji kyouiku keizai', isbn: '9784492314630' },
     * { title: 'done:simpsons', isbn: '9784105393069' },
     * { title: 'none:container', isbn: '9784822245641' },
     * { title: 'guri', isbn: '9784834032147' },
     * { title: 'ABC', isbn: '9784828867472' },*/
  ];

  const { booksStatus$: searchedBooksStatus$,
          requestStatus$: requestSearchedBooksStatus$ } =
            createBooksStatusStream(
              searchedBooksResponse$
                .startWith(mockSearchedBooks),
              'searchedBooksStatus');

  const request$ = Rx.Observable
                     .merge(requestSearchedBooks$,
                            requestSearchedBooksStatus$);

  const booksLoadingState$ =
    requestSearchedBooks$
      .map(_ => true)
      .merge(searchedBooksResponse$.map(_ => false))
      .startWith(false)
      .shareReplay();

  return {
    booksLoadingState$,
    searchedBooksStatus$,
    request$,
    press$,
    changeQuery$,
    goToBookView$: RN.select('main').events('selectCell')
                     .do(i => console.log('cell press:%O', i))
                     .map(([book]) => book)
                     .shareReplay(),
    filterState$: RN.select('filter')
                    .events('press')
                    .startWith(false)
                    .scan((current, event) => !current)
                    .do(i => console.log('filter change:%O', i)),
    sortState$: RN.select('sort')
                  .events('press')
                  .do(i => console.log('sort change:%O', i))
                  .startWith(false)
                  .scan((current, event) => !current)
                  .do(i => console.log('sort:%O', i)),
  };
}

module.exports = intent;
