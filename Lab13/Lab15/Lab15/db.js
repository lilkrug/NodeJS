const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

class DB {
    constructor() {
        //this.url = 'mongodb+srv://java:java@cluster0.imuij.mongodb.net/BSTU?retryWrites=true&w=majority';
        this.url='mongodb://0.0.0.0:27017/BSTU'
        this.client = new MongoClient(this.url, {useNewUrlParser: true, useUnifiedTopology: true});
        this.client = this.client.connect().then(connection => {return connection.db("BSTU")});
        console.log("Connected to MongoDB");
    }

    GetRecordsByTableName(tableName) {
        return this.client.then(db => {
            return db.collection(tableName).find({}).toArray();
        });
    }
    GetRecordsByTableNameAndId(tableName,id) {
        return this.client.then( async db => {
            var a = await db.collection(tableName).find({}).toArray();
            return a.find(element=>element._id ==x);
        });
    }
    async StartTransaction(array) {
        console.log(typeof(JSON.parse(array)));
        const transactionOptions = {
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
            readPreference: 'primary'
          };
        var client = await new MongoClient(this.url, {useNewUrlParser: true, useUnifiedTopology: true});
        await client.connect();
        var session = client.startSession();
        try {
            session.startTransaction(transactionOptions);
            var a = await client.db("BSTU").collection('pulpit').insertMany(JSON.parse(array), (err, r) => {
                if (err) console.log(err);
                else {
                    console.log(r.insertedCount);
                }
            }).session(session);
            await session.commitTransaction();
        }
        catch (e) {
            console.log(e.message)
            await session.abortTransaction();
        }
        finally {
            await session.endSession();
        }
        };

    InsertRecords(tableName,tableColumn,code, fields) {
        return this.client
            .then(async db => {
                let tableCol= JSON.parse('{"'+ tableColumn + '": "'+ code +'"}');
                console.log("CODE"+code);
                await db.collection(tableName).findOne(tableCol).then(record => {
                    if (record) throw 'This doc exists';
                    return record;});
                db.collection(tableName).insertOne(fields, (err, r) =>{
                    if(err) console.log(err);
                    else {
                        console.log(r.insertedCount);
                    }
                });
                return this.GetRecord(tableName, tableCol);
            });
    }

    UpdateRecords(tableName, id, fields) {
        return this.client
            .then(async db => {
                console.log(id);
                if (!id) {
                    throw "Wrong ID";
                }
                delete fields._id;
                await this.GetRecord(tableName, {_id: ObjectId(id)});
                await db.collection(tableName).updateOne({_id: ObjectId(id)}, {$set: fields});
                return this.GetRecord(tableName, fields);
            })
    }

    GetRecord(tableName, fields) {
        return this.client
            .then(db => {
                return db.collection(tableName).findOne(fields);
            })
            .then(record => {
                //if (!record) throw 'No records';
                return record;
            });
    }

    IsFacultyExist(code) {
        let tableCol = JSON.parse('{"faculty": "'+ code +'"}');
        return this.client
            .then(db => {
                return db.collection('faculty').findOne(tableCol);
            })
            .then(record => {
                if (!record) return false;
                return true;
            });
    }

    DeleteRecord(tableName,tableColumn, code) {
        return this.client
            .then(async db => {
                if (!code) {
                    throw 'Wrong faculty';
                }
                console.log("DB delete");
                let tableCol= JSON.parse('{"'+ tableColumn + '": "'+ code +'"}');
                let removedRecord = await this.GetRecord(tableName, tableCol);
                await db.collection(tableName).deleteOne(tableCol);
                return removedRecord;
            });
    }

}

module.exports = DB;
