import Memcached from "memcached";
const memcached = new Memcached()
memcached.connect("localhost:11211", function (err, conn) {
    if(err) {
        console.log("Error when establishing memcached connection")
    }
})

export default memcached