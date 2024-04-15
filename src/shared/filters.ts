export const ImageFilter = (req,file,cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
        return cb(null, false);
    }
    cb(null,true);
}

export const VideoFilter = (req,file,cb) => {
    if(!file.originalname.match(/\.(mp4|mov|wmv|avi|flv|mkv)$/)) {
        return cb(null, false);
    }
    cb(null,true);
}