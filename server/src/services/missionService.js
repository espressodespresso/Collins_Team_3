export default class MissionServiceFactory{
    con***REMOVED***ructor(container){
        this.userModel = container.get('models.User')
        this.missionModelFactory = container.get('models.MissionModelFactory')
    }

    async createProductService(username){
        con***REMOVED*** discoverClient = await this.userModel.userDiscoverClient(username)
        con***REMOVED*** productModel = this.missionModelFactory.createProductModel(discoverClient)
        return new MissionModel(missionModel)
    }
}

class MissionService{
    con***REMOVED***ructor(missionModel){
        this.missionModel = missionModel
    }

    async getMissions(){
        con***REMOVED*** response = await this.missionModel.getMissions()
        return response
    }

    async getMission(missionId){
        con***REMOVED*** response = await this.missionModel.getMission(missionId)
        return response
    }

    async getMissionFootprint(missionId){
        con***REMOVED*** response = await this.missionModel.getMissionFootprint(missionId)
        return response
    }   
}