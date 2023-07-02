const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');

const getDirImage = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDay();

    return `./public/uploads/images/${year}/${month}`;
}


const ImageStorage = multer.diskStorage({
    destination : (req , file , cb) => {
        let dir = getDirImage();
        mkdirp.sync(dir)
        // mkdirp(dir ,{recursive: true}, (err) => {cb(null , dir)})
        cb(null , dir)
    },
    filename : (req , file , cb) => {
        let code = Math.floor(Math.random() * 10000);
        let filePath = getDirImage() + '/' + file.originalname +'_'+code;
        if(!fs.existsSync(filePath))
            cb(null , file.originalname);
        else
            cb(null , Date.now() + '-' + file.originalname +'_'+code);
            
    }
})

const upload = multer({
    storage : ImageStorage,
    limits : {
        fileSize : 1024 * 1024 * 10
    }
});

module.exports = upload;