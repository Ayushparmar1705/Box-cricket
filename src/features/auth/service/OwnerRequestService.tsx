import Api from "../../../Api"

const OwnerRequestService = {
    async viewAllRequest() {
        const result = await fetch(Api.getOwnerRequest);
        return result;
    },
    async approveRequestService(id: number) {
        const result = await fetch(Api.approveOwnerRequest(id), {
            method: 'PATCH'
        });
        return result;
    }
}

export default OwnerRequestService