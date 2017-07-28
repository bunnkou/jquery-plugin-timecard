(function($) {
	
	var Timecard = function(element, options){
		this.element = $(element);
		if(options){
			this.data = options.data || "";
			this.sourcePool = $('#'+ options.sourcePool);
			this.callback = options.success;
			this.CUR_ROW_IDX = -1;
			this.INIT_PERSONS = [];
			this.multiLabel = options.multiLabel || false;
			this.model = [];
			this.columns = options.columns[0];
			this.inputObj = null;
			this.css_prefix = "timecard-";
			this.css1 = "timecard-title";
			this.css2 = "timecard-persons";
			this.init();
		}
	};
	
	Timecard.prototype = {
		
		init: function(){		//初始化
			if( this.data ){
				for (var i=0; i<this.data.length; i++){
					this.addRow(this.data[i]);
				}
				//初始化完成操作
				this.INIT_PERSONS = this.setInitPersons(this.data);
			}
			this.CUR_ROW_IDX = -1;
			this.callback(this);
		},
		
		setColumns: function(o, tr){
			//{field:'title', width:'80%', editor:{type:'select', options:{data:sData}} },
			var IS_EDITING = $(tr).attr('IS_EDITING')==undefined?false:true;
			$(tr).html("");
			for (var i=0, col, editor, type, html; i<this.columns.length; i++){
				col = this.columns[i];
				editor = col.editor;
				html = '<td class="'+this.css_prefix+col.field+'" width="'+col.width+'"';
				if (typeof(col.hidden)!="undefined") html += ' style="display:none;"';
				html += '></td>';
				$(tr).append(html);
				if (typeof(editor)=="undefined") type = "readonly";
				else type = editor.type;
				if (type=="readonly"){
					var text = eval('o.'+col.field);
					$(tr).find('.'+this.css_prefix+col.field).html(text);
				}else if(type=="label") {
					this.OperatePerson(o.persons, 'add', tr);
				}else{
					var text = eval('o.'+col.field),
						value = text;
					if (type=="select") text = this.Select2_getTextById(editor.options.data, value);
					this.inputObj = text;
					if (IS_EDITING){
						this.inputObj = document.createElement(type);
						$(this.inputObj).addClass(this.css_prefix+'input-'+type).css('width','50%');
					}
					$(tr).find('.'+this.css_prefix+col.field).html( this.inputObj ).attr('val',value);
					if (IS_EDITING & type=="select"){
						$(this.inputObj).select2({data:editor.options.data}).val( value ).trigger("change");
					}
				}
			}
		},
		
		Select2_getTextById: function(S2_Data, id){
			//{"id":"", "text":""}
			for (var i=0; i<S2_Data.length; i++){
				if (S2_Data[i].id==id) return S2_Data[i].text;
			}
			return "";
		},
		
		getRowData: function(index){
			//{field:'title', width:'80%', editor:{type:'select', options:{data:sData}} }
			if (typeof(index)!="number") index = this.CUR_ROW_IDX;
			var rowData = [],
				tr = this.element.find("tr").eq(index),
				IS_EDITING = tr.attr('IS_EDITING')==undefined?false:true;
			
			for (var i=0, col, editor, type, value; i<this.columns.length; i++,value=""){
				col = this.columns[i];
				editor = col.editor;
				if (typeof(editor)=="undefined") type = "readonly";
				else type = editor.type;
				if (type=="readonly"){
					value = tr.find('.'+this.css_prefix+col.field).text();
				}else if (type=="label"){
					tr.find('.'+this.css_prefix+col.field+' > a').each(function(i, n){
						if (value) value += ",";
						value += $(n).text();
					});
					if(value) value = value.split(',');
				}else{
					if(IS_EDITING){
						value = tr.find(type).val();	
					}else{
						value = tr.find('.'+this.css_prefix+col.field).attr('val');
					}
				}
				if(value) eval('rowData.'+col.field+'="'+value+'"');
			}
			return rowData;
		},
		
		addRow: function(o){		//添加行
			var that = this,
				tr = document.createElement('tr'),
				IS_NEW = false;
			if (!o) {
				o = [];
				o.title = '';
				o.persons = '';
				IS_NEW = true;
			}
			$(tr).bind('click', function(){
				that.BeginEditing(this);
			});
			this.element.append(tr);
			if (IS_NEW) tr.click();
			else this.setColumns(o, tr);
		},
		
		removeRow: function(){		//删除行
			if (this.CUR_ROW_IDX<0) return;
			var tr = this.element.find('tr').eq(this.CUR_ROW_IDX),
				rowData = this.getRowData();
			this.OperatePerson(rowData.persons, "remove");
			$(tr).remove();
			this.CUR_ROW_IDX=-1;
		},
		
		reload: function(o){			//重载
			this.element.html("");
			this.sourcePool.html("");
			this.data = o;
			this.init();
		},
		
		OperatePerson: function(o, opt, tr){		//操作人员
			var target = null,
				that = this,
				oArr = [];
			if (tr){
				target = $(tr).find('.'+this.css2);
			}else{
				if (opt=="add"){
					if (this.CUR_ROW_IDX<0) return;
					target = this.element.find("tr").eq(this.CUR_ROW_IDX).find('.'+this.css2);
				}else{
					target = this.sourcePool;
				}
			}
			if (target == null) return;
			if (typeof(o) == 'string'){
				if (o=="" | o=="undefined") return;
				if (o.indexOf(",")!==-1) oArr = o.split(",")	//string to array
				else oArr[0] = o;								//string
			}else{
				if (typeof(o) == 'undefined') return;			//null
				if (o.length == undefined) oArr[0] = o;			//object
				else oArr = o;									//array
			}
			for (var i=0, nObj, labelArea, IS_OBJ, IS_EXISTS; i<oArr.length; i++){
				IS_OBJ = IS_EXISTS = false;
				if (typeof(oArr[i])=="object"){
					nObj = $(oArr[i]).clone();
					IS_OBJ = true;
				}else{
					nObj = $(document.createElement('a'));
					nObj.html(oArr[i]);
				}
				nObj.removeClass().addClass("btn btn-default btn-sm");
				nObj.bind('click', function(){
					that.OperatePerson(this, opt=="add"?"remove":"add");
					that.element.trigger('label-click', [this]);
				});
				labelArea = target.find('a');
				for( var j=0; j<labelArea.length; j++ ){
					if(labelArea[j].text == $(nObj).text()){
						IS_EXISTS = true;
						break;
					}
				}
				if (!IS_EXISTS) target.append( nObj );
				if (this.multiLabel & opt=="add") IS_OBJ = false;		//允许重复选择
				if (IS_OBJ) o.remove();
			}
		},
		
		BeginEditing: function( tr ){		//单击行事件
			if ($(tr).attr('IS_EDITING')) return;
			if (!this.FinishEditing()) return;
			this.CUR_ROW_IDX = this.element.find("tr").index( tr );
			tr = $(tr);
			var rowData = this.getRowData();
			tr.attr('IS_EDITING', true).css('backgroundColor', '#66CCCC');
			this.setColumns(rowData, tr);
		},
		
		FinishEditing: function(){		//完成行编辑
			if(this.CUR_ROW_IDX<0) return true;	
			var tr = $(this.element.find("tr").eq(this.CUR_ROW_IDX));
			if (typeof(tr.attr('IS_EDITING'))=='undefined') return true;	//当前行不在编辑状态
			var rowData = this.getRowData();
			tr.css('backgroundColor', '');
			tr.removeAttr('IS_EDITING');
			this.setColumns(rowData, tr);
			this.CUR_ROW_IDX = -1;
			return true;
		},
		
		getData: function(opt){
			var that = this,
				data = [];
			if (opt!="uncheck"){
				if (!this.FinishEditing()) return false;
			}
			this.element.find('tr').each(function(i, n){
				data.push(that.getRowData(i));
			});
			return data;
		},
		
		setInitPersons: function(oData){		//记录初始化人员
			var tmpStr = "",
				tmpArr = [];
			for (var i=0; i<oData.length; i++){
				if (tmpStr) tmpStr += ",";
				tmpStr += oData[i].persons;
			}
			tmpArr = tmpStr.split(',');
			return tmpArr;
		}
	};
	
	$.fn.timecard = function(){
		var arg = arguments,
			internal_return;
		
		var options = $.extend({
			success: function(){}
		}, arguments[0] || {});
			
		this.each(function(){
			var $this = $(this),
				data = $this.data('timecard');
			if(!data){
				$this.data('timecard', (
						data = new Timecard( this, $.extend({}, $.fn.timecard.defaults, options) )
					)
				);
			}else{
				var param = arg.length>1?arg[1]:"";
				if(arg)	internal_return = eval('data.'+arg[0]+'(param)');
			}
		});
		if (internal_return !== undefined) return internal_return;
		else return this;
	};
	
	$.fn.timecard.defaults = {};
			
})(jQuery);