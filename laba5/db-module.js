var http = require('http');
var url = require('url');
var util = require('util');
var ee = require('events');
console.log('imported db-module');


let db = 
[
    {
        id: 1,
        name: "Alex",
        bday: "18-03-2003"
    },
    {
        id: 2,
        name: "Andrei",
        bday: "01-02-2002"
    },
    {
        id: 3,
        name: "Toxa",
        bday: "15-09-2002"
    }
];





function DB()
{
    this.select = () => 
    {
        console.log("[SELECT]\n");
        return JSON.stringify(db, null, 2);
    }


    this.insert = (insertString) => 
    {
        for (let i = 0; i < db.length; ++i)
            if (JSON.parse(insertString).id == db[i].id) 
                return JSON.stringify({status: "Error"});
        db.push(JSON.parse(insertString));
        console.log("[INSERT]\n");
        return JSON.stringify({status: "OK"});

    }


    this.update = (updateString) => 
    {
        console.log("[UPDATE]");
        var jsonString = JSON.parse(updateString);
        console.log(jsonString);
        var id = jsonString.id;
        var status = true;
        console.log("id to update: " + id + "\n");
        var index = db.findIndex(elem => elem.id === parseInt(id));
        console.log('index: ', index);
        if (index == -1)
            return JSON.stringify({status: "Error"});
        db[index].name = jsonString.name;
        db[index].bday = jsonString.bday;
        return JSON.stringify({status: "OK"});
    }

    
    this.delete = (id) => 
    {
        console.log("[DELETE]\n");
        var index = db.findIndex(elem => elem.id === parseInt(id));
        if (index == -1)
            return JSON.stringify({status: "Error"});
        var deleted = db[index];
        db.splice(index, 1);
        return JSON.stringify({status: "OK"});

    }


    this.commit = () => 
    {
        // console.log("\n[COMMIT]\nThe operations have been commited.\n");
    }
} 


util.inherits(DB, ee.EventEmitter);
exports.DB = DB;