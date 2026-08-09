import Api from "../../../Api"

const OwnerRequestService = {
    async viewAllRequest() {
        const result = await fetch(Api.getOwnerRequest);
        return result;
    }
}

export default OwnerRequestService