import Rx from 'rxjs/Rx';
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
    .filter(query => query.length > 1)
    .distinctUntilChanged()
    .debounceTime(500)
    .share()

  const searchHistory$ = RN
    .select('search')
    .events('submitEditing')
    .debounceTime(600)//for auto correct delay
    .withLatestFrom(
      changeQuery$//.startWith("")
    ).map(([first,second])=>second)
    .do(e=>console.log("su",e))
    .startWith([])
    .scan((searchHistory,query) => (
      [query].concat(
          searchHistory.filter(e=> e !== query )
      )))
    .map(searchHistory=>
      searchHistory.map(e=>({query:e})))

  const press$ = RN
    .select('search')
    .events('press')

  const changeFilter$ = RN
    .select('search')
    .events('changeFilter')
    .distinctUntilChanged()
    //.do(e=>console.log(e))
    //.subscribe()

  const page$ =
    changeQuery$
      .startWith("")
  // reset
  // https://stackoverflow.com/questions/31434606/rxjs-make-counter-with-reset-stateless
      .switchMap((query)=>{
        //console.log(query)
        return RN.select('search')
                 .events('endReached')
                 .startWith(1)
                 .scan((page)=>page+1)
                 .map((page)=>({query,page}))
      })

  const requestSearchedBooks$ =
    page$
      .skip(1)
      .map(({query,page})=>{
        //console.log(query,page)
        return {
          category: 'search',
          url: RAKUTEN_SEARCH_API + encodeURI(query) +
               "&page=" + page,
          headers: { 'Content-Type':
                     'application/json; charset=utf-8' },
          accept: 'Accept-Language:ja,en-US;q=0.8,en;q=0.6'
        }
      })
      .share()

  function itemsToBook(items){
    return items
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
  }

  const searchedBooksResponse$ =
    changeQuery$.startWith("")
                .do(e=>console.log(e))
                .switchMap((e)=>{
                  return HTTP
                    .select('search')
                    .map(stream=>
                      stream.retryWhen(errors=>errors.delay(1000)))
                    .mergeAll()
                    .do(e=>console.log(e))
                    .map(res => res.body)
                    .map(body =>
                      itemsToBook(body.Items))
                    .do((e)=>console.log(e))
                  // pagination
                  // https://gitter.im/cyclejs/cyclejs/archives/2016/03/30
                    .startWith([])
                    .scan((currentBooks,newBooks) => (
                      currentBooks.concat(newBooks)))
                })
                .share();

  function createBooksStatusStream(books$, category) {
    const requestStatus$ =
      books$
        .map(books => books.map(book => book.isbn))
        .filter(isbns => isbns.length > 0)
        //.do((e)=>console.log(e))
        .map(q => ({
          category,
          url: CALIL_STATUS_API + encodeURI(q)
        }))
        .shareReplay();

    const booksStatusResponse$ =
      HTTP.select(category)
    // should handle as meta stream because of retry
    //switchMap?
          .map(stream =>
            stream.map(res => res.body)
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
          )
          .switch()
          .map(result => result.books)
    /* .do((e)=>console.log(Object.keys(e).map((isbn)=>
     *   e[isbn][LIBRARY_ID].status)))*/
          .map((bookStatuses)=>
            Object.keys(bookStatuses)
                  .reduce((acc,isbn)=>{
                    let {libkey, reserveurl, status} =
                      bookStatuses[isbn][LIBRARY_ID]
                    libkey = libkey || {}
                    //{xxxx.Tokyo_Fuchu.{libkey,reserveUrl,status}}
                    if(status === "Running"){
                      s="Loading"
                    }else if(Object.keys(libkey).length === 0){
                      s="noCollection"
                    }else if(_.values(libkey)
                              .some(i => i === '貸出可')){
                      s="rentable"
                    }else{
                      s="onLoan"
                    }
                    acc[isbn]={
                      reserveUrl: reserveurl,
                      status: s
                    }
                    return acc
                  },{})
          )
          .distinctUntilChanged((i,j) =>
            JSON.stringify(i)==JSON.stringify(j))
          .shareReplay();

    return ({
      booksStatus$:booksStatusResponse$,
      requestStatus$ });
  }

  const { booksStatus$: searchedBooksStatus$,
          requestStatus$: requestSearchedBooksStatus$ } =
            createBooksStatusStream(
              searchedBooksResponse$,
              'searchedBooksStatus');

  const request$ = Rx.Observable
                     .merge(requestSearchedBooks$,
                            requestSearchedBooksStatus$);

  return {
    searchHistory$,
    requestSearchedBooks$,
    searchedBooksResponse$,
    searchedBooksStatus$,
    changeFilter$,
    request$,
  };
}
function model(actions) {
  const searchedBooks$ =
    actions.searchedBooksResponse$
           //.merge(actions.requestSearchedBooks$.map(_=>[]))
           .distinctUntilChanged()

  const booksLoadingState$ =
    actions.requestSearchedBooks$
           .map(_ => true)
           .merge(actions.searchedBooksResponse$.map(_ => false))
           .distinctUntilChanged()
           .shareReplay();

  const state$ = Rx
    .Observable
    .combineLatest(
      actions.searchHistory$.do(e=>console.log(e)),
      searchedBooks$.startWith([]),
      actions.searchedBooksStatus$.startWith({}),
      booksLoadingState$.startWith(false),
      actions.changeFilter$.startWith(0),
      (searchHistory, searchedBooks, searchedBooksStatus, booksLoadingState,
       selectedIndex ) =>
         ({ searchHistory, searchedBooks, searchedBooksStatus, booksLoadingState,
            selectedIndex }));
  return state$;
}
module.exports = { intent, model }
