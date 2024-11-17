import dotenv from 'dotenv';
dotenv.config();

class SheetDBService {
    constructor() {
        this.SHEETDB_API_URL = process.env.SHEETDB_API_URL || '';
    }

    async fetchAllUsers() {
        try {
            const response = await fetch(this.SHEETDB_API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch data from sheetdb');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching data from sheetdb:', error);

            throw error;
        }
    }

    async updateUserPoints(nickname, points) {

        try {
            const response = await fetch(`${this.SHEETDB_API_URL}/Name/${encodeURIComponent(nickname)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Points: points }),
            });
        } catch (error) {
            console.error('Error updating user points in sheetdb:', error);

            throw error;
        }
    }
}

export default SheetDBService;
