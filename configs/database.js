const mongoose = require('mongoose');

const _init = async () => {

    mongoose.connect("mongodb://localhost:27017/test1").then((v) => {
        console.log('Connected to MongoDB');
    }).catch((e)=>{
        console.log('Error connecting ${e}');
    });
}
_init();