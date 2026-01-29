export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
    username?: string; // Only for admins
}
