import { createJWT } from "../modules/auth.js"

export default class AuthService{
    con***REMOVED***ructor(container){
        this.userModel = container.get('models.User')
        
    }

    async login(username, password){
       con***REMOVED*** ***REMOVED***atus = await this.userModel.signIn(username, password)
       con***REMOVED*** result = {jwt: undefined}
       if(***REMOVED***atus === true){
            result.jwt = createJWT({username})
       }
       return result
    }

}