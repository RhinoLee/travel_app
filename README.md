# Travel Note

**簡述**

專案使用前後端分離架構

Frontend 
- Vue3，Composition API 處理有狀態的共用邏輯（表單驗證）。
- Pinia 管理全域資料。
- 封裝 axios，處理 loading 與 token 過期時呼叫 refreshToken API 並 recall 先前呼叫失敗的 API。

Backend
- Node.js + Express.js 
- 使用 MVC 模式，Controller 處理程式流程與回應，Model 跟資料庫進行存取。
- 使用 Migration 同步資料庫的結構，並紀錄 DB 設計過程。
- 透過 Middleware，在進到 Controller 前先進行 JWT Token 解析、資料驗證（搭配 express-validator） 等等。
- 密碼透過 bcrypt 進行加密後，再存進 DB。


## 環境架構紀錄

### GCP
- IAM
    - 設定 Service Account，開啟需要的 GCP Services 存取權限。
- VPC
    - 設定 Firewall Rules，只允許特定 PORT 連線進 VM。
- CE
    - OS - Ubuntu
    - 套用 Service Account(IAM), VPC 設定。
    - 前後端放在同一台 VM，並利用 Docker 進行環境部署。
- Cloud SQL
    - 建立 PostgreSQL 雲端資料庫。
- Cloud Storage
    - 用來存放圖片檔案資源。
    - 後端透過 Cloud Storage API 進行資源存取。
- Cloud DNS
    - 新增前後端 A Record，指向同一台 VM public IP。
    - 將 Godaddy(網域商) 網域名稱伺服器指向 GCP Cloud DNS。
    
### Docker 
- Docker Compose 配置
    - Nginx
        - cerbot https 腳本：https://github.com/JonasAlfredsson/docker-nginx-certbot
        - 判斷子網域，將 Request 分別導向前後端 App
    - Backend
    - Frontend
        - 使用 nginx，將 request 路徑統一導向 index.html


## 主要功能
* 會員註冊（需 email 驗證）、登入、上傳/編輯頭照、可刪除帳號
* 新增主行程，可上傳編輯主行程照片
* 輸入名稱搜尋目的地，透過 google map api 取得該地點詳細資訊，並顯示於畫面
* 搜尋到目的地資訊後，可點擊加入當日行程
* 當日行程可透過拖曳調整排序
* 透過 google map api 計算行程之間的車程時間並顯示於畫面
* 只需設定行程開始時間，系統會透過 google map api 計算行程之間的車程，將最晚停留時間顯示於畫面
* 設定 google map 連結參數，點擊連結後，會將當日行程地點帶到 google map，可直接進行導航