export default (agenda) => {
    agenda.define('test', async job => {
        console.log('working')
    })
  
    agenda.every('3 seconds', 'test')

    agenda.start()
  };