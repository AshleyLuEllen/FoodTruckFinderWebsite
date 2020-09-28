export class AuthenticationService {
    executeBasicAuthenticationService(username, password) {
        return axios.get(`${process.env.FOOD_TRUCK_API_URL}/basicauth`,
            { headers: { authorization: this.createBasicAuthToken(username, password) } })
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }
}