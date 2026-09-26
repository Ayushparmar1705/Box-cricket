import baseUrl from "../../api/Api";

const country = {
    view: async () => {
        try {
            const result = await fetch(baseUrl.countries, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await result.json();
            return data;
        } catch (err) {
            console.error("Error fetching countries:", err);
            return { data: [] };
        }
    }
};

export default country;