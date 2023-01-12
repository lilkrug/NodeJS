const sql = require('mssql');

const config = {
    user: 'NodeUser',
    password: 'NodeUser',
    server: 'localhost',
    database: 'Laba14NodeJs',
    pool: {max: 10, min: 4},
    "options": {
        "encrypt": true,
        "enableArithAbort": true,
        "trustServerCertificate": true
    }
};

class DataBase {
    constructor() {
        this.connectionPool = new sql.ConnectionPool(config).connect().then(pool => {
            console.log('Connected to MSSQL');
            return pool
        }).catch(err => console.log('Connection Failed: ', err));
    }
    processing_result = (err, result) =>{
        if(err) console.log('processing_result error:', err.code, err.originalError.info.message);
        else{
            let str = '';
            console.log('Количество строк: ', result.rowsAffected[0]);
            for(let i = 0; i < result.rowsAffected[0]; i++){
                str = '--';
                for(let key in result.recordset[i]){
                    str += `${key} = ${result.recordset[i][key]}`;
                }
                console.log(str);
            }
        }
    }
    get_Faculties(){
        return this.connectionPool.then(pool => pool.request().query('Select * FROM FACULTY'))
    }
    get_Pulpits(){
        return this.connectionPool.then(pool => pool.request().query('Select * FROM PULPIT'))
    }
    get_Subjects(){
        return this.connectionPool.then(pool => pool.request().query('Select * FROM SUBJECT'))
    }
    get_Auditoriums_Types(){
        return this.connectionPool.then(pool => pool.request().query('Select * FROM AUDITORIUM_TYPE'))
    }
    get_Auditorims(){
        return this.connectionPool.then(pool => pool.request().query('Select * FROM AUDITORIUM'))
    }
    

    get_Pulpit(pulpit)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('pulp',sql.NVarChar, pulpit).query('Select * from PULPIT where pulpit = @pulp')});
    }
    get_PulpitByFac(fac)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('fac',sql.NVarChar, fac).query('Select * from PULPIT where faculty = @fac')});
    }

    get_Faculty(faculty)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('fac',sql.NVarChar, faculty).query('Select * from FACULTY where faculty = @fac')});
    }

    get_Subject(subject)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('sub',sql.NVarChar, subject).query('Select * from Subject where subject = @sub')});
    }
    get_Auditorim(audit)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('audit',sql.NVarChar, audit).query('Select * from AUDITORIUM where AUDITORIUM = @audit')});
    }
    get_AuditorimByType(audit)
    {
        return this.connectionPool.then(pool => {
            return pool.request().input('audit',sql.NVarChar, audit).query('Select * from AUDITORIUM where AUDITORIUM_TYPE = @audit')});
    }

    post_Faculties(faculty, faculty_name){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('faculty_name', sql.NVarChar, faculty_name)
                .query('INSERT FACULTY(FACULTY, FACULTY_NAME) values(@faculty , @faculty_name)');
        });
    }

    post_Pulpits(pulpit, pulpit_name, faculty){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('faculty', sql.NVarChar, faculty)
                .query('INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) values(@pulpit , @pulpit_name, @faculty)');
        });
    }

    post_Subjects(subject, subject_name, pulpit){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values(@subject , @subject_name, @pulpit)');
        });
    }

    post_Auditoriums_Types(auditorium_type, auditorium_typename){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('INSERT AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values(@auditorium_type , @auditorium_typename)');
        });
    }

    post_Auditoriums(auditorium, auditorium_name, auditorium_capacity, auditorium_type){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_capacity', sql.Int, auditorium_capacity)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE)' +
                             ' values(@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)');
        });
    }

    put_Faculties(faculty, faculty_name){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('faculty_name', sql.NVarChar, faculty_name)
                .query('UPDATE FACULTY SET FACULTY_NAME = @faculty_name WHERE FACULTY = @faculty');
        });
    }

    put_Pulpits(pulpit, pulpit_name, faculty){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('faculty', sql.NVarChar, faculty)
                .query('UPDATE PULPIT SET PULPIT_NAME = @pulpit_name, FACULTY = @faculty WHERE PULPIT = @pulpit');
        });
    }

    put_Subjects(subject, subject_name, pulpit){
        return this.connectionPool.then(pool => {

            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('UPDATE SUBJECT SET SUBJECT_NAME = @subject_name, PULPIT = @pulpit WHERE SUBJECT = @subject');
        });
    }

    put_Auditoriums_Types(auditorium_type, auditorium_typename){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @auditorium_typename WHERE AUDITORIUM_TYPE = @auditorium_type');
        });
    }

    put_Auditoriums(auditorium, auditorium_name, auditorium_capacity, auditorium_type){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_capacity', sql.Int, auditorium_capacity)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('UPDATE AUDITORIUM SET AUDITORIUM_NAME = @auditorium_name, AUDITORIUM_CAPACITY = @auditorium_capacity, AUDITORIUM_TYPE =  @auditorium_type' +
                    ' WHERE AUDITORIUM = @auditorium');
        });
    }


    delete_Faculties(faculty){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .query('DELETE FROM FACULTY WHERE FACULTY = @faculty');
        });
    }

    delete_Pulpits(pulpit){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('pulpit', sql.NVarChar, pulpit)
                .query('DELETE FROM PULPIT WHERE PULPIT = @pulpit');
        });
    }

    delete_Subjects(subject){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .query('DELETE FROM SUBJECT WHERE SUBJECT = @subject');
        });
    }

    delete_Auditoriums_Types(auditorium_type){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .query('DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @auditorium_type');
        });
    }

    delete_Auditoriums(auditorium){
        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .query('DELETE FROM AUDITORIUM WHERE AUDITORIUM = @auditorium');
        });
    }
}
module.exports = DataBase;
