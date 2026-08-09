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

    },
    async becomeOwner(formdata) {
        const result = await fetch(Api.becomeOwner, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formdata),
        });


        const data = await result.json();
        return data;
    }
}
export default Authservice;