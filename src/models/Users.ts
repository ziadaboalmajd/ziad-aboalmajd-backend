import pool from '../database';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { QueryResult } from 'pg';
import dotenv from 'dotenv';
import bcrypt, { genSalt } from 'bcrypt';
import { User, NewUser, authUser, tokenUser, Comment, Upass } from '../types/User';

const pepper: string = process.env.BCRYPT_PASSWORD as string;

dotenv.config();

export class userStore {

    async createUser(user: User): Promise<Response> {
        try {
            //Check emptyness of the incoming data
            if ((!user.name || !user.password || !user.email) || (user.name.length <= 3 || user.password.length <= 6 || user.email.length <= 6)) {
                return { "login": false, "message": 'Please enter all the details' } as any
            }
            //Check if the user already exist or not
            const userExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = '${user.name.replace(/^\s+|\s+$/gm, '')}');`);
            if (userExist.rows[0].exists === true) {
                return { "login": false, "message": 'this username already exists' } as any
            }
            //Check if the email already exist or not
            const emailExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE email = '${user.email.replace(/\s/g, "")}');`);
            if (emailExist.rows[0].exists === true) {
                return { "login": false, "message": 'this email already exists' } as any
            }
            //Bcrybt password and token
            const saltRound = process.env.SALT_ROUNDS as string;
            const salt = await bcrypt.genSalt(Number(saltRound));
            const passwordHashed = bcrypt.hashSync(user.password + pepper, parseInt(salt));
            const response = await pool.query('INSERT INTO users (name, email, token) VALUES ($1, $2, $3)', [user.name.replace(/^\s+|\s+$/gm, ''), user.email.replace(/\s/g, ""), passwordHashed]);
            return { "login": true, "message": 'sign up Successfully' } as any
        } catch (err: any) {
            return err + user;
        }
    };

    async authenticate(user: authUser): Promise<Response> {
        try {
            //Check emptyness of the incoming data
            if ((!user.name || !user.password) || (user.name.length <= 3 || user.password.length <= 6)) {
                return { "login": false, "message": 'Please enter all the details' } as any
            }
            //Check if the user already exist or not
            const userExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = '${user.name}');`);
            if (userExist.rows[0].exists === false) {
                return { "login": false, "message": 'Wrong username' } as any
            }
            // check if password is correct
            const response: QueryResult = await pool.query(`SELECT id, name, token FROM users WHERE name = '${user.name}';`);
            const logPass = response.rows[0].token;
            const isPasswordMatched = bcrypt.compareSync(String(user.password) + pepper, logPass)
            if (!isPasswordMatched) {
                return { "login": false, "message": 'Wrong password' } as any
            }
            return { "login": true, "message": 'login successfully' } as any
        } catch (error) {
            return error as any;
        }
    };

    async verifyAuthToken(user: tokenUser, decoded: JwtPayload): Promise<Response> {
        try {
            // check if password is correct
            const response: QueryResult = await pool.query(`SELECT id, name, token FROM users WHERE name = '${user.username}';`);
            const logPass = response.rows[0].token;
            const isPasswordMatched = bcrypt.compareSync(String(decoded) + pepper, logPass)
            if (!isPasswordMatched) {
                return { "login": false } as any
            }
            return { "login": true } as any
        } catch (error) {
            return error as any;
        }
    };


    async updatePass(user: Upass): Promise<Response> {
        try {

            //Check emptyness of the incoming data
            if ((!user.pass || !user.cpass || !user.name) || (user.pass.length <= 5 || user.cpass.length <= 5 || user.name.length <= 3)) {
                return 'Please enter all the new details' as any;
            }
            //Bcrybt password and token
            const saltRound = process.env.SALT_ROUNDS as string;
            const salt = await bcrypt.genSalt(Number(saltRound));
            const passwordHashed = bcrypt.hashSync(user.pass + pepper, parseInt(salt));
            const response = await pool.query('UPDATE users SET  token = $1 WHERE name = $2', [
                passwordHashed,
                user.name,
            ]);
            return { "login": true, "message": 'password reset successfully' } as any
        } catch (error) {
            return error as any;
        }
    };

    async postComment(user: Comment): Promise<Response> {
        try {
            //Check emptyness of the incoming data
            if ((!user.name || !user.value || !user.time) || (user.name.length <= 3 || user.value.length <= 6 || user.time.length <= 5)) {
                return { "message": 'Please enter all the details' } as any
            }
            const response = await pool.query('INSERT INTO comments (name, value, time) VALUES ($1, $2, $3)', [user.name.replace(/^\s+|\s+$/gm, ''), user.value, user.time]);
            return { "message": 'comment is Successfully posted' } as any
        } catch (err: any) {
            return err + user;
        }
    };

    async deleteComment(user: Comment): Promise<Response> {
        try {
            if (!user.id || user.id.toString().length === 0) {
                return { delete: false } as any
            }
            const response = await pool.query('DELETE FROM comments where id = $1', [Number(user.id)]);
            return { delete: true } as any
        } catch (err: any) {
            return err + user;
        }
    };

    async getComment(): Promise<Response> {
        try {
            const response: QueryResult = await
                pool.query('SELECT * FROM comments ORDER BY id ASC');
            return response.rows as any;

        } catch (err: any) {
            return err;
        }
    }

    async getUsername(email: string): Promise<Response> {
        try {
            const userExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE email = '${email.replace(/\s/g, "")}');`);
            if (userExist.rows[0].exists === false) {
                return { exists: false } as any
            }
            const response: QueryResult = await pool.query(`SELECT name FROM users WHERE email = '${email}';`);
            return { exists: true, response: response.rows } as any
        } catch (err: any) {
            return err;
        }
    }
}    