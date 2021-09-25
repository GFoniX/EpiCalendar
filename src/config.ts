import { env } from "process";

export var json = {
    /* Epitech API key */
    token: env.token || "auth-14jan78076e6fb139498149e2bcef03a75c6b12",


    /* Refresh time in ms */
    refreshTime: env.refreshTime || 60000,


    /* Send invitation link to teammate */
    sendInvitationLink: env.sendInvitationLink || true,

    /* You're epitech email (useless if sendInvitationLink is false)*/
    epitechEmail: env.epitechEmail || "alexandre.titeux@epitech.eu"
}