export default class MissionModelFactory{
    con***REMOVED***ructor(){

    }

    createMissionModel(discoverClient){
        return new MissionModel(discoverClient)
    }
}

class MissionModel{
    con***REMOVED***ructor(discoverClient){
        this.discoverClient = discoverClient
    }

    async getMissions(){
        con***REMOVED*** endpoint = `/discover/api/v1/missionfeed/missions`
        con***REMOVED*** response = await this.discoverClient.get(endpoint)
        return response
    }

    async getMission(missionId){
        con***REMOVED*** endpoint = `/discover/api/v1/missionfeed/missions/${missionId}`
        con***REMOVED*** response = await this.discoverClient.get(endpoint)
        return response
    }

    async getMissionFootprint(missionId){
        con***REMOVED*** endpoint = `/discover/api/v1/missionfeed/missions/${missionId}/footprint`
        con***REMOVED*** response = await this.discoverClient.get(endpoint)
        return response
    }
}
