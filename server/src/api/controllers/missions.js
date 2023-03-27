import { Container } from 'typedi'

export const getMissions = async (req, res) => {
    const missionServiceFactory = Container.get('services.MissionServiceFactory')
    const missionService = missionServiceFactory(req.user.username)

    const result = await missionService.getMissions()
    res.status(result.status).json({data: result.data})
}

export const getMission = async (req, res) => {
    const missionId = req.params.id
    const missionServiceFactory = Container.get('services.MissionServiceFactory')
    const missionService = missionServiceFactory(req.user.username)

    const result = await missionService.getMission(missionId)
    res.status(result.status).json({data: result.data})
}

export const getMissionFootprint = async (req, res) => {
    const missionId = req.params.id
    const missionServiceFactory = Container.get('services.MissionServiceFactory')
    const missionService = missionServiceFactory(req.user.username)

    const result = await missionService.getMissionFootprint(missionId)
    res.status(result.status).json({data: result.data})
}