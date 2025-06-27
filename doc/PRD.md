**Product Requirements Document (PRD)**

**1. Overview**

* **Product Name:** Daily Task Trace Web
* **Purpose:** 幫助使用者追蹤每日任務、記錄完成事項，並管理跨日/長期專案，以提升生產力與回顧效率。
* **Target Users:** 個人或小型團隊需要每天檢視與記錄工作任務的專業人士。

---

**2. Goals & Success Metrics**

* **主要目標：**

  * 使用者可一天內快速檢視與打卡每日任務。
  * 支援自由輸入當日完成事項，便於回顧與匯出。
  * 長期任務 Gantt 視圖幫助規劃與追蹤跨日專案。
  * 顏色標籤提升任務分類與優先區分。

* **成功指標：**

  * 週活躍使用者（WAU）> 200
  * 平均每日登入率 > 60%
  * 任務完成率 > 70%
  * 使用者滿意度 (調查) ≥ 4/5

---

**3. Scope / Features**

1. **主頁 (CalendarPage)**

   * 月/週/日檢視切換。
   * 點擊日期進入「每日事件頁面」。
   * 日曆中的每日任務以彩色標籤顯示。

2. **每日事件頁面 (DailyPage)**

   * **daily\_tasks** 結構化清單：

     * 類別 (彩色)、標題、預估耗時。
     * 勾選狀態、實際耗時編輯。
   * **daily\_entries** 自由輸入：

     * 文字內容紀錄每日完成事項，不含勾選。
   * 即時儲存 / 新增 / 刪除操作。

3. **長期任務 (GanttPage)**

   * Gantt 圖呈現 `long_tasks`：

     * 標題、開始/結束日期、類別顏色。
   * 支援任務進度更新與狀態標註。

4. **設定 (Settings)**

   * 類別管理：

     * 新增 / 編輯 / 刪除 `categories`，自選顏色標籤。

5. **使用者管理（Auth）**

   * 使用 Supabase Auth (Email/Password, OAuth)
   * JWT 驗證 Secure API。

---

**4. User Stories**

| ID  | User Role | Story                            |
| --- | --------- | -------------------------------- |
| US1 | 註冊使用者     | 作為新使用者，我希望能快速註冊/登入，以使用任務追蹤服務。    |
| US2 | 使用者       | 作為使用者，我希望能在日曆上快速瀏覽每月任務，並點擊查看詳細。  |
| US3 | 使用者       | 作為使用者，我希望編輯每日任務的完成狀態與實際耗時，便於回顧。  |
| US4 | 使用者       | 作為使用者，我希望自由輸入當日完成事項，並儲存作為日報回顧。   |
| US5 | 使用者       | 作為使用者，我希望在 Gantt 視圖中檢視跨日任務進度。    |
| US6 | 使用者       | 作為使用者，我希望自訂任務類別的名稱與顏色，以符合不同分類需求。 |

---

**5. Functional Requirements**

* **FR1:** 系統須提供月/週/日曆檢視，並支援點擊單日進入詳細頁。
* **FR2:** DailyPage 顯示 `daily_tasks` 與 `daily_entries`，並支援 CRUD 操作。
* **FR3:** GanttPage 顯示長期任務橫跨條列，並可更新進度狀態。
* **FR4:** 設定頁提供類別管理功能，並儲存 `name` + `color`。
* **FR5:** API 需驗證使用者身份並依使用者隔離資料 (RLS)。

---

**6. Non-Functional Requirements**

* **NFR1 (Performance):** 首次頁面載入時間 ≤ 2s。
* **NFR2 (Scalability):** 支援 1,000+ 使用者同時訪問。
* **NFR3 (Security):** 所有 API 全面使用 HTTPS + JWT 驗證。
* **NFR4 (Usability):** UI 響應式設計，手機/桌機均可流暢操作。
* **NFR5 (Maintainability):** 使用 Monorepo + TypeScript，程式易讀易擴展。

---

**7. Technical Architecture**

* **前端：** React + TypeScript + Tailwind CSS
* **狀態管理：** React Query (Data Fetching) + Context API
* **日曆元件：** FullCalendar 或 react-calendar
* **Gantt 元件：** dhtmlx Gantt 或 react-gantt-chart
* **後端：** NestJS + TypeScript
* **資料庫：** Supabase (PostgreSQL + RLS)
* **部署：** Vercel (Front) + Heroku / Supabase Edge Functions (Back)

---

**8. Milestones & Timeline**

| Milestone                 | 週數 | 內容                                  |
| ------------------------- | -- | ----------------------------------- |
| M1: 環境與 Auth 架設           | 1  | 建立 Monorepo、Supabase 專案、Auth 功能     |
| M2: Calendar + Daily MVP  | 2  | 實作 CalendarPage、DailyPage CRUD 與 UI |
| M3: Settings & Categories | 1  | 完成類別管理及色彩標籤功能                       |
| M4: Gantt MVP             | 2  | 開發 GanttPage，顯示長期任務與進度管理            |
| M5: 測試 & 上線               | 1  | 撰寫測試、修復 Bug、部署、文件與使用手冊              |

---

**9. Risks & Mitigation**

* **R1 (Third-Party Risks):** Supabase 性能波動 → Mitigation: 本地快取與重試機制。
* **R2 (Complexity):** Gantt Library 整合困難 → Mitigation: 先評估多套方案，採輕量選項。

---

**10. Next Steps**

1. 與團隊或您確認 PRD 內容與優先順序。
2. 建立 Figma Wireframe，並進行使用者流程驗證。
3. 分配開發工時與任務，看板追蹤。
