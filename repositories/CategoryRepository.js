import Category from '../models/Category.js';

class CategoryRepository {
    constructor(pool) {
        this._pool = pool;
    }

    async getAllCategories() {
        const categories = [];

        const rawCategories = await this._pool.query('SELECT * FROM public."category";');

        rawCategories.rows.forEach((rawCategory) => {
            const category = new Category({
                id: rawCategory.id,
                name: rawCategory.name,
            });
            categories.push(category);
        });

        return categories;
    }

    async createCategory(name) {
        const rawCategory = await this._pool.query(
            'INSERT INTO public."category" (name) VALUES ($1) RETURNING *;',
            [name],
        );

        return new Category({
            id: rawCategory.rows[0].id,
            name: rawCategory.rows[0].name,
        });
    }

    async updateCategory({ id, name }) {
        const rawCategory = await this._pool.query('UPDATE public.category SET name=$2 WHERE id=$1 RETURNING *;', [id, name]);

        if (rawCategory.rows.length === 0) {
            throw Error('Error on update category');
        }

        return new Category({
            id: rawCategory.rows[0].id,
            name: rawCategory.rows[0].name,
        });
    }

    async deleteCategory(id) {
        const result = await this._pool.query('DELETE FROM public."category" WHERE id=$1 RETURNING *;', [id]);

        if (result.rows.length === 0) {
            throw Error('Error on delete category');
        }

        console.log(result);
    }
}

export default CategoryRepository;
