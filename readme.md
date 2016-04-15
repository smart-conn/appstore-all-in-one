### 规则
- 代码格式化：2个空格。
- 所有变量名采用驼峰式的写法（例如：appID），模型对象首字母大写。
- 数据库所有外键均自定义。

##### AMQP 以操作对象划分，点号分割
  - APP
    - `apps` 获取某类状态的APP
      - params
        - status
    - ``
  - 应用商店
    - `appStore.apps` 返回某类APP的集合
    - `appStore.app` 返回某个app的详细信息
    -
  - 用户
    - `user.apps` 返回用户某种APP集合
  - 设备
  - 兼容
  - 开发者
    - `developer.apps` 获取某个开发者的所有应用
      - params
        - `id` 开发者id
      - return
        ```
        {

        }
        ```
    - `developer.app` 获取某个应用的最新版本的详细信息，和兼容设备情况
      - params
        -  `id` AppID
    - `developer.historyApps` 获取某个app的所有历史版本
      - params
        - `id` AppID
    - `developer.version` 获取某个应用某个版本的详细信息
      - params
        - `id` AppID
        - `version` 版本号
  - 审核

### routers
  - GET
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
      - `/developer/app/:id` 获取某个应用的详细信息（包括应用详细信息和应用的历史版本）
      - `/developer/appVersions/:id` 获取某个应用的所有版本的详细信息
      - `/developer/app/:id/version/:version` 获取某个应用某个版本的详细信息
    - 审核
      - `/audit/apps` 获取所有待审核的应用
      - `/audit/apps/status/:status` 获取某种状态的所有应用
      - `/audit/developer/:id`
      - `/audit/bucketList` 获取审核任务列表
      - `/audit/bucket/:id` 获取审核者某项任务中某个应用的详细信息
  - POST
    - 公共
    - 应用商店
    - 用户
    - 设备
    - 兼容
    - 开发者
      - `/developer/apps` 获取开发者的所有应用及状态
      - `/developer/newApp` 添加新的APP
      - `/developer/editApp` 修改APP的信息
      - `/developer/upgradeAp` 升级APP
      - `/developer/app/:id` 获取某个ID的APP详细信息
      - `/developer/appVersions/:id` 获取某个ID的APP所有版本的详细信息
      - `/developer/app/:id/version/:version` 获取某个APP某个版本的详细信息
    - 审核
      - `/audit/apps/:status` 获取某种状态的所有应用
      - `/audit/app`
### Models
  - audit
