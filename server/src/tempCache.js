import NodeCache from "node-cache";
const nodeCache = new NodeCache({ stdTTL: 0, checkperiod: 600} );

export {nodeCache}