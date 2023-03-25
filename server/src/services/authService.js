import { createJWT } from "../modules/auth.js"

export default class AuthService{
    constructor(container){
        this.userModel = container.get('models.User')
        
    }

    async login(username, password){
       const status = await this.userModel.signIn(username, password)
       const result = {jwt: undefined}
       if(status === true){
            result.jwt = createJWT({username})
       }
       return result
    }

}