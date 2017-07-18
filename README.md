# jquery-plugin-timecard

1.支持自定义添加删除项目及相关人员<br/>
2.支持 select2 插件选择项目<br/>

# 参数
1. data: json格式数据<br/>
2. columns: 1) field: 字段名称 2) title: 字段标题 3) width: 表格宽度 4) editor: 调用其他插件
3. sourcePool: label标签存放位置
4. success: 加载成功后的回调函数

# editor
1. type: editor 类型（select/label）
2. options: 1) data: editor 控件初始加载数据  2) required: 必填项（目前未实现）

# 依赖
jquery 2.0.0+<br/>
bootstrap 3+<br/>
select2<br/>
