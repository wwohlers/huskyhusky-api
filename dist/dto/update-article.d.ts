export interface UpdateArticleDto {
    _id: string;
    name: string;
    title: string;
    tags: string[];
    brief: string;
    image: string;
    attr: string;
    text: string;
    public: boolean;
}
