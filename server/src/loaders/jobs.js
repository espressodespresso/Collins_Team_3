export default (agenda) => {
    agenda.define('te***REMOVED***', async job => {
        console.log('working')
    })
  
    agenda.every('3 seconds', 'te***REMOVED***')

    agenda.***REMOVED***art()
  };