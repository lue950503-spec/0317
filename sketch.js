let input; // 宣告一個變數用來儲存輸入框物件
let slider; // 宣告一個變數用來儲存滑桿物件
let button; // 宣告一個變數用來儲存按鈕物件
let isAnimating = true; // 控制動畫的開關變數
let myDiv; // 宣告一個變數用來儲存中央的 DIV 容器
let selectMenu; // 宣告下拉式選單變數
let iframe; // 將 iframe 宣告為全域變數，以便在選單改變時可以更新網址

function setup() {
  createCanvas(windowWidth, windowHeight); // 產生全螢幕的畫布
  
  // 產生一個文字輸入方框，並設定預設文字
  input = createInput('✨教科系✨'); 
  input.position(20, 20); // 將輸入框放置在視窗左上角
  input.size(300, 25); // 設定 input 元件的寬度為 100，高度為 25
  input.style('font-size', '20px'); // 設定 input 內的文字大小為 20px
  input.style('background-color', '#fdfcdc'); // 設定 input 的背景顏色
  input.style('color', '#780000'); // 設定 input 內的文字顏色
  
  // 產生一個滑桿，參數依序為：最小值 15、最大值 80、預設值 30
  slider = createSlider(15, 80, 30);
  // 設定滑桿位置：X 座標 = input位置(20) + input寬度(300) + 距離(50) = 370
  // Y 座標設為 25，使其在高度為 25 的 input 元件旁呈現垂直置中
  slider.position(370, 25);
  
  // 產生一個按鈕來開關動畫
  button = createButton('文字跳動');
  // 將按鈕放置在滑桿右側，並與輸入框垂直對齊
  button.position(520, 20);
  button.size(200, 40); // 設定按鈕大小為寬120，高40
  button.style('font-size', '20px'); // 設定按鈕文字大小為30px
  button.mousePressed(() => { isAnimating = !isAnimating; });
  button.style('cursor', 'pointer'); // 當滑鼠移過去時，將游標改為 pointer (手指形狀)
  
  // 注入 CSS 樣式來產生 hover 時的左右抖動動畫
  let shakeCss = `
    .btn-shake:hover {
      animation: shake-lr 0.3s ease-in-out; /* 動畫持續 0.3 秒 */
    }
    @keyframes shake-lr {
      0% { transform: translateX(0); }
      25% { transform: translateX(-4px); } /* 向左移 */
      50% { transform: translateX(4px); }  /* 向右移 */
      75% { transform: translateX(-4px); } /* 向左移 */
      100% { transform: translateX(0); }   /* 回到原位 */
    }
  `;
  createElement('style', shakeCss); // 在網頁中加入此 CSS 樣式
  button.addClass('btn-shake'); // 為按鈕加上這個動畫 class
  
  // 產生一個下拉式選單
  selectMenu = createSelect();
  // 位置 = 按鈕X(520) + 按鈕寬度(200) + 距離(50) = 770
  selectMenu.position(770, 20);
  selectMenu.size(150, 40); // 高度調整為與按鈕一致
  selectMenu.style('font-size', '20px');
  selectMenu.option('教科系', 'https://www.et.tku.edu.tw');
  selectMenu.option('淡江大學', 'https://www.tku.edu.tw');
  selectMenu.changed(() => {
    let url = selectMenu.value();
    iframe.attribute('src', url); // 當選單改變時，更新 iframe 內容
    if (url === 'https://www.tku.edu.tw') {
      input.value('✨淡江大學✨'); // 選擇淡江大學時，改變文字框內容
    } else {
      input.value('✨教科系✨'); // 選擇教科系時，改回教科系
    }
  });
  
  // 產生位於視窗中間的 DIV，四周與視窗邊界保持 200px 的距離
  myDiv = createDiv();
  myDiv.position(200, 125); // 上下內距改為 125px 以增加 150px 的高度
  myDiv.size(windowWidth - 400, windowHeight - 250); // 寬度不變，高度增加 150px (改為扣除 250px)
  myDiv.style('box-shadow', '0px 0px 20px rgba(0, 0, 0, 0.3)'); // 稍微加上一點陰影增加層次感
  myDiv.style('opacity', '0.95'); // 設定透明度為 0.95
  
  // 在 DIV 內產生 iframe 以嵌入網頁
  iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.et.tku.edu.tw');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none'); // 隱藏 iframe 預設的邊框
  iframe.parent(myDiv); // 將 iframe 放入 myDiv 容器中
}

function draw() {
  background('#ffffff');
  
  let txt = input.value(); // 動態取得使用者輸入的文字內容
  
  textSize(slider.value()); // 動態取得滑桿的值並設定為文字大小
  textAlign(LEFT, CENTER); // 設定對齊方式：水平靠左，垂直置中
  
  // 確保輸入框內有文字才進行繪製，避免算出寬度 0 造成無窮迴圈
  if (txt.length > 0) {
    let tw = textWidth(txt); // 計算輸入文字的實際寬度
    
    // 設定文字陰影效果
    drawingContext.shadowOffsetX = 3; // 陰影水平偏移量
    drawingContext.shadowOffsetY = 3; // 陰影垂直偏移量
    drawingContext.shadowBlur = 5;    // 陰影模糊程度
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 陰影顏色 (半透明黑色)
    
    // 定義漸層色票陣列
    let colors = ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a', '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'];
    
    // 利用雙層迴圈將文字鋪滿整個視窗，並限制範圍避免超出視窗
    for (let y = 100; y <= height - 15; y += slider.value() * 1.5) { // 從 Y 座標 100 開始，每隔 1.5 倍文字高度畫一排文字
      let colorIndex = 0; // 每一行開始時，重置顏色索引
      let currentX = 0;
      while (currentX + tw <= width) {
        for (let i = 0; i < txt.length; i++) {
          let charX = currentX + textWidth(txt.substring(0, i));
          let waveOffset = isAnimating ? sin(frameCount * 0.05 + charX * 0.01) * 30 : 0; // 波浪效果，根據開關控制，將跳動幅度從10增加到30
          let charY = y + waveOffset;
          fill(colors[colorIndex % colors.length]); // 根據索引設定文字顏色，使用 % 確保超過色票數量時能循環
          text(txt[i], charX, charY);
          colorIndex++; // 切換到下一個顏色
        }
        currentX += tw + 30;
      }
    }
  }
}

// 當瀏覽器視窗大小改變時，動態調整畫布尺寸以保持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  myDiv.position(200, 125); // 確保視窗縮放時位置不變
  myDiv.size(windowWidth - 400, windowHeight - 250); // 視窗縮放時同步更新 DIV 尺寸維持內距
}
