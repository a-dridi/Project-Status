export interface Project {
    _id: string;
    title: string;
    description: string;
    created_date: Date;
    end_date: Date;
    client_email: string;
    client_telephone: string;
    finished: boolean;
}
