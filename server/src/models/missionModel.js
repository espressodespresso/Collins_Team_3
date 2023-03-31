export default class MissionModelFactory{
    constructor(){

    }

    createMissionModel(discoverClient){
        return new MissionModel(discoverClient)
    }
}

class MissionModel{
    constructor(discoverClient){
        this.discoverClient = discoverClient
    }

    async getMissions(){
        const endpoint = `/discover/api/v1/missionfeed/missions`
        const response = await this.discoverClient.get(endpoint)
        return response
    }

    async getMission(missionId){
        const endpoint = `/discover/api/v1/missionfeed/missions/${missionId}`
        const response = await this.discoverClient.get(endpoint)
        return response
    }

    async getMissionFootprint(missionId){
        const endpoint = `/discover/api/v1/missionfeed/missions/${missionId}/footprint`
        const response = await this.discoverClient.get(endpoint)
        return response
    }
}
