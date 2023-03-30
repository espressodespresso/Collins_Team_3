export default (agenda) => {
    agenda.define('test', async job => {
        console.log('working')
    })
  
    agenda.every('one minute', 'test')

    agenda.start()
  };