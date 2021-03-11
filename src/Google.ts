import * as fs from 'fs';
const readline = require('readline');
import { google } from 'googleapis';
import { sleep } from './Tools';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

export function connectGoogleCalendar(callback: any): Promise<any> {
    return new Promise((resolve, reject) => {
        /* appel à la fonction asynchrone */
        fs.readFile('credentials.json', async (err, content) => {
            if (err) return reject('Error loading client secret file: ' + err);
            // Authorize a client with credentials, then call the Google Calendar API.
            authorize(JSON.parse(content.toString()), callback).then((value) => resolve(value)).catch((reason) => reject(reason));
        });
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: any, callback: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);


        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, async (err, token) => {
            if (err) return getAccessToken(oAuth2Client).then((value: any) => resolve(value)).catch((reason) => reject(reason));
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
            resolve(callback(oAuth2Client));
        });
    });
}

export function getTokenWithRefresh(oAuth2Client: any) {
    console.log("Refresh Token");
    return new Promise((resolve, reject) => {
        oAuth2Client.refreshAccessToken((err: any, token: any) => {
            if (err) return reject(err.response.data);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return reject(err);
                console.log('Token stored to', TOKEN_PATH);
                resolve(true);
            });
        })
    });

}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code: any) => {
            rl.close();
            oAuth2Client.getToken(code, (err: any, token: any) => {
                if (err) return reject('Error retrieving access token ' + err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return reject(err);
                    console.log('Token stored to', TOKEN_PATH);
                    resolve(true);
                });
            });
        });
    });
}