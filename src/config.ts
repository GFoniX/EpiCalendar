import { config } from "dotenv";

config();

export var json = {
  /* Epitech API key */
  token: process.env.TOKEN || "auth-14jan78076e6fb139498149e2bcef03a75c6b12",

  /* Refresh time in ms */
  refreshTime:
    process.env.refreshTime != null ? parseInt(process.env.refreshTime) : 60000,

  /* Send invitation link to teammate */
  sendInvitationLink: process.env.sendInvitationLink || true,

  /* You're epitech email (useless if sendInvitationLink is false)*/
  epitechEmail: process.env.epitechEmail || "alexandre.titeux@epitech.eu",
};
