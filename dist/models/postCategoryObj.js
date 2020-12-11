"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCategoryArray = exports.CategoryResponse = exports.PostResponse = exports.PostCategory = void 0;
class PostCategory {
    constructor(postId, categoryId) {
        this.postId = postId;
        this.categoryId = categoryId;
    }
}
exports.PostCategory = PostCategory;
class PostResponse {
    constructor(postId, categories) {
        this.postId = postId;
        this.categories = categories;
    }
}
exports.PostResponse = PostResponse;
class CategoryResponse {
    constructor(categoryId, posts) {
        this.categoryId = categoryId;
        this.posts = posts;
    }
}
exports.CategoryResponse = CategoryResponse;
const postCategoryArray = [];
exports.postCategoryArray = postCategoryArray;
//# sourceMappingURL=postCategoryObj.js.map