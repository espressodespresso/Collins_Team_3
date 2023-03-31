import { Container } from 'typedi'

export const getMissions = async (req, res, next) => {
    try{
        const missionServiceFactory = Container.get('services.MissionServiceFactory')
        const missionService = await missionServiceFactory.createMissionService(req.user.username)
    
        const result = await missionService.getMissions()
        res.status(result.status).json({data: result.data})
    }catch(e){
        next(e)
    }
}

export const getMission = async (req, res, next) => {
    try{
        const missionId = req.params.id
        const missionServiceFactory = Container.get('services.MissionServiceFactory')
        const missionService = await missionServiceFactory.createMissionService(req.user.username)
    
        const result = await missionService.getMission(missionId)
        res.status(result.status).json({data: result.data})
    }catch(e){
        next(e)
    }
}

export const getMissionFootprint = async (req, res, next) => {
    try{
        const missionId = req.params.id
        const missionServiceFactory = Container.get('services.MissionServiceFactory')
        const missionService = await missionServiceFactory.createMissionService(req.user.username)
    
        const result = await missionService.getMissionFootprint(missionId)
        res.status(result.status).json({data: result.data})
    }catch(e){
        next(e)
    }
}