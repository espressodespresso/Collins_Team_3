import { createJWT } from "../modules/auth.js"

export default class AuthService{
    constructor(container){
        this.userModel = container.get('models.User')
        
    }

    async login(username, password){
       const status = await this.userModel.signIn(username, password)
       let result = {jwt: undefined}
       if(status === true){
            result.status = 200
            result.jwt = createJWT({username})
       }else{
            result = {status: 400, data: {message: "invalid username and password combination"}}
       }
       return result
    }
}