import Rx from "rxjs/Rx";
import _ from "lodash";

import { InteractionManager, AsyncStorage } from "react-native";

function intent(RN, HTTP, AS) {
  // Actions
  const location$ = RN.select("location")
    .events("location")
    .map(({ coords, timestamp }) => ({
      geocode: coords.longitude + "," + coords.latitude,
      //geocode:136.7163027+","+35.390516,
      limit: 10,
    }))
    .share();

  const pref$ = RN.select("pref")
    .events("press")
    .map(e => ({ pref: e }))
    .share();

  const requestLibrary$ = pref$
    .merge(location$)
    .map(query => {
      //console.log(query,page)
      return {
        category: "libraries",
        //https://github.com/visionmedia/superagent/issues/675
        //url: "http://api.calil.jp/library?callback=no&appkey=bc3d19b6abbd0af9a59d97fe8b22660f&format=json&pref=" + encodeURI(pref),
        //CALIL_STATUS_API=`http://api.calil.jp/check?callback=no&appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=${LIBRARY_ID}&format=json&isbn=`;
        url: "http://api.calil.jp/library?",
        query: {
          ...query,
          appkey: "bc3d19b6abbd0af9a59d97fe8b22660f",
          format: "json",
        },
      };
    })
    .do(e => console.log("req", e))
    .shareReplay();

  const screen$ = pref$
    .map(e => ["LibrarySelect"])
    .do(e => console.log("screen", e));
  //onPress={e=>navigate("LibrarySelect",{pref:e})}

  const library$ = AS.first()
    .map(e => (e && e.library) || "")
    .merge(RN.select("libraries").events("press"))
    .do(e => console.log("lib", e))
    .shareReplay();

  const libraries$ = HTTP.select("libraries")
    .switch()
    .map(res => res.text)
    .map(e => e.slice(9, -2)) //callback(body);
    .map(e => JSON.parse(e))
    .map(a =>
      Object.values(
        a
          .map(({ systemid, systemname, formal }) => ({
            systemid,
            systemname,
            formal,
          }))
          .reduce((acc, { systemid, systemname, formal }) => {
            //console.log(acc[systemid])
            if (!acc[systemid]) {
              acc[systemid] = { systemid, systemname, formal: [formal] };
            } else {
              acc[systemid].formal.push(formal);
            }
            return acc;
          }, {}),
      ),
    );

  const changeText$ = RN.select("search")
    .events("changeText")
    .shareReplay();

  const submitText$ = RN.select("search")
    .events("submitEditing")
    .withLatestFrom(changeText$)
    .map(([submitEvent, lastQuery]) => lastQuery)
    .filter(query => query.length > 1)
    .do(e => console.log("submitText$", e))
    .shareReplay();

  const changeQuery$ = submitText$
    .startWith("")
    .switchMap(query => changeText$.debounceTime(500))
    .filter(query => query.length > 1)
    //.distinctUntilChanged()
    .do(q => console.log("cq", q))
    .shareReplay();

  const searchHistory$ = AS.first()
    .map(e => (e && e.searchHistory) || [])
    .merge(submitText$.map(query => [query]))
    .scan((searchHistory, query) =>
      query.concat(searchHistory.filter(e => e !== query[0])),
    )
    .shareReplay();

  const storage$ = Rx.Observable.combineLatest(
    searchHistory$,
    library$,
    (searchHistory, library) => ({ searchHistory, library }),
  ).do(e => console.log("strage", e));

  const press$ = RN.select("search").events("press");

  const changeFilter$ = RN.select("search")
    .events("changeFilter")
    .distinctUntilChanged();
  //.do(e=>console.log(e))
  //.subscribe()

  const page$ = changeQuery$
    .startWith("")
    .switchMap(query => {
      // reset page
      // https://stackoverflow.com/questions/31434606/rxjs-make-counter-with-reset-stateless
      return RN.select("search")
        .events("endReached")
        .startWith(1)
        .scan(page => page + 1)
        .map(page => ({ query, page }));
    })
    .skip(1);

  //const RAKUTEN_SEARCH_API = 'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?';
  //'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?format=json&booksGenreId=001&applicationId=1088506385229803383&formatVersion=2&keyword=';
  //'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&keyword=%E3%81%B2%E3%81%BF%E3%81%A4%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA&applicationId=7efe699a2de87000308287110442da41'
  const requestSearchedBooks$ = page$
    .map(({ query, page }) => {
      return {
        category: "search",
        url:
          "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?",
        //url: RAKUTEN_SEARCH_API
        //url: 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?',
        query: {
          format: "json",
          applicationId: "1088506385229803383",
          keyword: query,
          formatVersion: "2",
          outOfStockFlag: "1",
          field: "0",
          //elements:["title", "author", "isbn", "largeImageUrl"]
          page,
        },
        headers: { "Content-Type": "application/json; charset=utf-8" },
        accept: "Accept-Language:ja,en-US;q=0.8,en;q=0.6",
      };
    })
    .share();

  function itemsToBook(items) {
    return (
      items
        .filter(book => book.isbn)
        // reject non book
        .filter(
          book => book.isbn.startsWith("978") || book.isbn.startsWith("979"),
        )
        .map(({ title, author, isbn, largeImageUrl }) => ({
          title: title.replace(/^【バーゲン本】/, ""),
          author,
          isbn,
          thumbnail: largeImageUrl,
        }))
    );
  }

  const searchedBooksResponse$ = HTTP.select("search")
    .map(stream => stream.retryWhen(errors => errors.delay(1000)))
    .switch()
    //TODO:switch is for not to append result to other query. possible to drop response?
    //.mergeAll()
    .map(res => res.body)
    .do(e => console.log(e))
    .map(body => itemsToBook(body.Items))
    .do(e => console.log(e))
    .share();
  //Do not replay in order to cancel in SearchBooks$

  const searchedBooks$ = changeQuery$
    .startWith("")
    .switchMap(e => {
      return (
        searchedBooksResponse$
          .startWith([])
          //.startWith([])
          .scan((currentBooks, newBooks) => {
            isbns = currentBooks.map(book => book.isbn);
            return currentBooks.concat(
              newBooks.filter(newBook => isbns.indexOf(newBook.isbn) == -1),
            );
          })
      );
    })
    .distinctUntilChanged()
    .share();

  const requestSearchedBooksStatus$ = searchedBooks$
    .map(books => books.map(book => book.isbn))
    //.map([books,isbns] => books.map(book => book.isbn))
    .filter(isbns => isbns.length > 0)
    .combineLatest(library$, (isbn, library) => ({
      category: "searchedBooksStatus",
      //const CALIL_STATUS_API = `http://api.calil.jp/check?callback=no&appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=${LIBRARY_ID}&format=json&isbn=`;
      url: "http://api.calil.jp/check?",
      query: {
        callback: "no",
        appkey: "bc3d19b6abbd0af9a59d97fe8b22660f",
        systemid: library,
        format: "json",
        //isbn //cannot handle array?
        isbn: isbn.join(),
      },
      //url: CALIL_STATUS_API + encodeURI(q)
    }))
    .shareReplay();

  const searchedBooksStatus$ = HTTP.select("searchedBooksStatus")
    // should handle as meta stream because of retry
    //switchMap?
    .map(stream =>
      stream
        .map(res => res.body)
        // ok to retry but not output stream
        // .flatMap(result => result.continue === 1 ?
        //                 [result, Observable.throw(error)] : [result])
        .flatMap(result => [{ ...result, continue: 0 }, result])
        .map(result => {
          if (result.continue === 1) {
            throw result;
          }
          return result;
        })
        .retryWhen(errors => errors.delay(2000)),
    )
    .switch()
    .map(result => result.books)
    /* .do((e)=>console.log(Object.keys(e).map((isbn)=>
     *   e[isbn][LIBRARY_ID].status)))*/
    .map(bookStatuses =>
      Object.keys(bookStatuses).reduce((acc, isbn) => {
        let { libkey, reserveurl, status } = Object.values(
          bookStatuses[isbn],
        )[0];
        libkey = libkey || {};
        //{xxxx.Tokyo_Fuchu.{libkey,reserveUrl,status}}
        if (status === "Running") {
          s = "Loading";
        } else if (Object.keys(libkey).length === 0) {
          s = "noCollection";
        } else if (_.values(libkey).some(i => i === "貸出可")) {
          s = "rentable";
        } else {
          s = "onLoan";
        }
        acc[isbn] = {
          reserveUrl: reserveurl,
          status: s,
        };
        return acc;
      }, {}),
    )
    //.do(e=>console.log("st",e))
    .distinctUntilChanged((i, j) => JSON.stringify(i) == JSON.stringify(j))
    .shareReplay();

  const request$ = Rx.Observable.merge(
    requestSearchedBooks$,
    requestSearchedBooksStatus$,
    requestLibrary$,
  );

  return {
    location$,
    storage$,
    libraries$,
    screen$,
    pref$,
    library$,
    changeQuery$,
    searchHistory$,
    searchedBooksResponse$,
    requestSearchedBooks$,
    searchedBooks$,
    searchedBooksStatus$,
    changeFilter$,
    request$,
    changeText$,
    submitText$,
  };
}

function model(actions) {
  const searchedBooks$ = actions.searchedBooks$.merge(
    actions.changeText$.map(_ => []),
    actions.submitText$.map(_ => []),
  );

  const booksLoadingState$ = actions.changeQuery$
    .map(_ => true)
    .merge(actions.searchedBooks$.map(_ => false))
    .distinctUntilChanged()
    .shareReplay();

  const booksPagingState$ = actions.changeQuery$
    .map(_ => true)
    .merge(
      actions.searchedBooksResponse$
        .do(e => console.log("f", e.length))
        .filter(books => books.length === 0)
        .do(e => console.log(e))
        .map(_ => false),
    )
    .do(e => console.log(e));

  const state$ = Rx.Observable.combineLatest(
    actions.location$.startWith(null),
    actions.libraries$.startWith([]),
    actions.pref$.startWith(""),
    actions.screen$.startWith(["Home"]),
    actions.library$.startWith(""),
    actions.searchHistory$.map(searchHistory =>
      searchHistory.map(e => ({ query: e })),
    ),
    searchedBooks$.startWith([]),
    actions.searchedBooksStatus$.startWith({}),
    booksLoadingState$.startWith(false),
    booksPagingState$.startWith(false),
    actions.changeFilter$.startWith(0),
    (
      location,
      libraries,
      pref,
      screen,
      selectedLibrary,
      searchHistory,
      searchedBooks,
      searchedBooksStatus,
      booksLoadingState,
      booksPagingState,
      selectedIndex,
    ) => ({
      location,
      libraries,
      pref,
      screen,
      selectedLibrary,
      searchHistory,
      searchedBooks,
      searchedBooksStatus,
      booksLoadingState,
      booksPagingState,
      selectedIndex,
    }),
  );
  return state$;
}
module.exports = { intent, model };
