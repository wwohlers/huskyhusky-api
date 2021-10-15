export default function morph(): Promise<{
    users: any[];
    articles: any[];
    subs: {
        _id: string;
        email: string;
        __v: number;
    }[];
}>;
