export const ImageFilter = (req,file,cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(null, false);
    }
    cb(null,true);
}

export const VideoFilter = (req,file,cb) => {
    file.originalname = Buffer.from(file.originalname,'latin1').toString('utf-8'); //для работы киррилицы
    if(!file.originalname.match(/\.(mp4|mov|wmv|avi|flv|mkv)$/)) {
        return cb(null, false);
    }
    cb(null,true);
}