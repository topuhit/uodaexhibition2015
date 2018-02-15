var express = require("express")
var compression = require('compression')
var multer = require('multer')
var axios = require('axios')
var app = express()
var path = require('path')
var Router = require('router')
var router = express.Router();
var helmet = require('helmet')
require('dotenv').config()


var _ = require('lodash');

app.use(express.static('files'))
// compress all responses
app.use(compression())
app.use('/static', express.static(path.join(__dirname, 'files')))

app.use(helmet())

var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dfdfdfgdfgdfgdfgdgdfg',
    api_key: '293sdf2sdfgh4sdf9sdf121hdf93fhfhsdf5429',
    api_secret: 'ZpiI1sghdf1yth3VpksdgfpHsghdfMNghsdf4ghYsdf1Wsghdf2sdfsfApghw'
});

var sizeOf = require('image-size');

app.use(express.static(path.join(__dirname, 'uploads')));

var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.DB_HOST;

const bodyParser = require('body-parser')

var ejs = require('ejs')
app.set('view engine', 'ejs')






app.get('/', function(req, res) {

    // cloudinary.v2.uploader.destroy('speakers/Firefox_Screenshot_2017-02-28T16-56-09113Z-20171101220013_cikpqj', 
    //     {invalidate: true }, function(error, result) {console.log(result)});

    var visitedid = {
        visitedid: req.originalUrl,
    }

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection('visitedid').save(visitedid, (err, result) => {
            if (err) return console.log(err)
            db.close();
        })
    });

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("exhibition").find({}).limit(100).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            res.render('home', {
                speakers: result,
                active: req.url,
            });

        });
    });

})

app.get('/page/:id', function(req, res) {

    // cloudinary.v2.uploader.destroy('speakers/Firefox_Screenshot_2017-02-28T16-56-09113Z-20171101220013_cikpqj', 
    //     {invalidate: true }, function(error, result) {console.log(result)});

    var visitedid = {
        visitedid: req.originalUrl,
    }

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection('visitedid').save(visitedid, (err, result) => {
            if (err) return console.log(err)
            db.close();
        })
    });

    var skip = 0;

    console.log(req.url)

    if (req.url == '/page/2') { skip = 100 }
    if (req.url == '/page/3') { skip = 200 }
    if (req.url == '/page/4') { skip = 300 }

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("exhibition").find({}).skip(skip).limit(100).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            res.render('home', {
                speakers: result,
                active: req.url,
            });

        });
    });

})

app.get('/most-viewed', function(req, res) {

    // cloudinary.v2.uploader.destroy('speakers/Firefox_Screenshot_2017-02-28T16-56-09113Z-20171101220013_cikpqj', 
    //     {invalidate: true }, function(error, result) {console.log(result)});

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("visitedid").find({}).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            // console.log(result)

            var data = result;

            var result = _(data)
                .groupBy('visitedid')
                .map((items, visitedid) => ({ visitedid, count: items.length }))
                .value();

            result = _.orderBy(result, 'count', 'desc');

            // var hello = _.find(result, { 'visitedid': 'Shahanaj-Parvin-Color-in-Light'});
            // console.log(hello)

            // console.log(result);

            res.render('most-viewed', {
                result: result,
            });

        });
    });

})


app.get('/about', function(req, res) {

            res.render('about', {
                result: 'result',
            });

     
    });







app.get('/api/', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("exhibition").find({}).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            res.json(result)

        });
    });

})

app.get('/api/:id', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("visitedid").find({}).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            // console.log(result)
            // console.log( req.params.id)

            var data = result;

            var result = _(data)
                .groupBy('visitedid')
                .map((items, visitedid) => ({ visitedid, count: items.length }))
                .value();

            result = _.orderBy(result, 'count', 'desc');

            var hello = _.find(result, { 'visitedid': req.params.id });
            // console.log(hello)

            res.json(hello)

        });
    });

})

// app.get('/api/file', function(req, res) {

// // cloudinary.v2.uploader.destroy('speakers/Firefox_Screenshot_2017-02-28T16-56-09113Z-20171101220013_cikpqj', 
// //     {invalidate: true }, function(error, result) {console.log(result)});

//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         db.collection("exhibition").find({}).toArray(function(err, result) {
//             if (err) throw err;
//             db.close();
//             res.render('index', {
//                 speakers: result,
//             });

//         });
//     });

// })

// app.get('/api/file/update', function(req, res) {

//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         db.collection("exhibition").find({}).toArray(function(err, result) {
//             if (err) throw err;
//             db.close();
//             res.render('update', {
//                 speakers: result,
//             });

//         });
//     });

// })

var data = []
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');

    },
    filename: function(req, file, callback) {
        callback(null, path.basename(file.originalname, path.extname(file.originalname)).replace(/[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/ /g, "_") + '-' + getFormattedDate() + path.extname(file.originalname));
        data = path.basename(file.originalname, path.extname(file.originalname)).replace(/[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/ /g, "_") + '-' + getFormattedDate() + path.extname(file.originalname);

        // var dimensions = sizeOf('uploads/IMG_0230-20171101072500.JPG');
        // console.log(dimensions.width, dimensions.height);

    }
})

// app.post('/api/file', function(req, res) {
//     var upload = multer({
//         storage: storage,
//         fileFilter: function(req, file, callback) {
//             var ext = path.extname(file.originalname)
//             if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.GIF' && ext !== '.JPG' && ext !== '.PNG') {
//                 return
//             }
//             callback(null, true)
//         }
//     }).single('userFile');
//     upload(req, res, function(err) {
//         // console.log(req.body);

// cloudinary.v2.uploader.upload("uploads/"+data, {use_filename: true, folder:"exhibition"},
//     function(error, result){
//      // console.log(result);

// var seourl = (req.body.name + '-' + req.body.title).replace(/[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/ /g, "-") 

//  seourl = (seourl).replace(/--/gi, "-"); 
//  seourl = (seourl).replace(/--/gi, "-"); 
//  seourl = (seourl).replace(/--/gi, "-"); 
//  seourl = (seourl).replace(/--/gi, "-"); 
//  seourl = (seourl).replace(/--/gi, "-"); 
//  seourl = (seourl).replace(/--/gi, "-"); 
//  seourl = (seourl).replace(/--/gi, "-"); 
//         var c = {
//             name: req.body.name,
//             title: req.body.title,
//             seourl: seourl,
//             seo: req.body.seo,
//             batch: req.body.batch,
//             bfa: req.body.bfa,
//             mfa: req.body.mfa,
//             award: req.body.award,
//             image: data,
//         }

//         var artwork = {artwork: result}

//         Object.assign(c, artwork);

//         MongoClient.connect(url, function(err, db) {
//             if (err) throw err;
//             db.collection('exhibition').save(c, (err, result) => {
//                 if (err) return console.log(err)
//                 console.log('saved to database');
//                  db.close();
//                 data = [];
//                 res.redirect('/api/file');
//             })
//         });

//     });

//     })
// })

app.get('/vision/:id', function(req, res, next) {
    // console.log('Request Id:', req.params.id);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("cloud-vision3").find({ name: req.params.id }).toArray(function(err, result) {
            // console.log(result);
            if (err) throw err;

            res.json(result);

            // var visually = result["0"].vision.responses["0"].webDetection.visuallySimilarImages
            // var colors = result["0"].vision.responses["0"].imagePropertiesAnnotation.dominantColors.colors

            // var tag = result["0"].vision.responses["0"].webDetection.webEntities

            // var name = result["0"].name

            // res.render('vision', {
            //     vision: result,
            //     visually: visually,
            //     colors: colors,
            //     tag: tag,
            //     name: name,

            // });
            db.close();

        });
    });
});

app.get('/related/:id', function(req, res, next) {
    // console.log('Request Id:', req.params.id);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("exhibition").find({ batch: req.params.id }).toArray(function(err, result) {
            // console.log(result);
            if (err) throw err;

            res.json(result);
            db.close();

        });
    });
});

app.get('/nextrelated/:id', function(req, res, next) {
    // console.log('Request Id:', req.params.id);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("exhibition").find({ batch: req.params.id }).toArray(function(err, result) {
            // console.log(result);
            if (err) throw err;

            res.json(result);
            db.close();

        });
    });
});

app.get('/:id', function(req, res, next) {
    // console.log('Request Id:', req.params.id);
    var pageSpeakers = [];
    var pageview = [];
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("exhibition").find({}).toArray(function(err, result) {
            // console.log(result);
            if (err) throw err;
            console.log('Request Id:', req.params.id);

            axios.all([
                    axios.get('https://uodaexhibition2015.herokuapp.com/vision/' + req.params.id)

                ])
                .then(axios.spread(function(userResponse, resmo) {
                    //... but this callback will be executed only when both requests are complete.
                    result.forEach(function(item) {
                        if (item.seourl == req.params.id) {
                            pageSpeakers.push(item);
                        }
                    });

                    if (userResponse.data == false) {
                        res.status(404);
                        res.render('404page', {

                        });
                        return;

                    }

                    var visitedid = {
                        visitedid: req.params.id,
                    }
                    MongoClient.connect(url, function(err, db) {
                        if (err) throw err;
                        db.collection('visitedid').save(visitedid, (err, result) => {
                            if (err) return console.log(err)
                            db.close();
                        })
                    });

                    // console.log(pageSpeakers[0]._id);
                    // db.collection("exhibition").find({pageSpeakers[0]._id : {'$gt': last_id}}).limit(10)
                    var userResponse = userResponse.data
                    var visually = userResponse["0"].vision.responses["0"].webDetection.visuallySimilarImages
                    var colors = userResponse["0"].vision.responses["0"].imagePropertiesAnnotation.dominantColors.colors
                    var tag = userResponse["0"].vision.responses["0"].webDetection.webEntities
                    var name = userResponse["0"].name

                    var batch = pageSpeakers[0].batch

                            res.render('filelink', {
                                speakers: pageSpeakers,
                                visually: visually,
                                colors: colors,
                                tag: tag,
                                name: name,
                                active: req.params.id,
                                batch: batch
                            });
                            db.close();
                            pageSpeakers = [];

                }));
        });
    });
});

var port = process.env.PORT || 8000
app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})

function getFormattedDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;
    var str = date.getFullYear() + month + day + hour + min + sec;
    /*alert(str);*/
    return str;
}