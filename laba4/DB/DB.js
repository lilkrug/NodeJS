const util = require('util');
const ee = require('events');

const db_data = [
    {id: 1, name: 'Шулаков А.А', bday: '2001-01-01'},
    {id: 2, name: 'Димитриади А.В', bday: '2001-01-02'},
    {id: 3, name: 'Круглик А.В', bday: '2001-01-03'}
];

function DB(){
    this.select = ()=>{return db_data;};
    this.insert = (r)=>{db_data.push(r);};
    this.update = (r) => {
        var index = db_data.findIndex(function (Item,i){
            if (index != 1){
                db_data[index].name = r.name;
                db_data[index].bday = r.bday;
            }
        })
    }
    this.delete = (r) => {

    }
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;