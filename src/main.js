import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import Snabbdom from 'snabbdom-pragma';
import {
  add,
  getHours,
  getMinutes,
  getSeconds,
  format,
} from 'date-fns';

const TIME_FORMAT = 'H:m';
const formatTime = t => format(t, TIME_FORMAT);

const date = new Date();

const timeNow$ = xs.periodic(1000)
  .map(t => add(date, { seconds: t }));

const midnight$ = timeNow$ 
  .filter(t => [getHours, getMinutes, getSeconds].every(f => f(t) === 0))
  .map(t => ({
    fajir: formatTime(add(t, { hours: 4 })),
    duhr: formatTime(add(t, { hours: 13 })),
    asr: formatTime(add(t, { hours: 17 })),
    maghrib: formatTime(add(t, { hours: 21 })),
    isha: formatTime(add(t, { hours: 23 })),
  }))
  .startWith({
    fajir: formatTime(add(date, { hours: 4 })),
    duhr: formatTime(add(date, { hours: 13 })),
    asr: formatTime(add(date, { hours: 17 })),
    maghrib: formatTime(add(date, { hours: 21 })),
    isha: formatTime(add(date, { hours: 23 })),
  });

const drivers = {
  DOM: makeDOMDriver("#root"),
};
function main(sources) {
  const sinks = {
    DOM: xs.combine(timeNow$, midnight$)
      .map(([timeNow, {fajir, duhr, asr, maghrib, isha}]) =>
        <div>
          <h3>{timeNow}</h3>
          <table>
            <thead>
              <tr>
                <th>Prayer</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
             <tr>
               <td>Fajir</td>
               <td>{fajir}</td>
             </tr>
             <tr>
               <td>Duhr</td>
               <td>{duhr}</td>
             </tr>
             <tr>
               <td>Asr</td>
               <td>{asr}</td>
             </tr>
             <tr>
               <td>Maghrib</td>
               <td>{maghrib}</td>
             </tr>
             <tr>
               <td>Isha</td>
               <td>{isha}</td>
             </tr>
            </tbody>
          </table>
        </div>
      )
  };
  return sinks;
}

run(main, drivers);
