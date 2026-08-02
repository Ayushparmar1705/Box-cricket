import Api from "../../../Api";

const OwnerAuthService = {
  async login(email: string, password: string) {
    const response = await fetch(Api.ownerLogin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async register(data: any) {
    const response = await fetch(Api.ownerRegister, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
  },
};

export default OwnerAuthService;
