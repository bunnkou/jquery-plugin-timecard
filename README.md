# jquery-plugin-timecard

1.支持自定义添加删除项目及相关人员<br/>
2.支持 select2 插件选择项目<br/>

# 参数
1. data: json格式数据<br/>
2. columns: 1) field: 字段名称 2) title: 字段标题 3) width: 表格宽度 4) editor: 调用其他插件
3. sourcePool: label标签存放位置
4. success: 加载成功后的回调函数
5. multiLabel：默认为false, 允许重复选择标签，选择标签后，标签不会从 sourcePool 中移除，依然可以选择

# editor
1. type: editor 类型（select/label/readonly）
2. options: 1) data: editor 控件初始加载数据  2) required: 必填项（目前未实现）

# 方法
1. addRow: 添加行
2. removeRow: 删除行
3. getData: 获取列表所有数据
4. reload:function(data) 根据传入数据，重载列表

# 依赖
jquery 2.0.0+<br/>
bootstrap 3+<br/>
select2<br/>

# 170719 修改记录
1. 添加了 reload 方法

# 170727 修改记录
1. 添加了 multiLabel 参数
2. 增加了同行内标签的重复验证，相同标签将不会重复出现
3. 增加了 readonly 控件类型
