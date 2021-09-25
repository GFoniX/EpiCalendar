import { readFile, writeFile } from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { createInterface } from "readline";
import { promisify } from "util";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

export async function connectGoogleCalendar(
  callback: (auth: OAuth2Client) => Promise<void>
): Promise<void> {
  return await promisify(readFile)("credentials.json")
    .then(async (content) => {
      return await authorize(JSON.parse(content.toString()), callback).catch(
        (reason) => {
          throw reason;
        }
      );
    })
    .catch((err) => {
      throw "Error loading client secret file: " + err;
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(
  credentials: any,
  callback: (auth: OAuth2Client) => Promise<void>
): Promise<void> {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  // Check if we have previously stored a token.
  return await promisify(readFile)(TOKEN_PATH)
    .then(async (token) => {
      oAuth2Client.setCredentials(JSON.parse(token.toString()));

      if (
        JSON.parse(token.toString()).expiry_date >
        new Date().setDate(new Date().getDate() + 3)
      )
        return getTokenWithRefresh(oAuth2Client);

      return await callback(oAuth2Client);
    })
    .catch(async (err) => {
      return await getAccessToken(oAuth2Client)
        .then((value: any) => value)
        .catch((reason) => {
          throw reason;
        });
    });
}

export function getTokenWithRefresh(oAuth2Client: OAuth2Client): void {
  oAuth2Client.refreshAccessToken(async (err: any, token: any) => {
    if (err) throw err.response.data;

    return await promisify(writeFile)(TOKEN_PATH, JSON.stringify(token))
      .then(() => {
        console.log("Token stored to", TOKEN_PATH);
      })
      .catch(() => {
        throw err;
      });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client: OAuth2Client): Promise<any> {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code: any) => {
      rl.close();
      oAuth2Client.getToken(code, async (err: any, token: any) => {
        if (err) return reject("Error retrieving access token " + err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        return await promisify(writeFile)(TOKEN_PATH, JSON.stringify(token))
          .then(() => {
            console.log("Token stored to", TOKEN_PATH);
          })
          .catch(() => {
            throw err;
          });
      });
    });
  });
}
