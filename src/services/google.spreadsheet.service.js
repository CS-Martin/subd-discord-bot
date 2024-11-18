import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export default class GoogleSpreadsheetService {
    sheets;

    constructor() {
        const auth = new google.auth.GoogleAuth({
            keyFile: 'cred.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth });
    }

    async readSheet(spreadsheetId, range) {

        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

            if (!response.data.values) {
                console.log('No data found in the specified range.');
                return [];
            }

            console.log('Data fetched from sheet:', response.data.values);
            return response.data.values;
        } catch (error) {
            console.error('Error fetching data from sheet:', error);
        }

    }


    async updateSheet(spreadsheetId, range, values) {

        try {
            await this.sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                resource: { values },
            });
        } catch (error) {
            console.error('Error updating data in sheet:', error);
        }
    }
}
