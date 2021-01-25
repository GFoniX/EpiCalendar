EpiCalendar
===

Build
---

You'll need the following dependencies:

- npm
-nodejs

First of all, follow the installation steps, for Ubuntu:

```bash
# to install nodejs and npm
sudo apt-get install nodejs npm
```

Go on `https://console.developers.google.com/` then click on `Create a project`

When you're project is create click on `Activate Services`

Then search `Google Calendar API` and activate it.

Click on `Create identifiers`
On which API select `Google Calendar API`
And which platform `Application with user (Window...)`
Check `User data` and next.

If they ask you to create OAuthId say `Yes`
And in acces level check `.../auth/calendar`

And download the client_id.json and place it in the root of this directory and rename it `credentials.json`

In `src/config.ts` past you're Epitech token in token
(You can find it in `https://intra.epitech.eu/admin/autolog`)

Run `npm install` to install all dependencies
```bash
npm install
```

Finally, execute with `npm run start`:

```bash
npm run start
```

### Configuration

There is a configuration files in `src/config.ts`

`token` you're Epitech token

`refreshTime` the refresh time of the EpiCalendar

`sendInvitationLink` when you have a group project send a link to you're partner to join you're event

`epitechEmail` only usefull when sendInvitationLink is true. For avoir to send you an invitation link on you're email.
