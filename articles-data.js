/* ============================================================
   UG Online｜全站文章資料庫
   ★ 全站所有文章都在這一個檔案，首頁、所有文章列表、彈窗、文章頁會一起更新 ★

   最簡單的編輯方式：打開網站上的 admin.html（文章後台），
   在那裡改標題、分類、大小標題與內容，按「發布到網站」就會自動寫回這個檔案。
   也可以直接手動改這個檔案（GitHub 按 Commit changes，1～2 分鐘後生效）。

   【文章欄位】
   id        文章代號，只能用英文、數字、連字號，每篇不能重複（網址：article.html?id=代號）
   title     標題
   category  分類（請用 site.categories 裡的其中一個）
   date      發布日期，格式 2026-10-27（列表依日期由新到舊）
   summary   摘要，40～60 字
   cover     封面圖檔名或網址（留空會顯示預設底圖），建議 1200×800
   draft     填 true 就不會公開（草稿）
   body      文章內容，寫法：段落之間空一行
             ## 大標題    ### 小標題    - 清單    1. 編號清單    > 引言
             !! 提示框    ---  分隔線   **粗體**   [文字](網址)   ![說明](圖片檔名)
   ============================================================ */

window.ARTICLES_DATA = {

  site: {
    "name": "UG Online",
    "author": "UG Online",
    "categories": [
      "遊戲攻略",
      "新手教學",
      "活動",
      "公告",
      "其他"
    ],
    "homeCount": 8,
    "showEmptySlots": true
  },

  articles: [
    {
      id: "game-01",
      title: "遊戲介紹 01",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-01.jpg",
      coverAlt: "財神角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-02",
      title: "遊戲介紹 02",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-02.jpg",
      coverAlt: "金盔雷神角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-03",
      title: "遊戲介紹 03",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-03.jpg",
      coverAlt: "藍色巨魔角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-04",
      title: "遊戲介紹 04",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-04.jpg",
      coverAlt: "老虎角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-05",
      title: "遊戲介紹 05",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-05.jpg",
      coverAlt: "海盜角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-06",
      title: "遊戲介紹 06",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-06.jpg",
      coverAlt: "牛仔角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-07",
      title: "遊戲介紹 07",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-07.jpg",
      coverAlt: "熊貓角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-08",
      title: "遊戲介紹 08",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-08.jpg",
      coverAlt: "埃及神角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-09",
      title: "遊戲介紹 09",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-09.jpg",
      coverAlt: "戰錘雷神角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-10",
      title: "遊戲介紹 10",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-10.jpg",
      coverAlt: "柴犬角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-11",
      title: "遊戲介紹 11",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-11.jpg",
      coverAlt: "小恐龍角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-12",
      title: "遊戲介紹 12",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-12.jpg",
      coverAlt: "小羊角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-13",
      title: "遊戲介紹 13",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-13.jpg",
      coverAlt: "財神騎金馬角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-14",
      title: "遊戲介紹 14",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-14.jpg",
      coverAlt: "小猴子角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "game-15",
      title: "遊戲介紹 15",
      category: "遊戲攻略",
      date: "2026-11-27",
      summary: "",
      cover: "cover-15.jpg",
      coverAlt: "無尾熊角色圖",
      body: `內容整理中，敬請期待。`
    },
    {
      id: "format-demo",
      title: "【範例】文章格式說明",
      category: "新手教學",
      date: "2026-11-27",
      summary: "這是一篇草稿範例，示範大標題、小標題、清單與提示框的寫法，確認用不到後可以刪除。",
      cover: "",
      draft: true,
      body: `## 這是大標題

這是一般段落，段落與段落之間要空一行。可以用 **粗體** 強調重點，也可以加上 [連結文字](https://ug-tw.com)。

### 這是小標題

- 清單項目一
- 清單項目二
- 清單項目三

### 步驟寫法

1. 第一步
2. 第二步
3. 第三步

!! 這是提示框，適合放重要提醒。

> 這是引言。

---

寫好之後，把狀態從「草稿」改成「發布」，就會出現在網站上。`
    }
  ]
};
