import { calendar_v3, google } from "googleapis";
import { getEpitechCalendar } from "./Epitech";
import { connectGoogleCalendar } from "./Google";
import { json } from "./config";
import { sleep } from "./Tools";
import {
  addCalendar,
  addEventCalendar,
  removeEventCalendar,
  eventIsInList,
} from "./Calendar";

async function refreshEpiEventCalendar(
  calendar: calendar_v3.Calendar,
  result: calendar_v3.Schema$CalendarList | undefined
) {
  return new Promise(async (resolve, reject) => {
    var EpiCalendar: calendar_v3.Schema$Calendar | undefined =
      result?.items?.find((x) => x.summary == "EpiEvent");
    if (!EpiCalendar) return resolve(await addCalendar(calendar, "EpiEvent")); // Add epitech Calendar
    calendar.events.list(
      {
        calendarId: EpiCalendar.id?.toString(),
        timeMin: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
        timeMax:
          new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0] + "T00:00:00.000Z",
        singleEvents: true,
        orderBy: "startTime",
      },
      async (err, res) => {
        if (err) return reject("The API returned an error: " + err);

        var items: calendar_v3.Schema$Event[] = [];
        if (res?.data.items) items = res.data.items;

        var ScheduleCalendars: calendar_v3.Schema$Event[] | undefined | void =
          await getEpitechCalendar().catch((error) => resolve(error));
        if (!ScheduleCalendars) return;

        for (var Schedule of ScheduleCalendars) {
          if (eventIsInList(Schedule, items)) continue;

          await addEventCalendar(calendar, EpiCalendar, Schedule);
          await sleep(1000);
        }

        for (var item of items) {
          if (eventIsInList(item, ScheduleCalendars)) continue;

          await removeEventCalendar(calendar, EpiCalendar, item);
          await sleep(1000);
        }
        resolve(true);
      }
    );
  });
}

async function refreshEpitechCalendar(auth: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const calendar: calendar_v3.Calendar = google.calendar({
      version: "v3",
      auth,
    });
    calendar.calendarList.list({}, async (err: any, result) => {
      if (err) reject(err.response.data);
      await refreshEpiEventCalendar(calendar, result?.data).catch((reason) =>
        reject(reason)
      );
      resolve(true);
    });
  });
}

async function startup() {
  try {
    await connectGoogleCalendar(refreshEpitechCalendar);
  } catch (e) {
    console.error(e);
  }
  await sleep(json.refreshTime);
  startup();
}

startup();

// // getEpitechCourses();

// async function test() {
//   try {
//     console.log(
//       await connectGoogleCalendar(async () => {
//         console.log("Finish");
//         return;
//       })
//     );
//   } catch (e) {
//     console.log(e);
//   }
// }

// test();
