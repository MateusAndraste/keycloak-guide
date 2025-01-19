import "express-session";

declare module "express-session" {
    interface SessionData {
        id_token?: string;
        access_token?: string;
        refresh_token?: string;
        error?: any;
    }
}