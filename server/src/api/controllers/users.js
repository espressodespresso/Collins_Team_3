import { Container } from 'typedi'

export con***REMOVED*** login = async (req, res) => {
    con***REMOVED*** authService = Container.get('services.Auth')
    con***REMOVED*** result = await authService.login(req.body.username, req.body.password)

    if(result.jwt !== undefined){
        res.json({token: result.jwt})
    }else{
        res.***REMOVED***atus(400).json({message: "Invalid username and password combination"})
    }
}