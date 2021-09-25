import request from 'request';
import { json } from "./config";
import { ISchedule } from './Interfaces/Epitech/ISchedule';
import { IScheduleRdv, SlotsEntity1 } from './Interfaces/Epitech/IScheduleRdv';
import { calendar_v3 } from 'googleapis';
import { ICourse } from './Interfaces/Epitech/ICourse';
import { IModule, ActivitesEntity } from './Interfaces/Epitech/IModule';
import { toJSON } from './Tools';

function getScheduleEpitech(): Promise<ISchedule[]> {
    return new Promise((resolve, reject) => {
        request(`https://intra.epitech.eu/${json.token}/planning/load?format=json&start=${new Date().toISOString().split('T')[0]}&end=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`, (error, response, body) => {
            if (error)
                reject(error);
            if (response.statusCode != 200)
                reject('statusCode: ' + response && response.statusCode + "\nbody: " + toJSON(body));
            resolve(toJSON(body));
        });
    });
}

function getCoursesEpitech(): Promise<ICourse[]> {
    return new Promise((resolve, reject) => {
        request(`https://intra.epitech.eu/${json.token}/course/filter?format=json&location%5B%5D=FR&location%5B%5D=FR%2FMAR&course%5B%5D=bachelor%2Fclassic`, (error, response, body) => {
            if (error)
                reject(error);
            if (response.statusCode != 200)
                reject('statusCode: ' + response && response.statusCode + "\nbody: " + toJSON(body));
            resolve(toJSON(body));
        });
    });
}

function getModuleCourse(course: ICourse): Promise<IModule> {
    return new Promise((resolve, reject) => {
        request(`https://intra.epitech.eu/${json.token}/module/${course.scolaryear}/${course.code}/${course.codeinstance}/?format=json`, (error, response, body) => {
            if (error)
                reject(error);
            if (response.statusCode != 200)
                console.log('statusCode: ' + response && response.statusCode + "\nbody: " + toJSON(body));
            resolve(toJSON(body));
        });
    });
}

function getInfosScheduleRdv(Schedule: ISchedule): Promise<SlotsEntity1 | undefined> {
    return new Promise((resolve, reject) => {
        request(`https://intra.epitech.eu/${json.token}/module/${Schedule.scolaryear}/${Schedule.codemodule}/${Schedule.codeinstance}/${Schedule.codeacti}/rdv/?format=json`, (error, response, body) => {
            if (error)
               reject(error);
            if (response.statusCode != 200)
                reject('statusCode: ' + response && response.statusCode + "\nbody: " + JSON.parse(body));
            var json: IScheduleRdv = JSON.parse(body);
            var groupId: number | undefined = json.group?.id;
            if (json.slots && groupId)
                for (var slots of json.slots)
                    if (slots.slots)
                        for (var slot of slots.slots)
                            if (slot.id_team == groupId.toString())
                                resolve(slot);
            resolve(undefined);
        });
    });
}

// "event": {
//     "1": {
//      "background": "#a4bdfc",
//      "foreground": "#1d1d1d"
//     },
//     "2": {
//      "background": "#7ae7bf",
//      "foreground": "#1d1d1d"
//     },
//     "3": {
//      "background": "#dbadff",
//      "foreground": "#1d1d1d"
//     },
//     "4": {
//      "background": "#ff887c",
//      "foreground": "#1d1d1d"
//     },
//     "5": {
//      "background": "#fbd75b",
//      "foreground": "#1d1d1d"
//     },
//     "6": {
//      "background": "#ffb878",
//      "foreground": "#1d1d1d"
//     },
//     "7": {
//      "background": "#46d6db",
//      "foreground": "#1d1d1d"
//     },
//     "8": {
//      "background": "#e1e1e1",
//      "foreground": "#1d1d1d"
//     },
//     "9": {
//      "background": "#5484ed",
//      "foreground": "#1d1d1d"
//     },
//     "10": {
//      "background": "#51b749",
//      "foreground": "#1d1d1d"
//     },
//     "11": {
//      "background": "#dc2127",
//      "foreground": "#1d1d1d"
//     }
//    }
/*
    Class = "class",
    Exam = "exam",
    Other = "other",
    Proj = "proj",
    Rdv = "rdv",
    Tp = "tp",
*/

function getColorType(type: string): string {
    if (type == "exam") return "4";
    if (type == "class") return "9";
    if (type == "other") return "9";
    if (type == "proj") return "4";
    if (type == "rdv") return "6";
    if (type == "tp") return "3";
    return '1';
}

function scheduleToGoogleCalendar(Schedule: ISchedule): calendar_v3.Schema$Event {
    var SchemaEvent: calendar_v3.Schema$Event = {
        'summary': Schedule.acti_title,
        'location': Schedule.room as string,
        'description': Schedule.titlemodule,
        'colorId': getColorType(Schedule.type_code),
        'start': {
            'dateTime': Schedule.start.replace(" ", "T"),
            'timeZone': 'Europe/Paris',
        },
        'end': {
            'dateTime': Schedule.end.replace(" ", "T"),
            'timeZone': 'Europe/Paris',
        },
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'popup', 'minutes': 10 },
                { 'method': 'popup', 'minutes': 60 },
            ],
        },
    };

    if (Schedule.rdv) {
        SchemaEvent.attendees = [];
        if (Schedule.rdv.master && json.sendInvitationLink && Schedule.rdv.master.login != json.epitechEmail)
            SchemaEvent.attendees.push({ email: Schedule.rdv.master.login });

        if (Schedule.rdv.members && json.sendInvitationLink)
            for (var member of Schedule.rdv.members)
                if (member && member.login != json.epitechEmail)
                    SchemaEvent.attendees.push({ email: member.login });
        SchemaEvent.start = {
            'dateTime': Schedule.rdv.date.replace(" ", "T"),
            'timeZone': 'Europe/Paris',
        }
        SchemaEvent.end = {
            'dateTime': new Date(new Date(Schedule.rdv.date.replace(" ", "T")).getTime() + (-new Date().getTimezoneOffset() + Schedule.rdv.duration) * 60 * 1000).toISOString().split('.')[0],
            'timeZone': 'Europe/Paris',
        }
    }

    return SchemaEvent;
}

export async function getEpitechCalendar(): Promise<calendar_v3.Schema$Event[] | undefined> {
    // Get Schedule Epitech
    var Schedules: ISchedule[] = await getScheduleEpitech().catch((error) => { throw error });

    // Keep only register Schedule
    Schedules = Schedules.filter(item => (item.event_registered));

    // Filter Schedule with rdv
    var SchedulesRdv: ISchedule[] = Schedules.filter(item => (item.is_rdv == '1'));
    // Remove Schedule rdv from schedule
    Schedules = Schedules.filter(item => !SchedulesRdv?.find(x => x == item));

    // Get more infos about Schedule Rdv and replace it in the Schedule
    Schedules = Schedules.concat(((await Promise.all(SchedulesRdv.map(async function (item) {
        var temp = await getInfosScheduleRdv(item).catch((error) => { console.log("Error can't get Rdv infos") });
        if (temp != undefined) item.rdv = temp;
        return item;
    }))).filter(x => x != null) as any) as ISchedule[]);

    return Schedules.map(scheduleToGoogleCalendar);
}

export async function getEpitechCourses(): Promise<undefined> {
    // Get Courses Epitech
    var Courses: ICourse[] = await getCoursesEpitech().catch((error) => { throw error });

    // Keep only register Courses
    Courses = Courses.filter(item => (item.status == "ongoing"));

    var activities: ActivitesEntity[] = [];

    for (var course of Courses) {
        var module: IModule = await getModuleCourse(course);
        if (module.activites)
            for (var activitie of module.activites) {
                if (activitie.register === "1" && activitie.is_projet && !activitie.title?.includes("Bootstrap") && !activitie.title?.includes("Back To The Future"))
                    activities.push(activitie);
            }
    }

    console.log(activities.map(x => x.module_title + " => " + x.title));
    return undefined;
}