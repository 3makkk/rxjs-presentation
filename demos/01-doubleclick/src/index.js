import { fromEvent as fromEventObserable } from "rxjs";
import {
  throttle,
  buffer,
  throttleTime,
  debounceTime,
  filter,
  tap
} from "rxjs/operators";

const keypressObs = fromEventObserable(document, "keypress");

keypressObs
  .pipe(
    buffer(keypressObs.pipe(debounceTime(250))),
    filter(keyEvents => keyEvents.length === 2)
  )
  .subscribe(event => {
    console.log("Key pressed", event);
  });
