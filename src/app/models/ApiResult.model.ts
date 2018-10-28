import { Post } from "./Post.model";

export interface ApiResult {
    status: string;
    data: Post[];
}