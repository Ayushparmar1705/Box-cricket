import Api from "../../../Api"

const Authservice = {
    async login(email: string, password: string) {
        const result = await fetch(Api.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password })
        });
        return result.json();

    }
}
export default Authservice;