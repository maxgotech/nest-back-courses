import { diskStorage } from 'multer';
const fsExtra = require('fs-extra');

export const CourseImagesStorage = diskStorage({
    destination:(req,file,cb) => {
        file.originalname = Buffer.from(file.originalname,'latin1').toString('utf-8'); //для работы киррилицы
        const courseid= file.originalname.split('*')[0];
        const directory = './assets/courses/course_'+courseid;
        fsExtra.emptyDirSync(directory); //удаление содержимого директории перед загрузкой нового файла
        cb(null,'./assets/courses/course_'+courseid + '/');
    },
    filename:(req,file,cb) => {
        const nameOrigin = file.originalname.split("*")[1];
        const period = nameOrigin.lastIndexOf('.');
        const name = nameOrigin.substring(0, period);
        const fileExtension = nameOrigin.substring(period + 1);
        const newFileName  = name + '.' +fileExtension;
        console.log(newFileName)
        console.log('loaded')
        cb(null, newFileName);
    },
})

export const StudyImageStorage = diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./assets/studies/study_'+ req.headers.study + '/');
    },
    filename:(req,file,cb) => {
        file.originalname = Buffer.from(file.originalname,'latin1').toString('utf-8'); //для работы киррилицы
        const name = file.originalname.split(".")[0];
        const fileExtension = file.originalname.split(".").pop();
        const newFileName  = name.split(/[!\s#]+/).join('_')+ '.' +fileExtension;
        cb(null, newFileName);
    },
})

export const UserImageStorage = diskStorage({
    destination:(req,file,cb) => {
        file.originalname = Buffer.from(file.originalname,'latin1').toString('utf-8'); //для работы киррилицы
        const usermail= file.originalname.split('*')[0];
        const directory = './assets/users/'+usermail;
        fsExtra.emptyDirSync(directory); //удаление содержимого директории перед загрузкой нового файла
        cb(null,'./assets/users/'+usermail + '/');
    },
    filename:(req,file,cb) => {
        const nameOrigin = file.originalname.split("*")[1];
        const name = nameOrigin.split(".")[0];
        const fileExtension = nameOrigin.split(".").pop();
        const newFileName  = name.split(/[!\s#]+/).join('_')+ '.' +fileExtension;
        cb(null, newFileName);
    },
})