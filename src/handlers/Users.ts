import express, { Request, Response } from "express";
import { userStore } from '../models/Users';
import jwt, { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const {
    email_Pass
} = process.env;

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: any };
    }
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ziadaboalmagd092@gmail.com',
        pass: email_Pass,
    }
});

const UserStore = new userStore();

const usersRoutes = (app: express.Application) => {
    app.post('/signup/', createUser);
    app.post('/login/', authenticate);
    app.get('/login/', verifyAuthToken);
    app.post('/user/updatepass/', updatePass);
    app.get('/signout/', signout);
    app.get('/comment/', getComment);
    app.post('/comment/', postComment);
    app.post('/comment/delete', deleteComment);
    app.post('/sendmail/', sendMail);
    app.get('/rstmail/', verifyReset);
    app.post('/like/', postLike);
    app.post('/like/usr', getLike);
    app.get('/like/nusr', getNlike);
    app.post('/like/rmv', deleteLike);
    app.post('/usr/info', postUsrI);
    app.post('/usr/info/get', getUsrI);
    app.post("/ziad", ziad);
};

const ziad = async (req: Request, res: Response) => {
    try {
        res.status(200).json(req.body);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const createUser = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name.replace(/^\s+|\s+$/gm, '').toLowerCase(),
        email: req.body.email.replace(/\s/g, "").toLowerCase(),
        password: req.body.password.replace(/^\s+|\s+$/gm, '').toLowerCase()
    };
    try {
        const results = await UserStore.createUser(user);
        const resAny = (results as any);
        let token = "";
        if (resAny.login === true) {
            token = jwt.sign(user.password, process.env.JWT_KEY as string);
            req.session.user = {
                username: (user.name),
                token: token
            };
        }
        return res.status(200).json({ message: resAny.message, login: resAny.login, user: user.name });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const authenticate = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name.replace(/^\s+|\s+$/gm, '').toLowerCase(),
        password: req.body.password.replace(/^\s+|\s+$/gm, '').toLowerCase()
    };
    try {
        const results = await UserStore.authenticate(user);
        const resAny = (results as any);
        let token = "";
        if (resAny.login === true) {
            token = jwt.sign(req.body.password, process.env.JWT_KEY as string);
            req.session.user = {
                username: (user.name),
                token: token
            };
        }
        return res.status(200).json({ message: resAny.message, login: resAny.login, user: user.name });
    } catch (err) {
        res.status(400).send(err);
    }
};

const postUsrI = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name.replace(/^\s+|\s+$/gm, '').toLowerCase(),
        gen: req.body.gen,
        age: req.body.age
    };
    try {
        const results = await UserStore.postUsrI(user);
        return res.status(200).send(results);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getUsrI = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name.replace(/^\s+|\s+$/gm, '').toLowerCase()
    };
    try {
        const results = await UserStore.getUsrI(user);
        return res.status(200).json(results);
    } catch (err) {
        res.status(400).send(err);
    }
};

const verifyAuthToken = async (req: Request, res: Response) => {
    try {
        if (req.session.user && req.session.user.username && req.session.user.token) {
            const user = {
                username: req.session.user.username.replace(/^\s+|\s+$/gm, '').toLowerCase(),
                token: req.session.user.token
            };
            const authorizationHeader: string = user.token as string;
            const token = authorizationHeader;
            const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
            const results = await UserStore.verifyAuthToken(user, decoded);
            const resAny = results as any;
            if (!resAny.login) {
                return res.json({ login: false });
            }
            return res.json({ login: resAny.login, user: user.username });
        } else {
            return res.status(200).json({ message: "error", login: false });
        }
    }
    catch (err) {
        return err as any;
    }
};

const updatePass = async (req: Request, res: Response) => {
    if (req.session.user) {
        const user = {
            name: req.session.user.name,
            pass: req.body.pass,
            cpass: req.body.cpass.replace(/^\s+|\s+$/gm, '').toLowerCase(),
        };
        try {
            const results = await UserStore.updatePass(user);
            const resAny = results as any;
            return res.json({ message: resAny.message, login: resAny.login, user: user.name });
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400).send("err");
    }
};

const signout = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            delete req.session.user;
            return res.json({ login: false });
        }
        return res.json("error");
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const deleteComment = async (req: Request, res: Response) => {
    const user = {
        id: req.body.id
    };
    try {
        const results = await UserStore.deleteComment(user);
        const resAny = results as any;
        return res.json({ delete: resAny.delete });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const postComment = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name,
        value: req.body.value,
        time: req.body.time
    };
    try {
        const results = await UserStore.postComment(user);
        return res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const postLike = async (req: Request, res: Response) => {
    const user = {
        id: req.body.id,
        name: req.body.name
    };
    try {
        const results = await UserStore.postLike(user);
        return res.json(results);
    } catch (err) {
        res.status(400).json(err);
    }
};

const deleteLike = async (req: Request, res: Response) => {
    const user = {
        id: req.body.id,
    };
    try {
        const results = await UserStore.deleteLike(user.id);
        return res.json(results);
    } catch (err) {
        res.status(400).json(err);
    }
};
const getNlike = async (req: Request, res: Response) => {
    try {
        const results = await UserStore.getNlike();
        return res.json(results);
    } catch (err) {
        res.status(400).json(err);
    }
};

const getLike = async (req: Request, res: Response) => {

    try {
        const results = await UserStore.getLike(req.body.user);
        return res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const getComment = async (req: Request, res: Response) => {

    try {
        const results = await UserStore.getComment();
        return res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const sendMail = async (req: Request, res: Response) => {
    const email = req.body.to.replace(/\s/g, "").toLowerCase();
    const resCode = Math.floor(100000 + Math.random() * 900000);
    const results = await UserStore.getUsername(email);
    const reseny = (results as any);
    if (!reseny.exists) {
        return res.status(200).send({ message: 'Wrong email', sent: false });
    }
    const resAny = (results as any).response;
    const mailData = {
        from: 'ziadaboalmagd092@gmail.com',
        to: email,
        subject: "reset your password " + resAny[0].name + "-" + resCode.toString().slice(0, 2),
        text: resAny[0].name + "request passowrd update",
        html: `
        <!doctype html>
        <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email</title>
            <meta name="description" content="Reset Password Email.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                <a href="https://ziadziadziad.com" title="logo" target="_blank">
                                    <img width="100" src="https://i.ibb.co/zVDmNmv/z-S-removebg-preview.png" title="ziad" alt="logo">
                                </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                        <td style="padding:5px 30px 25px; text-align: left;">
                                        <h2 style="color:#2caeba; font-weight:700; margin:0;font-size:22px;font-family:'Rubik',sans-serif; text-transform: capitalize;">hi, ${resAny[0].name}</h2>
                                        </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;"> use the below 6 digit numbers to reset your password.
                                                </p>
                                                <p href="javascript:void(0);"
                                                    style="color: hsl(209, 23%, 60%);
                                                    font-weight: 900;
                                                    margin: 20px 0 25px;
                                                    font-size: 32px;
                                                    padding: 10px 24px;
                                                    display: inline-block;
                                                    letter-spacing: 10px;">${resCode}</p>
                                                    </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:hsl(184, 77%, 34%); line-height:18px; margin:0 0 0;">&copy; <strong>ziad abolmajd</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        </html>`
    };
    req.session.user = {
        code: resCode,
        name: resAny[0].name
    };
    transporter.sendMail(mailData, (error) => {
        if (error) { return res.send(error); }
        return res.status(200).send({ message: "email has been sent", sent: true });
    });
};


const verifyReset = async (req: Request, res: Response) => {
    try {
        if (req.session.user && req.session.user.code && req.session.user.name) {
            const user = {
                code: req.session.user.code,
                name: req.session.user.name
            };
            return res.status(200).json({
                code: user.code,
                name: user.name
            });
        } else {
            return res.status(400).send("error");
        }
    }
    catch (err) {
        return err as any;
    }
};


export default usersRoutes;
