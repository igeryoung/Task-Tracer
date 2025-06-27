**Development Roadmap & Implementation Order**

以下為依開發先後順序排序的主要任務與里程碑，確保從基礎架構到完整功能逐步落實：

---

### 0. 環境與專案骨架

* **Monorepo 設定**：pnpm workspace or Nx 管理前後端
* **基礎專案初始化**：

  * 前端：React + TypeScript + Tailwind CSS 範本
  * 後端：NestJS + TypeScript 範本
* **Supabase 專案連結**：初始化資料庫、Auth
* **CI/CD Pipeline**：GitHub Actions or GitLab CI

---

### 1. 身份驗證 & 權限控管

* **Supabase Auth 集成**：Email/Password、OAuth
* **NestJS Guard**：JWT 驗證 middleware
* **前端 Auth Flow**：Login / Signup 頁面、Session 管理

---

### 2. API 基礎 CRUD Endpoints

* **Categories**：GET/POST/PUT/DELETE `/categories`
* **Daily Tasks**：GET/POST/PUT/DELETE `/daily-tasks`
* **Daily Entries**：GET/POST `/daily-entries`
* **Long Tasks**：GET/POST/PUT/DELETE `/long-tasks`
* **全域錯誤與輸入驗證**：class-validator、全域 exception filter

---

### 3. 共用元件 & 工具函式

* **Header / Sidebar Navigation**
* **Auth Guard (前端路由保護)**
* **API Service Layer**：React Query hooks 範本
* **ColorPicker Component**：tailwind-compatible
* **Date Utilities**：format、parse、Asia/Taipei 處理

---

### 4. Task Maintain Page (Dashboard)

* **概覽面板**：今日任務、長期任務進度圖
* **短期任務表格**：列表、搜尋、篩選、Batch 操作
* **長期任務表格**：列表、搜尋、篩選、Batch 操作
* **Quick Actions**：新增短期/長期任務表單

---

### 5. CalendarPage 開發

* **月檢視 MVP**：日曆元件、事件點示、今日/跳月控制
* **週／日 檢視**：視圖切換按鈕、API 串接 fetch 當前區間任務
* **分類篩選**：Class Filter UI + 對應日曆更新
* **點擊進入**：日期跳轉至 `/daily/:date`

---

### 6. DailyPage 開發

* **Daily Tasks Checklist**：列表、勾選、實際耗時編輯、CRUD
* **Daily Entries**：自由輸入列表、CRUD
* **Summary & Stats** (可選)：完成率、耗時對比

---

### 7. GanttPage 開發

* **Gantt Chart MVP**：整合 react-gantt-chart or dhtmlx
* **Task Details Panel**：側欄顯示與編輯功能
* **Timeline Controls**：Zoom In/Out 天／週／月
* **Filters & Bulk Actions**：狀態、分類篩選／批次更新

---

### 8. 測試、效能與安全

* **單元測試 & E2E**：Jest (NestJS) + React Testing Library + Cypress
* **效能優化**：lazy loading、API caching
* **安全強化**：RLS、CSP、輸入淨化

---

### 9. 部署 & 文件

* **前端部署**：Vercel / Netlify
* **後端部署**：Supabase Edge Functions or Heroku
* **API & 使用手冊**：Swagger + README + Figma wireframes

---

### 10. 未來優化 (Optional)

* 報表匯出 (PDF/CSV)
* 團隊協作功能
* PWA / 移動端離線支援
