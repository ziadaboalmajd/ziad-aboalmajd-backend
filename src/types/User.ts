export type NewUser = {
    name: String;
    password: String;
    newName: String;
    newPassword: String;
};
export type UserInfo = {
    name: String;
    gen?: Number;
    age?: Number;
};
export type authUser = {
    name: String;
    password: String;
};
export type tokenUser = {
    username: String;
    token: String;
};
export type User = {
    id?: number;
    name: String;
    email: String;
    password: String;
};
export type Upass = {
    id?: number;
    name: String;
    pass: String;
    cpass: String;
};
export type Comment = {
    id?: number;
    name?: String;
    value?: String;
    time?: String;
};

