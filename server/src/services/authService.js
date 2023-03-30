import { createJWT } from "../modules/auth.js"

export default class AuthService{
    con***REMOVED***ructor(container){
        this.userModel = container.get('models.User')
        
    }

    async login(username, password){
       con***REMOVED*** ***REMOVED***atus = await this.userModel.signIn(username, password)
       let result = {jwt: undefined}
       if(***REMOVED***atus === true){
            result.***REMOVED***atus = 200
            result.jwt = createJWT({username})
       }else{
            result = {***REMOVED***atus: 400, data: {message: "invalid username and password combination"}}
       }
       return result
    }
}