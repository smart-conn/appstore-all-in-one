### 规则
- 代码格式化：2个空格。
- 所有变量名采用驼峰式的写法（例如：appID），模型对象首字母大写。
- 数据库所有外键均自定义。

### services

### routers
  - #### GET
    - 公共
      - `/app/:id` 获取某个应用详细信息
    - 应用商店
      - `/appStore/apps` 获取所有应用（todo：分页，排序）
    - 用户
      - `/user/apps` 获取某个用户的所有应用
      - `/user/deviceModels` 获取某个用户的所有设备
    - 设备
      - `/device/apps` 获取某个设备上所有的应用
      - `/deviceModels` 获取所有的设备型号
      - `/deviceModel/:id` 获取某个设备型号的详细信息
    - 兼容
      - `/deviceModel/:id/apps` 获取某个设备型号兼容的所有应用
      - `/app/:id/deviceModels` 获取某个应用兼容的所有设备型号
    - 开发者
      - `/developer/apps` 获取某个开发者所有应用
      - `/developer/app/:id` 获取某个应用的详细信息
      - `/developer/appVersions/:id` 获取某个应用的所有版本的详细信息
      - `/developer/app/:id/version/:version` 获取某个应用某个版本的详细信息

### models
