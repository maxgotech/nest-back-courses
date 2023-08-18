export const ImageFilter = (req,file,cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(null, false);
    }
    cb(null,true);
}