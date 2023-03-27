export default class MissionServiceFactory{
    constructor(container){
        this.userModel = container.get('models.User')
        this.missionModelFactory = container.get('models.MissionModelFactory')
    }

    async createMissionService(username){
        const discoverClient = await this.userModel.userDiscoverClient(username)
        const missionModel = this.missionModelFactory.createMissionModel(discoverClient)
        return new MissionService(missionModel)
    }
}

class MissionService{
    constructor(missionModel){
        this.missionModel = missionModel
    }

    async getMissions(){
        const response = await this.missionModel.getMissions()
        return response
    }

    async getMission(missionId){
        const response = await this.missionModel.getMission(missionId)
        return response
    }

    async getMissionFootprint(missionId){
        const response = await this.missionModel.getMissionFootprint(missionId)
        return response
    }   
}