// drug data entry

/*
output

"C:\Program Files\JetBrains\WebStorm 2017.2.3\bin\runnerw.exe" "C:\Program Files\nodejs\node.exe" E:\projects\ApniCare\app.js
database is connected
server connected to http:localhost:9000
undefined
undefined
undefined
undefined
{ __v: 0,
  disease_name: 'Dengue fever',
  symptoms: 'Headache\nMuscle, bone and joint pain\nNausea\nVomiting\nPain behind the eyes\nSwollen glands\nRash',
  risk_factor: 'Factors that put you at greater risk of developing dengue fever or a more severe form of the disease include:\n\nLiving or traveling in tropical areas. Being in tropical and subtropical areas increases your risk of exposure to the virus that causes dengue fever. Especially high-risk areas are Southeast Asia, the western Pacific islands, Latin America and the Caribbean.\nPrior infection with a dengue fever virus. Previous infection with a dengue fever virus increases your risk of having severe symptoms if you\'re infected again.',
  cause: 'Dengue fever is caused by any one of four types of dengue viruses spread by mosquitoes that thrive in and near human lodgings. When a mosquito bites a person infected with a dengue virus, the virus enters the mosquito. When the infected mosquito then bites another person, the virus enters that person\'s bloodstream.\n\nAfter you\'ve recovered from dengue fever, you have immunity to the type of virus that infected you — but not to the other three dengue fever virus types. The risk of developing severe dengue fever, also known as dengue hemorrhagic fever, actually increases if you\'re infected a second, third or fourth time.',
  treatment: 'If you have severe dengue fever, you may need:\n\nSupportive care in a hospital\nIntravenous (IV) fluid and electrolyte replacement\nBlood pressure monitoring\nTransfusion to replace blood loss',
  outlook: 'like already dead',
  prevention: 'ne dengue fever vaccine, Dengvaxia, is currently approved for use in those ages 9 to 45 who live in areas with a high incidence of dengue fever. The vaccine is given in three doses over the course of 12 months. Dengvaxia prevents dengue infections slightly more than half the time.\n\nThe vaccine is approved only for older children because younger vaccinated children appear to be at increased risk of severe dengue fever and hospitalization two years after receiving the vaccine.\n\nThe World Health Organization stresses that the vaccine is not an effective tool, on its own, to reduce dengue fever in areas where the illness is common. Controlling the mosquito population and human exposure is still the most critical part of prevention efforts.\n\nSo for now, if you\'re living or traveling in an area where dengue fever is known to be, the best way to avoid dengue fever is to avoid being bitten by mosquitoes that carry the disease.',
  source: 'mayoclinic.org',
  _id: 5a644b1ee1609631e8fdf4ca,
  organs:
   [ { subhead: 'blood,liver,brain',
       info: ' Blood will be thickened due to leakage of water from our blood vessels into surroundings tissues (like abdomen, space around lungs or eyes which will in turn cause problems), Liver will be swollen which is cause for abdominal pain in dengue fever and some times liver involvement may increase bleeding problems in dengue,Brain involvement in dengue can have varied manifestations like simple irritability to severe encephalitis, where a patient can have severe residual problems after recovery.',
       _id: 5a644b1ee1609631e8fdf4cb } ],
  diagnosis:
   [ { subhead: 'by blood test',
       info: 'A doctor can diagnose dengue fever by performing a blood test. The test will show whether the blood sample contains dengue virus or antibodies to the virus.',
       _id: 5a644b1ee1609631e8fdf4cc } ] }
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
undefined
TypeError: E:\projects\ApniCare\views\health_care_provider\partial\profile2_doc.pug:7
    5|         div.row
    6|             .col.s12.m12.l9.offset-l3
  > 7|                 h5.bold(style='font-size: 25px') Dr. #{data[0].name}
    8|                 br
    9|                 span.flow-text Profile is not complete yet
    10|     div.collection-item.dismissable

Cannot read property 'name' of undefined
    at eval (eval at wrap (E:\projects\ApniCare\node_modules\pug-runtime\wrap.js:6:10), <anonymous>:377:64)
    at template (eval at wrap (E:\projects\ApniCare\node_modules\pug-runtime\wrap.js:6:10), <anonymous>:10475:130)
    at Object.exports.renderFile (E:\projects\ApniCare\node_modules\pug\lib\index.js:428:38)
    at Object.exports.renderFile (E:\projects\ApniCare\node_modules\pug\lib\index.js:418:21)
    at View.exports.__express [as engine] (E:\projects\ApniCare\node_modules\pug\lib\index.js:465:11)
    at View.render (E:\projects\ApniCare\node_modules\express\lib\view.js:135:8)
    at tryRender (E:\projects\ApniCare\node_modules\express\lib\application.js:640:10)
    at Function.render (E:\projects\ApniCare\node_modules\express\lib\application.js:592:3)
    at ServerResponse.render (E:\projects\ApniCare\node_modules\express\lib\response.js:1008:7)
    at E:\projects\ApniCare\app.js:2737:33
    at model.Query.<anonymous> (E:\projects\ApniCare\node_modules\mongoose\lib\model.js:4056:16)
    at E:\projects\ApniCare\node_modules\kareem\index.js:273:21
    at E:\projects\ApniCare\node_modules\kareem\index.js:131:16
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
Not Useful
jbkjhbnlkh

201801212015
ReferenceError: name is not defined
    at E:\projects\ApniCare\app.js:142:24
    at Layer.handle [as handle_request] (E:\projects\ApniCare\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\projects\ApniCare\node_modules\express\lib\router\route.js:137:13)
    at Route.dispatch (E:\projects\ApniCare\node_modules\express\lib\router\route.js:112:3)
    at Layer.handle [as handle_request] (E:\projects\ApniCare\node_modules\express\lib\router\layer.js:95:5)
    at E:\projects\ApniCare\node_modules\express\lib\router\index.js:281:22
    at Function.process_params (E:\projects\ApniCare\node_modules\express\lib\router\index.js:335:12)
    at next (E:\projects\ApniCare\node_modules\express\lib\router\index.js:275:10)
    at E:\projects\ApniCare\node_modules\express-session\index.js:489:7
    at E:\projects\ApniCare\node_modules\connect-mongodb-session\index.js:89:20
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb\lib\utils.js:120:56)
    at E:\projects\ApniCare\node_modules\mongodb\lib\collection.js:1416:5
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb\lib\utils.js:120:56)
    at E:\projects\ApniCare\node_modules\mongodb\lib\cursor.js:683:5
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:171:5)
    at nextFunction (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:691:5)
    at E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:602:7
    at queryCallback (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:232:18)
    at E:\projects\ApniCare\node_modules\mongodb-core\lib\connection\pool.js:469:18
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
Average
ReferenceError: name is not defined

    at E:\projects\ApniCare\app.js:142:24
 Abiraterone
201801217353
    at Layer.handle [as handle_request] (E:\projects\ApniCare\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\projects\ApniCare\node_modules\express\lib\router\route.js:137:13)
    at Route.dispatch (E:\projects\ApniCare\node_modules\express\lib\router\route.js:112:3)
    at Layer.handle [as handle_request] (E:\projects\ApniCare\node_modules\express\lib\router\layer.js:95:5)
    at E:\projects\ApniCare\node_modules\express\lib\router\index.js:281:22
    at Function.process_params (E:\projects\ApniCare\node_modules\express\lib\router\index.js:335:12)
    at next (E:\projects\ApniCare\node_modules\express\lib\router\index.js:275:10)
    at E:\projects\ApniCare\node_modules\express-session\index.js:489:7
    at E:\projects\ApniCare\node_modules\connect-mongodb-session\index.js:89:20
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb\lib\utils.js:120:56)
    at E:\projects\ApniCare\node_modules\mongodb\lib\collection.js:1416:5
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb\lib\utils.js:120:56)
    at E:\projects\ApniCare\node_modules\mongodb\lib\cursor.js:683:5
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:171:5)
    at nextFunction (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:691:5)
    at E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:602:7
    at queryCallback (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:232:18)
    at E:\projects\ApniCare\node_modules\mongodb-core\lib\connection\pool.js:469:18
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
Average
ReferenceError: name is not defined
hhjj
    at E:\projects\ApniCare\app.js:142:24
 Abiraterone
201801214745
    at Layer.handle [as handle_request] (E:\projects\ApniCare\node_modules\express\lib\router\layer.js:95:5)
    at next (E:\projects\ApniCare\node_modules\express\lib\router\route.js:137:13)
    at Route.dispatch (E:\projects\ApniCare\node_modules\express\lib\router\route.js:112:3)
    at Layer.handle [as handle_request] (E:\projects\ApniCare\node_modules\express\lib\router\layer.js:95:5)
    at E:\projects\ApniCare\node_modules\express\lib\router\index.js:281:22
    at Function.process_params (E:\projects\ApniCare\node_modules\express\lib\router\index.js:335:12)
    at next (E:\projects\ApniCare\node_modules\express\lib\router\index.js:275:10)
    at E:\projects\ApniCare\node_modules\express-session\index.js:489:7
    at E:\projects\ApniCare\node_modules\connect-mongodb-session\index.js:89:20
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb\lib\utils.js:120:56)
    at E:\projects\ApniCare\node_modules\mongodb\lib\collection.js:1416:5
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb\lib\utils.js:120:56)
    at E:\projects\ApniCare\node_modules\mongodb\lib\cursor.js:683:5
    at handleCallback (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:171:5)
    at nextFunction (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:691:5)
    at E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:602:7
    at queryCallback (E:\projects\ApniCare\node_modules\mongodb-core\lib\cursor.js:232:18)
    at E:\projects\ApniCare\node_modules\mongodb-core\lib\connection\pool.js:469:18
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
TypeError: E:\projects\ApniCare\views\health_care_provider\partial\profile2_doc.pug:7
    5|         div.row
    6|             .col.s12.m12.l9.offset-l3
  > 7|                 h5.bold(style='font-size: 25px') Dr. #{data[0].name}
    8|                 br
    9|                 span.flow-text Profile is not complete yet
    10|     div.collection-item.dismissable

Cannot read property 'name' of undefined
    at eval (eval at wrap (E:\projects\ApniCare\node_modules\pug-runtime\wrap.js:6:10), <anonymous>:377:64)
    at template (eval at wrap (E:\projects\ApniCare\node_modules\pug-runtime\wrap.js:6:10), <anonymous>:10475:130)
    at Object.exports.renderFile (E:\projects\ApniCare\node_modules\pug\lib\index.js:428:38)
    at Object.exports.renderFile (E:\projects\ApniCare\node_modules\pug\lib\index.js:418:21)
    at View.exports.__express [as engine] (E:\projects\ApniCare\node_modules\pug\lib\index.js:465:11)
    at View.render (E:\projects\ApniCare\node_modules\express\lib\view.js:135:8)
    at tryRender (E:\projects\ApniCare\node_modules\express\lib\application.js:640:10)
    at Function.render (E:\projects\ApniCare\node_modules\express\lib\application.js:592:3)
    at ServerResponse.render (E:\projects\ApniCare\node_modules\express\lib\response.js:1008:7)
    at E:\projects\ApniCare\app.js:2737:33
    at model.Query.<anonymous> (E:\projects\ApniCare\node_modules\mongoose\lib\model.js:4056:16)
    at E:\projects\ApniCare\node_modules\kareem\index.js:273:21
    at E:\projects\ApniCare\node_modules\kareem\index.js:131:16
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
undefined
undefined
undefined
TypeError: E:\projects\ApniCare\views\health_care_provider\partial\profile_student_doctor.pug:7
    5|         div.row
    6|             .col.s12.m12.l9.offset-l3
  > 7|                 h5.bold.title1(style='font-size: 25px') Dr. #{data[0].name}
    8|                 //h5.bold.title1(style='font-size: 25px') DRx. #{data.name}
    9|                 br
    10|                 span.flow-text Profile is not complete yet

Cannot read property 'name' of undefined
    at eval (eval at wrap (E:\projects\ApniCare\node_modules\pug-runtime\wrap.js:6:10), <anonymous>:1243:64)
    at template (eval at wrap (E:\projects\ApniCare\node_modules\pug-runtime\wrap.js:6:10), <anonymous>:10475:130)
    at Object.exports.renderFile (E:\projects\ApniCare\node_modules\pug\lib\index.js:428:38)
    at Object.exports.renderFile (E:\projects\ApniCare\node_modules\pug\lib\index.js:418:21)
    at View.exports.__express [as engine] (E:\projects\ApniCare\node_modules\pug\lib\index.js:465:11)
    at View.render (E:\projects\ApniCare\node_modules\express\lib\view.js:135:8)
    at tryRender (E:\projects\ApniCare\node_modules\express\lib\application.js:640:10)
    at Function.render (E:\projects\ApniCare\node_modules\express\lib\application.js:592:3)
    at ServerResponse.render (E:\projects\ApniCare\node_modules\express\lib\response.js:1008:7)
    at E:\projects\ApniCare\app.js:2638:33
    at model.Query.<anonymous> (E:\projects\ApniCare\node_modules\mongoose\lib\model.js:4056:16)
    at E:\projects\ApniCare\node_modules\kareem\index.js:273:21
    at E:\projects\ApniCare\node_modules\kareem\index.js:131:16
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)



 */