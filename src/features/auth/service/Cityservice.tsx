import Api from "../../../Api"

const Cityservice = {
    async addCity(cityName: string, stateName: string) {
        const result = await fetch(Api.getCity("all"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: cityName, state: stateName })
        });
        return result;
    },

    async getCity(activeFilter: string) {
        const result = await fetch(Api.getCity(activeFilter));
        return result;
    },

    async deleteCity(id: number) {
        const result = null;
        return result;
    },

    async getCityById(id: number) {
        const result = await fetch(Api.getCityById(id));
        return result;
    },

    async updateCity(id: number, cityName: string, stateName: string) {
        const result = await fetch(Api.updateCity(id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: cityName, state: stateName })
        });
        return result;
    }
}

export default Cityservice;
