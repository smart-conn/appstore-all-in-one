### 规则
- 代码格式化：2个空格。
- 所有变量名采用驼峰式的写法（例如：appID），模型对象首字母大写。
- 数据库所有外键均自定义。

### AMQP 以操作对象划分，点号分割
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

### TODO
- 历史版本的定义为：已经成功上架的应用而且不是最新版本
- 应用商店中最新版本和应用的最新版本不是同一概念，可能审核通过但是开发者并不上架

- 后续需要添加针对于应用商店的最新版本的数据库，维护时机在开发者上架或者下架应用时或者开发者怒删应用

- 用户只能安装应用商店中存在的最新版本，用户安装应用的时候只会检查最新版本对安装设备的兼容性

- 当开发者上架一个新的应用之后，向用户设备推送最新的APP，如果最新的APP不兼容设备时，不进行更新，当用户手动更新会提示失败，删除后应用将永远消失
  - 删除应用的逻辑为：首先检查当前应用是否为最新应用并且最新应用是否兼容当前设备：
    - 如果不是最新版本且最新版本兼容当前设备提示用户是否更新应用。
    - 如果不是最新版本也不兼容当前设备那么提示用户警告，删除后应用不可恢复。
    - 如果是最新版本则提示用户，应用将会被删除
