<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>台灣政治光譜分析測驗</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { background-color: #f8f9fa; }
    .section { margin-top: 2rem; }
    .hidden { display: none; }
    .chart-container { width: 100%; max-width: 600px; margin: auto; }
  </style>
</head>
<body>
  <div class="container py-5">
    <!-- 首頁區塊 -->
    <div id="home">
      <div class="text-center">
        <img src="taiwanpoliticalanalysis.png" alt="Logo" class="img-fluid mb-3" style="max-width: 200px;">
        <h1>台灣政治光譜分析測驗</h1>
      </div>
      <p>你好！這是一個幫助你快速了解自己在台灣政治光譜中位置的小工具。測驗共有 20 題，分成六大主題：兩岸與認同、治理與秩序、經濟策略、社會議題、能源與環境，以及反極化與風格。每題請從 1（非常不同意）到 5（非常同意）選擇最符合你意見的分數。完成後，系統將依照你的回答，繪製一張散點圖和一張雷達圖，並給出「深藍、淺藍、中間白、淺綠、深綠」等五種光譜分類，讓你一目了然自己的政治傾向。</p>
      <div class="text-center mt-4">
        <button id="start-btn" class="btn btn-primary btn-lg">Start</button>
      </div>
    </div>

    <!-- 測驗表單 -->
    <div id="survey-container" class="hidden">
      <h2 class="text-center">填寫以下題目（1 = 強烈不同意，5 = 強烈同意）</h2>
      <form id="survey-form">
        <!-- A軸 題目 -->
        <div class="section">
          <h4>A 軸：兩岸與認同</h4>
          <div class="mb-3">
            <label for="q1" class="form-label">1. 我支持在不預設政治前提下恢復或維持兩岸制度性對話，以降低風險。</label>
            <select id="q1" class="form-select" required>
              <option value="">請選擇...</option>
              <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
            </select>
          </div>
          <!-- 同結構再添加 q2, q3 題目 -->
        </div>
        <!-- B軸 題目 -->
        <div class="section">
          <h4>B 軸：治理與秩序</h4>
          <div class="mb-3">
            <label for="q4" class="form-label">4. 面對治安與資安風險，我支持政府有強大執行力並可提供申訴管道。</label>
            <select id="q4" class="form-select" required>
              <option value="">請選擇...</option>
              <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
            </select>
          </div>
          <!-- 再添加 q5, q6 題目 -->
        </div>
        <!-- C軸 題目 -->
        <div class="section">
          <h4>C 軸：經濟策略</h4>
          <!-- 添加 q7, q8, q9 -->
        </div>
        <!-- D軸 題目 -->
        <div class="section">
          <h4>D 軸：社會議題</h4>
          <!-- 添加 q10, q11, q12 -->
        </div>
        <!-- E軸 題目 -->
        <div class="section">
          <h4>E 軸：能源與環境</h4>
          <!-- 添加 q13, q14, q15 -->
        </div>
        <!-- F軸 題目 -->
        <div class="section">
          <h4>F 軸：反極化與風格</h4>
          <!-- 添加 q16, q17, q18 -->
        </div>
        <!-- 校正題 -->
        <div class="section">
          <h4>校正題</h4>
          <!-- 添加 q19, q20 -->
        </div>
        <button type="submit" class="btn btn-primary mt-3">提交</button>
      </form>
    </div>

    <!-- 頁尾：開發者介紹 -->
    <div class="text-center text-muted mt-5 small">
      本測驗由 Aston 獨立開發，不隸屬於任何政黨或利益團體。測驗結果僅供參考，如需正式政治建議請諮詢專業單位。
    </div>
  </div>

  <script>
    // 首頁與問卷切換
    document.getElementById('start-btn').addEventListener('click', function() {
      document.getElementById('home').classList.add('hidden');
      document.getElementById('survey-container').classList.remove('hidden');
    });

    // 問卷提交後處理：計算分數、繪圖、顯示結果
    document.getElementById('survey-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const values = Array.from({length: 20}, (_, i) => parseInt(document.getElementById('q'+(i+1)).value, 10));
      const avg = (idxs) => idxs.reduce((s,i)=>s+values[i-1],0)/idxs.length;
      const A = avg([1,2,3]), B = avg([4,5,6]), C = avg([7,8,9]),
            D = avg([10,11,12]), E = avg([13,14,15]), F = avg([16,17,18]);
      let category = '未分類';
      if (A<=2 && B<=2 && D<=2 && F<=3) category='深藍';
      else if (A<=3 && B<=3 && D>=2&&D<=3) category='淺藍';
      else if (F>=4 && B<=3 && A>=2&&A<=4) category='中間白';
      else if (A>=3.5&&D>=3.5&&B>=3) category='淺綠';
      else if (A>=4.5&&D>=4&&B>=3.5&&(C>=4||E>=4)) category='深綠';

      // 隱藏表單、顯示圖表區
      document.getElementById('survey-container').innerHTML = `
        <h3 class="text-center">你的光譜分類：${category}</h3>
        <div class="chart-container mt-4"><canvas id="scatterChart"></canvas></div>
        <div class="chart-container mt-4"><canvas id="radarChart"></canvas></div>
        <pre class="mt-3">A: ${A.toFixed(2)}, B: ${B.toFixed(2)}, C: ${C.toFixed(2)}, D: ${D.toFixed(2)}, E: ${E.toFixed(2)}, F: ${F.toFixed(2)}</pre>
      `;

      new Chart(document.getElementById('scatterChart'), {
        type: 'scatter',
        data: { datasets: [{ label: '你的位置', data: [{x:A,y:B}], backgroundColor:'rgba(54,162,235,0.6)' }] },
        options: { scales:{ x:{min:1,max:5,title:{display:true,text:'A 軸'}}, y:{min:1,max:5,title:{display:true,text:'B 軸'}} } }
      });
      new Chart(document.getElementById('radarChart'), {
        type: 'radar',
        data: { labels:['A','B','C','D','E','F'], datasets:[{ label:'分數', data:[A,B,C,D,E,F], fill:true, backgroundColor:'rgba(255,99,132,0.4)', borderColor:'rgba(255,99,132,1)' }] },
        options: { scales:{ r:{min:1,max:5,ticks:{stepSize:1}} } }
      });
    });
  </script>
</body>
</html>
