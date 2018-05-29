import {
  fromEvent as fromEventObserable,
  fromPromise as fromPromiseObserable
} from "rxjs";
import {
  pluck,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  flatMap,
  tap,
  map,
  switchMap
} from "rxjs/operators";

const input = document.querySelector("#input");
const results = document.querySelector("#results");

const keyups = fromEventObserable(input, "keyup").pipe(
  pluck("target", "value"),
  filter(text => text.length > 2),
  debounceTime(500),
  distinctUntilChanged()
);

keyups.subscribe(val => {
  console.log("input", val);
});

let searchWiki = term => {
  return fetch(
    `https://en.wikipedia.org/w/api.php?action=opensearch&fromat=json&origin=*&search=${term}`,
    {
      mathod: "POST",
      headers: new Headers({ "Api-User-Agent": "RXJS-Example/1.0" })
    }
  );
};

const suggestions = keyups.pipe(
  flatMap(searchWiki),
  switchMap(res => res.json())
);

suggestions.subscribe(
  data => {
    results.innerHTML = `<li><a href="${data[3][0]}">${data[1][0]}</a></li>`;
  },
  error => {
    results.innerHTML = `Error ${error}`;
  }
);
