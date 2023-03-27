import { Container } from 'typedi'

export const login = async (req, res) => {
    const authService = Container.get('services.Auth')
    const result = await authService.login(req.body.username, req.body.password)

    if(result.jwt !== undefined){
        res.json({token: result.jwt})
    }else{
        res.status(400).json({message: "Invalid username and password combination"})
    }
}