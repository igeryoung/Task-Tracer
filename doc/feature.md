**Pages, Features & Functions Breakdown**

**1. Main Page (CalendarPage)**

* **Page URL:** `/calendar`
* **Purpose:** 一覽日曆，快速瀏覽各日任務狀態，其中包含當天的每日任務與跨日長期任務，並可依分類篩選。
* **Features:**

  * **View Modes:** 月 / 週 / 日 三種視圖切換
  * **Color-coded Indicators:** 日曆上以彩色橫條代表每日任務及長期任務，對應分類顏色
  * **Class Filter:** 可依任務類別篩選顯示項目
  * **Date Click:** 點擊任一天跳轉到 DailyPage
  * **Navigation Controls:** 上一月 / 下一月、回到今日按鈕

**2. Daily Event Page (DailyPage)**

* **Page URL:** `/daily/:date` (e.g. `/daily/2025-06-24`)
* **Purpose:** 管理與記錄該日的預設任務及當天完成事項。
* **Sections & Functions:**

  1. **Daily Tasks Checklist**

     * 列表展示當天 `daily_tasks` 條目
     * 顯示欄位：

       * 類別標籤 (color swatch)
       * 任務標題
       * 勾選框 (已完成)
       * 實際耗時 (可編輯)
     * **Actions:**

       * 勾選 / 取消 (更新完成狀態)
       * 修改實際耗時
       * 編輯標題／預估耗時／類別 (inline edit 或彈窗)
       * 刪除任務
       * 新增預設任務 (按鈕)
  2. **Daily Entries (What I Did Today)**

     * 自由文字列表顯示所有 `daily_entries`
     * **Actions:**

       * 新增條目 (textarea + 提交)
       * 刪除條目

**3. Long-term Tasks Page (GanttPage)**. Long-term Tasks Page (GanttPage)\*\*

* **Page URL:** `/gantt`
* **Purpose:** 追蹤跨日或跨週的長期專案進度。
* **Features:**

  * **Gantt Chart:** 橫跨時間軸的任務條，標示開始/結束
  * **Task Details Panel:** 選中任務後在側欄顯示：

    * 標題、類別顏色、開始/結束日期、狀態、進度百分比
  * **Actions:**

    * 拖拉調整「開始」與「結束」
    * 編輯標題、類別、狀態
    * 刪除任務
    * 新增長期任務 (彈窗或表單)
  * **Filters & Views:**

    * 按狀態篩選 (未開始/進行中/已完成)
    * 按分類篩選
    * Zoom In/Out 時間軸 (天 / 週 / 月)

**4. Task Maintain Page (Dashboard)**

* **Page URL:** `/dashboard/tasks`
* **Purpose:** 儀表板式集中管理短期與長期任務，快速檢視、篩選與批次操作。
* **Features:**

  * **Overview Panels:**

    * 今日任務概覽：待辦/完成 數量、完成率、總耗時統計
    * 長期任務進度摘要：進行中 / 未開始 / 已完成 比例圖
  * **Task Tables:**

    * **Short-term Tasks Table:** 列出當前日期範圍內的 `daily_tasks`

      * 欄位：日期、標題、類別顏色、預估/實際耗時、狀態
      * 批次勾選並標記完成
      * 搜尋與篩選 (日期、類別、狀態)
    * **Long-term Tasks Table:** 列出所有 `long_tasks`

      * 欄位：標題、類別顏色、開始/結束日期、進度、狀態
      * 批次更新狀態或刪除
      * 搜尋與篩選 (日期區間、類別、狀態)
  * **Quick Actions:**

    * 新增短期任務 (日期 + 標題 + 類別)
    * 新增長期任務 (開始/結束 + 標題 + 類別)
  * **Bulk Operations:**

    * 批次標記完成、刪除、或變更分類

**5. Authentication Pages**. Authentication Pages\*\*

* **Signup Page (********`/auth/signup`****\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

  * Email／Password 表單
  * 驗證提示 (格式、強度)
* **Login Page (********`/auth/login`****\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

  * Email／Password 表單
  * 忘記密碼連結 (重置流程)
* **Reset Password Page (********`/auth/reset`****\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

  * Email 輸入送出重置通知

**6. Shared Components & Utilities**

* **Header / Sidebar Navigation**

  * Logo、頁面切換連結、使用者下拉選單 (登出)
* **Auth Guard**

  * 保護私有路由，檢查 JWT + Supabase Session
* **API Service Layer**

  * 使用 React Query 包裝 CRUD 呼叫
* **ColorPicker Component**

  * 用於 Settings 與任務 inline 編輯
* **Date Utilities**

  * 格式化、解析、時區處理 (Asia/Taipei)

**7. Bonus / Future Enhancements**

* 任務搜尋 (依標題、分類、日期)
* 月報／周報匯出 PDF / CSV
* 團隊協作：多位使用者共享任務
* 移動端 PWA 支援
