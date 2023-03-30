import { Container } from 'typedi'

export con***REMOVED*** getMissions = async (req, res) => {
    con***REMOVED*** missionServiceFactory = Container.get('services.MissionServiceFactory')
    con***REMOVED*** missionService = await missionServiceFactory.createMissionService(req.user.username)

    con***REMOVED*** result = await missionService.getMissions()
    res.***REMOVED***atus(result.***REMOVED***atus).json({data: result.data})
}

export con***REMOVED*** getMission = async (req, res) => {
    con***REMOVED*** missionId = req.params.id
    con***REMOVED*** missionServiceFactory = Container.get('services.MissionServiceFactory')
    con***REMOVED*** missionService = await missionServiceFactory.createMissionService(req.user.username)

    con***REMOVED*** result = await missionService.getMission(missionId)
    res.***REMOVED***atus(result.***REMOVED***atus).json({data: result.data})
}

export con***REMOVED*** getMissionFootprint = async (req, res) => {
    con***REMOVED*** missionId = req.params.id
    con***REMOVED*** missionServiceFactory = Container.get('services.MissionServiceFactory')
    con***REMOVED*** missionService = await missionServiceFactory.createMissionService(req.user.username)

    con***REMOVED*** result = await missionService.getMissionFootprint(missionId)
    res.***REMOVED***atus(result.***REMOVED***atus).json({data: result.data})
}