var connection=require('express-myconnection');
var mysql=require('mysql');

var con=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:'sdc',
});
//Z3apbUnvi5LQKClu

con.connect(function(err){
  if(err)
    throw err;
  console.log("Sql Connected");

});
module.exports= con;
// select sa.instructor_code,t.name,t.designation, ba.course,ba.stream,ba.semester, sa.subject_name , sa.subject_code ,sa.type,sa.feedback_id , f.at_1,f.at_2,f.at_3,f.at_4,f.at_5,f.at_6,f.at_7,f.at_8,f.at_9,f.at_10,f.at_11,f.at_12,f.at_13,f.at_14,f.at_15
// from `usict_subject_allocation` as sa
// join `usict_feedback_2016` as f on sa.feedback_id = f.feedback_id
// join `usict_batch_allocation`  as ba on sa.batch_id =ba.batch_id
// join `usict_teacher` as  t on sa.instructor_code = t.instructor_id
// where instructor_code= 30564
