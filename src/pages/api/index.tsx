import { NextApiRequest, NextApiResponse } from "next";
import conn from "../../app/db";
import { AxiosError } from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    try {
        const current_date = new Date().toUTCString();
        const query = "INSERT INTO users(first_name, last_name, email, password, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $5)"
        const values = [req.body.firstName, req.body.lastName, req.body.email, req.body.password, current_date]
        const result = await conn.query(query, values);
        return res.status(200).json({message: result.oid})
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return res.status(400).json({message: error.message});    
        }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
};