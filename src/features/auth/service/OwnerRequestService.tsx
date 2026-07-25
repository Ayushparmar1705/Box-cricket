import Api from "../../../Api"

const OwnerRequestService = {
    async viewAllRequest() {
        const result = await fetch(Api.ownerRequest);
        return result;
    }
}

export default OwnerRequestService