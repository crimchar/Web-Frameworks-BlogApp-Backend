class Category
{
    categoryId: number;
    categoryName: string;
    categoryDescription: string;

    constructor(categoryId: number, categoryName: string, categoryDescription: string)
    {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
    }
}

const categoryArray:Category[] = [];

export { Category };
export { categoryArray };