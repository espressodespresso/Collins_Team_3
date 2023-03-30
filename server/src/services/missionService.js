export default class MissionServiceFactory{
    con***REMOVED***ructor(container){
        this.userModel = container.get('models.User')
        this.missionModelFactory = container.get('models.MissionModelFactory')
    }

    async createMissionService(username){
        con***REMOVED*** discoverClient = await this.userModel.userDiscoverClient(username)
        con***REMOVED*** missionModel = this.missionModelFactory.createMissionModel(discoverClient)
        return new MissionService(missionModel)
    }
}

class MissionService{
    con***REMOVED***ructor(missionModel){
        this.missionModel = missionModel
    }

    async getMissions(){
        con***REMOVED*** response = await this.missionModel.getMissions()
        if(response.***REMOVED***atus != 200){
            throw new Error
        }
        return response
    }

    async getMission(missionId){
        con***REMOVED*** response = await this.missionModel.getMission(missionId)
        if(response.***REMOVED***atus == 400){
            response.data = {message: "Invalid mission id"}
        }else if(response.***REMOVED***atus != 200){
            throw new Error()
        }
        return response
    }

    async getMissionFootprint(missionId){
        con***REMOVED*** response = await this.missionModel.getMissionFootprint(missionId)
        if(response.***REMOVED***atus == 400){
            response.data = {message: "Invalid mission id"}
        }else if(response.***REMOVED***atus != 200){
            throw new Error()
        }
        return response
    }   
}