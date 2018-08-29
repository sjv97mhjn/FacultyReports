var express =  require('express');
var app = express();
var con = require("./mysql.js");
var async =require('async');
var path = require('path');
var pdfMaker = require('pdf-maker');
app.use(express.static(path.join(__dirname, 'public')));
var names=[];
var theory= [
			"Coverage of all the topics prescribed in the syllabus, with adequate depth and detail.",
			"Compliance with the number of teaching hours allotted and actual hours taught.",
			"Clarity of speech, pace of teaching, logical flows as well as continuity of thought and expression in lectures.",
			"Ability to explain the concepts clearly.",
	    	"Teaching methodology and the use of teaching aids (blackboard/power point presentation/OHP) adequately served your learning needs.",
	    	"Knowledge of the teacher in the subject.",
	    	"The extent of interaction students involvement students participation in discussing the subject matter.",
			"Encourages and makes you feel comfortable about asking questions. ",
			"Provides enthusiastic, clear and satisfactory response to students questions.",
			"Teacher generated enough interest and stimulated your intellectual curiosity.",
			"Teacher enhanced your capability to critically analyze and scrutinize scientific information.",
			"Stimulates and maintains interest and attention of students throughout the course.",
			"Because of the teacher you felt enthusiastic about studying the subject.",
			"How much enriched did you feel at the end of the course.",
			"Teaching helped you to develop an independent thinking/perspective about the subject."
		];

    	var practicals= [
			"The extent of direct supervision by the teacher throughout the practical.",
			"The theoretical basis technical considerations related to the experimental practical exercises were explained well.",
			"The experiments generated enough interest and helped in developing/strengthening your concepts.",
		    "Created sufficient opportunity for students to practice their skill.",
		    "Adequate time was devoted to interactive sessions to discuss analyze the results and clarify doubts of students.",
			"The teacher helped you build your capability to think and plan the experiments independently and analyze the results critically",
			"Encourages and makes you feel comfortable about asking questions.",
			"Provides enthusiastic, clear and satisfactory response to student s questions."
		]
app.get("/",function(req,res){
  //res.render('teacher.ejs');
res.send("Its working");
})
app.get("/insert",function(req,res){
	names=[];
	var query = 'select instructor_id from uslls_teacher'
	con.query(query,function(err,result){
		if(err){
			console.log(err);
		}
		else{
			names=result;
			console.log(names);
			async.each(names,function(name,callback){
				fetch(name.instructor_id,callback);

			},function(err){
				if(err){
					console.log(err);
				}
				else{
					console.log("Completed");
					//res.send("TAsk completed");
				}
			})
		}
	})
})
var fetch = function(id,callback){
	console.log("id is : ",id);
	var query = `

   select sa.instructor_code,t.name,t.designation, ba.course,ba.stream,ba.semester,
    sa.subject_name , sa.subject_code ,sa.type,sa.feedback_id ,
    f.at_1,f.at_2,f.at_3,f.at_4,f.at_5,f.at_6,f.at_7,f.at_8,f.at_9,f.at_10,f.at_11,f.at_12,f.at_13,f.at_14,f.at_15
     from uslls_subject_allocation_2017 as sa
     join uslls_feedback_2017 as f on sa.feedback_id = f.feedback_id
       join uslls_batch_allocation as ba on sa.batch_id =ba.batch_id
       join uslls_teacher as t on sa.instructor_code = t.instructor_id
       where instructor_code= '${id}'
`;
con.query(query,function(err,results){

  if(err){
    console.log(err);
  }
  else{
		// console.log('**************************');
		// console.log(results);
			// console.log('**************************');
    async.each(results,function(result,callback){
      if(result.type == 'Theory'){
        for(var i=1;i<=15;i++){
        var scores =[0,0,0,0,0,0] ;
        for(var j=0;j<=result['at_'+i].length;j++){
          scores[Number(result['at_' + i][j])] +=1;
         }
         result['at_'+i] =`${scores[0]},${scores[1]},${scores[2]},${scores[3]},${scores[4]},${scores[5]}` ;
        }
        }
        else if(result.type == 'Practical'){
          for(var i=1;i<=8;i++){
          var scores =[0,0,0,0,0,0] ;
          for(var j=0;j<=result['at_'+i].length;j++){
            scores[Number(result['at_' + i][j])] +=1;
           }
           result['at_'+i] =`${scores[0]},${scores[1]},${scores[2]},${scores[3]},${scores[4]},${scores[5]}` ;
          }
          }
      callback();
    },function(err){
if(err){
	console.log(err);
}
else{
	if(!results[0]){
		console.log("Missing id is :",id);
		callback();
	}
	else{
var template = './views/teacher.ejs';
var pdfPath = `./reports/uslls2/${results[0].name}.pdf`;
var option = {

        paperSize: {
            format: 'A3',
            orientation: 'portrait',
            border: '1.8cm'
        }
};


pdfMaker(template,{results: results,theory:theory,practical:practicals}, pdfPath, option);
callback();
  //res.render('teacher.ejs',{results:results,theory:theory,practical:practicals})
  } }
 })




  }
})
}



app.listen(5000,function(){
  console.log("Connected on port 5000")
});
