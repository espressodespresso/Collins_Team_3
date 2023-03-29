import {Agenda} from '@hokify/agenda'

export default (mongoConnectionString) => {
    return new Agenda({db: {address: mongoConnectionString}})
}