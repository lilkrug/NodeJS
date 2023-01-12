  async function getRecordsByField(object, field, context) {
  const fields = {};
  fields[object] = field;

  let records = [];
  if (field) {
    records = await context.getOne(object, fields);
  } else {
    records = await context.getAll(object);
  }

  return records;
}

async function mutateRecord(object, fields, context) {
  return await context
    .getOne(object, { [object]: fields[object] })
    .then(async (records) => {
      let targetRecord = {};
      if (records.length > 0) {
        targetRecord = await context
          .updateOne(object, fields)
          .then(() => context.getOne(object, fields));
      } else {
        targetRecord = await context
          .insertOne(object, fields)
          .then(() => context.getOne(object, fields));
      }
      return targetRecord[0];
    });
}

async function deletedMutateRecord(object, id, context) {
  let recordIdObject = {};
  recordIdObject[object] = id;
  //let targetFaculty = await context.getOne(object, recordIdObject);
  context.deleteOne(object, id);
  return id;
}

const getFaculties = (args, context) =>
  getRecordsByField("FACULTY", args.faculty, context);

const getPulpits = (args, context) =>
  getRecordsByField("PULPIT", args.pulpit, context);

const getSubjects = (args, context) =>
  getRecordsByField("SUBJECT", args.subject, context);

const getSubjectsByFaculties = async (args, context) => {
  const { faculty } = args;
  return await context.execute(
    `SELECT s.SUBJECT, s.SUBJECT_NAME FROM SUBJECT s
                    JOIN PULPIT p ON s.PULPIT = p.PULPIT
                    JOIN FACULTY f ON p.FACULTY = f.FACULTY
                    WHERE p.FACULTY = '${faculty}';`
  );
};

const getTeachers = async (args, context) => {
  return getRecordsByField("TEACHER", args.teacher, context);
};

const getTeachersByFaculty = async (args, context) => {
  const { faculty } = args;
  return await context.execute(
    `SELECT * FROM TEACHER t 
                    JOIN PULPIT p ON t.PULPIT = p.PULPIT 
                    JOIN FACULTY f ON p.FACULTY = f.FACULTY
                    WHERE p.FACULTY = '${faculty}';`
  );
};

const setFaculty = (args, context) => {
  let fields = {
    FACULTY: args.faculty.FACULTY,
    FACULTY_NAME: args.faculty.FACULTY_NAME,
  };
  return mutateRecord("FACULTY", fields, context);
};
const setPulpit = async (args, context) => {
  let fields = {
    PULPIT: args.pulpit.PULPIT,
    PULPIT_NAME: args.pulpit.PULPIT_NAME,
    FACULTY: args.pulpit.FACULTY,
  };
  return mutateRecord("PULPIT", fields, context);
};

const setSubject = async (args, context) => {
  let fields = {
    SUBJECT: args.subject.SUBJECT,
    SUBJECT_NAME: args.subject.SUBJECT_NAME,
    PULPIT: args.subject.PULPIT,
  };
  return mutateRecord("SUBJECT", fields, context);
};

const setTeacher = async (args, context) => {
  let fields = {
    TEACHER: args.teacher.TEACHER,
    TEACHER_NAME: args.teacher.TEACHER_NAME,
    PULPIT: args.teacher.PULPIT,
  };
  return mutateRecord("TEACHER", fields, context);
};

const delFaculty = (args, context) =>
  deletedMutateRecord("FACULTY", args.id, context);
const delPulpit = (args, context) =>
  deletedMutateRecord("PULPIT", args.id, context);
const delSubject = (args, context) =>
  deletedMutateRecord("SUBJECT", args.id, context);
const delTeacher = (args, context) =>
  deletedMutateRecord("TEACHER", args.id, context);

module.exports = {
  getFaculties,
  getPulpits,
  getSubjects,
  getTeachers,
  getSubjectsByFaculties,
  getTeachersByFaculty,
  setFaculty,
  setPulpit,
  setTeacher,
  setSubject,
  delFaculty,
  delPulpit,
  delSubject,
  delTeacher,
};
