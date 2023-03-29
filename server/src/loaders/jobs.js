export default (agenda) => {
    agenda.define('te***REMOVED***', async job => {
        console.log('working')
    })
  
    agenda.every('one minute', 'te***REMOVED***')

    agenda.***REMOVED***art()
  };