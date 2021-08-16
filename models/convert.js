// var express = require('express');
// var app = express();

// var mysql      = require('mysql');
// var db_config = {
//   host: '210.211.108.226',
//     user: 'vinaca',
//     password: '123456',
//     database: 'giayfutsal'
// };
// var connection;
// function handleDisconnect() {
//   connection = mysql.createConnection(db_config); // Recreate the connection, since
//                                                   // the old one cannot be reused.

//   connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }
// handleDisconnect();

// module.exports.getallproduct = function(done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM product", function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getallnewscontent = function(done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM news_content", function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getallproductcat = function(done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM productcat", function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getcontentbyid = function(id,done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM language_content where id = "+id, function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getproductcatbyid = function(id,done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM productcat,language_content where productcat.name = language_content.id and productcat.id = "+id, function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getnewscatbyid = function(id,done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM newscat,language_content where newscat.name = language_content.id and newscat.id = "+id, function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getproducttocat = function(done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM product_to_cat", function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getproductimage = function(done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM product_image", function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };
// module.exports.getnewtocat = function(done){
//     var temp = [];
//     try {
//         connection.query("SELECT * FROM content_to_cat", function (error, rows) {
//             if (error)
//                 throw error;

//             /*results.forEach(result => {
//                 temp.push(JSON.stringify(result));
//                 //console.log(JSON.stringify(result));
//                 //console.log('//');
//             });*/
//             done(null, rows);
//             //return callback(temp);
//         });
//         //connection.end();
//     }
//     catch (err) {
    
//     }
// };