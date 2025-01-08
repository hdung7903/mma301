export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    dob: string;
    gender: "male" | "female" | "others";
}