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

    async getCategory() {
        const result = await fetch(Api.category);
        return result;
    },

    async deleteCategory(id: number) {
        const result = await fetch(`${Api.category}/${id}`, {
            method: "DELETE",
        });
        return result;
    }
}

export default Categoryservice;