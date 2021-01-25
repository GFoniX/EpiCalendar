import { calendar_v3, google } from 'googleapis';
import { exit } from 'process';
import { getEpitechCalendar } from './Epitech';
import { connectGoogleCalendar } from './Google';

function addCalendar(calendar: calendar_v3.Calendar) {
    console.log("Calendar not found. Add new calendar Epitech")
    calendar.calendars.insert({
        requestBody: {
            'summary': 'Epitech',
            'timeZone': 'Europe/Paris',
        }
    }, (err, res) => {
        if (err) console.error("Failed create new calendar:", err);
    });
}

function addEventCalendar(calendar: calendar_v3.Calendar, EpiCalendar: calendar_v3.Schema$Calendar | undefined, Schedule: calendar_v3.Schema$Event) {
    calendar.events.insert({
        calendarId: EpiCalendar?.id?.toString(),
        requestBody: Schedule,
    }, function (err, event) {
        if (err)
            return console.error('There was an error contacting the Calendar service: ' + err);
        console.log(`Succefully insert "${Schedule.summary}" event`);
    });
}

function removeEventCalendar(calendar: calendar_v3.Calendar, EpiCalendar: calendar_v3.Schema$Calendar | undefined, item: calendar_v3.Schema$Event) {
    calendar.events.delete({
        calendarId: EpiCalendar?.id?.toString(),
        eventId: item.id?.toString()
    }, (err, res) => {
        if (err)
            return console.error('There was an error while delete the event: ' + err);
        console.log(`Succefully remove "${item.summary}"`);
    });
}

function eventIsInList(event: calendar_v3.Schema$Event, eventList: calendar_v3.Schema$Event[]): boolean {
    if (eventList.find(x => (x.summary == event.summary
        && x.start?.dateTime?.split('+')[0] == event.start?.dateTime?.split('+')[0]
        && x.end?.dateTime?.split('+')[0] == event.end?.dateTime?.split('+')[0])))
        return true;
    return false;
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function refreshEpitechCalendar(auth: any) {
    const calendar: calendar_v3.Calendar = google.calendar({ version: 'v3', auth });

    calendar.calendarList.list({}, (err, result) => {
        if (!result?.data.items) return;

        var EpiCalendar: calendar_v3.Schema$Calendar | undefined = result.data.items.find(x => x.summary == "Epitech");
        if (!EpiCalendar) return addCalendar(calendar); // Add epitech Calendar

        calendar.events.list({
            calendarId: EpiCalendar.id?.toString(),
            timeMin: (new Date()).toISOString().split('T')[0] + 'T00:00:00.000Z',
            timeMax: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00.000Z',
            singleEvents: true,
            orderBy: 'startTime',
        }, async (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            
            var items: calendar_v3.Schema$Event[] = [];
            if (res?.data.items) items = res.data.items;

            var ScheduleCalendars: calendar_v3.Schema$Event[] | undefined = await getEpitechCalendar();
            if (!ScheduleCalendars) ScheduleCalendars = [];

            for (var Schedule of ScheduleCalendars) {
                if (eventIsInList(Schedule, items))
                    continue;

                addEventCalendar(calendar, EpiCalendar, Schedule);
                await sleep(1000);
            }

            for (var item of items) {
                if (eventIsInList(item, ScheduleCalendars))
                    continue;

                removeEventCalendar(calendar, EpiCalendar, item);
                await sleep(1000);
            }
        });
    });
}

connectGoogleCalendar(refreshEpitechCalendar);