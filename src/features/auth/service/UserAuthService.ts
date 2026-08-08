import Api from "../../../Api";

const UserAuthService = {
  async login(email: string, password: string) {
    const response = await fetch(Api.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async register(data: any) {
    // Inject role normal user explicitly
    const payload = { ...data, role: "Player" };
    const response = await fetch(Api.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  },
};

export default UserAuthService;
