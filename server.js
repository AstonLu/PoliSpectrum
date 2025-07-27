const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// 範例 μ/σ，請用訓練樣本估計後再替換
const MU    = { A:3.0,B:3.0,C:3.0,D:3.0,E:3.0,F:3.0 };
const SIGMA = { A:1.0,B:1.0,C:1.0,D:1.0,E:1.0,F:1.0 };
const REV = ['Q1R','Q2R', /* …反向題清單… */];

app.post('/submit',(req,res)=>{
  const {answers,lowConfidence} = req.body;
  const scores = {A:[],B:[],C:[],D:[],E:[],F:[]};
  for(let [qid,val] of Object.entries(answers)){
    if(val==='NA') continue;
    let num = parseInt(val);
    if(REV.includes(qid)) num = 6-num;
    const axis = qid.startsWith('Q1')||qid.startsWith('Q2')||qid.startsWith('Q3')?'A'
               : qid.startsWith('Q4')?'B'
               : qid.startsWith('Q7')?'C'
               : qid.startsWith('Q10')?'D'
               : qid.startsWith('Q13')?'E'
               : qid.startsWith('Q16')?'F':null;
    if(axis) scores[axis].push(num);
  }
  const raw={}, zScores={};
  for(let a of ['A','B','C','D','E','F']){
    if(scores[a].length<2){
      raw[a]=null; zScores[a]=null;
    } else {
      raw[a]=scores[a].reduce((s,x)=>s+x,0)/scores[a].length;
      zScores[a] = (raw[a]-MU[a])/SIGMA[a];
    }
  }
  res.json({
    version:'2025-07-27-α',
    rawScores: raw,
    zScores,
    lowConfidence
  });
});

app.listen(process.env.PORT||3000,()=>console.log('Listening on 3000'));
