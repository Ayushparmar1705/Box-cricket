import Api from "../../../Api"

const Categoryservice = {
    async AddCategory(categoryName) {
        const result = await fetch(Api.category, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName })
        });
        return result;
    },

    async getCategory(activeFilter: string) {
        const result = await fetch(Api.getCategory(activeFilter));
        return result;
    },

    async deleteCategory(id: number) {
        const result = await fetch(`${Api.category}/${id}`, {
            method: "DELETE",
        });
        return result;
    },

    async getCategoryById(id: number) {
        const result = await fetch(Api.getCategoryById(id));
        return result;
    },

    async updateCategory(id: number, categoryName: string) {
        const result = await fetch(Api.updateCategory(id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName })
        });
        return result;
    }
}

export default Categoryservice;