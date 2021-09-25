import { calendar_v3 } from 'googleapis';

export function addCalendar(calendar: calendar_v3.Calendar, calendarName: string) {
    console.log(`Calendar not found. Add new calendar ${calendarName}`)
    return new Promise(async (resolve, reject) => {
        calendar.calendars.insert({
            requestBody: {
                'summary': calendarName,
                'timeZone': 'Europe/Paris',
            }
        }, (err, res) => {
            if (err) console.error("Failed create new calendar:", err);
            resolve(true);
        });
    });
}

export function addEventCalendar(calendar: calendar_v3.Calendar, EpiCalendar: calendar_v3.Schema$Calendar | undefined, Schedule: calendar_v3.Schema$Event) {
    return new Promise(async (resolve, reject) => {
        calendar.events.insert({
            calendarId: EpiCalendar?.id?.toString(),
            requestBody: Schedule,
        }, function (err, event) {
            if (err)
                return console.error('There was an error contacting the Calendar service: ' + err);
            console.log(`Succefully insert "${Schedule.summary}" event`);
            resolve(true);
        });
    });
}

export function removeEventCalendar(calendar: calendar_v3.Calendar, EpiCalendar: calendar_v3.Schema$Calendar | undefined, item: calendar_v3.Schema$Event) {
    return new Promise(async (resolve, reject) => {
        calendar.events.delete({
            calendarId: EpiCalendar?.id?.toString(),
            eventId: item.id?.toString()
        }, (err, res) => {
            if (err)
                return console.error('There was an error while delete the event: ' + err);
            console.log(`Succefully remove "${item.summary}"`);
            resolve(true);
        });
    });
}

export function eventIsInList(event: calendar_v3.Schema$Event, eventList: calendar_v3.Schema$Event[]): boolean {
    if (eventList.find(x => (x.summary == event.summary
        && x.start?.dateTime?.split('+')[0] == event.start?.dateTime?.split('+')[0]
        && x.end?.dateTime?.split('+')[0] == event.end?.dateTime?.split('+')[0])))
        return true;
    return false;
}