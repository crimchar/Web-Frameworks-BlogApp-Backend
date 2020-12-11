import { categoriesRouter } from "../routes/categories";
import { Category } from "./categoryObj";
import { Post } from "./postObj";

class PostCategory{

    postId: number;
    categoryId: number;
    
    constructor(postId:number, categoryId:number)
    {
        this.postId = postId;
        this.categoryId = categoryId;
    }
}

class PostResponse{

    postId: number;
    categories: Category[];

    constructor(postId:number, categories:Category[])
    {
        this.postId = postId;
        this.categories = categories;
    }
}

class CategoryResponse{

    categoryId: number;
    posts: Post[];

    constructor(categoryId:number, posts:Post[])
    {
        this.categoryId = categoryId;
        this.posts = posts;
    }
}

const postCategoryArray:PostCategory[]=[];

export {PostCategory};
export {PostResponse};
export {CategoryResponse};
export {postCategoryArray};