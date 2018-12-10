var arango = require('arangojs')
var config = require('../config')
const logger = require('../utils/logger').logger('arangoDb')

//////////////////////////////////////////////////////////////////
function getDb(name){
  logger.info("read config ", JSON.stringify(config))
  var db = null
  Database = arango.Database;
  db = new Database(`http://${config.arangoHost}:${config.arangoPort}`);
  db.useDatabase(name);
  db.useBasicAuth(config.arangoUser, config.arangoPassword)
  logger.info("arango db init success")
  return db
}

//////////////////////////////////////////////////////////////////
async function queryDocs(db, aql){
  logger.info("qery aql is: ", aql)
  return await db.query(aql).then(cursor => cursor.all())
  .then(docs => {
      return docs
  },
  err => {
      logger.error('Failed to fetch agent document:')
      return []
  })
}


//////////////////////////////////////////////////////////////////
async function querySingleDoc(db, aql){
  logger.info("query aql is: ", aql)
  return await db.query(aql).then(cursor => cursor.all())
  .then(docs => {
      if(docs.length == 0){
          return null
      }else{
          return docs[0]
      }
  },
  err => {
      logger.error('Failed to fetch agent document:')
      return null
  })
}

//////////////////////////////////////////////////////////////////
async function saveDoc(db, collectionName, doc){
  var collection  = db.collection(collectionName)
  return await collection.save(doc).then(
      meta => { logger.info('Document saved:', meta._key); return meta._key },
      err => { logger.error('Failed to save document:', err); return "" }
  );
}

//////////////////////////////////////////////////////////////////
async function updateDoc(db, aql){
  logger.info("update aql is :", aql)
  return await db.query(aql).then(cursor => cursor.all())
  .then(result => {
      logger.info(`update doc success`)
      return true
  },
  err => {
      logger.error('Failed to update doc')
      return false
  })
}

module.exports={
  getDb,
  querySingleDoc,
  updateDoc,
  queryDocs,
  saveDoc
}
