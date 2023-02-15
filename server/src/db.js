import Memcached from "memcached";
con***REMOVED*** memcached = new Memcached()
memcached.connect("localho***REMOVED***:11211", function (err, conn) {
    if(err) {
        console.log("Error when e***REMOVED***ablishing memcached connection")
    }
})

export default memcached