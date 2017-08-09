Zepto.datepicker = function(target){      
    var datepicker = {  
        init : function(){  
            this._target = target;          
            //this._date;  
            if(this._target.attr('value')){
            	this._date = this._target.attr('value');
            	this._year = parseInt(this._date.split('-')[0]);
	            this._month = parseInt(this._date.split('-')[1]);
	            this._day = parseInt(this._date.split('-')[2]);
	            this.before_date = this._target.attr('value');
            	this.before_year = parseInt(this.before_date.split('-')[0]);
	            this.before_month = parseInt(this.before_date.split('-')[1]);
	            this.before_day = parseInt(this.before_date.split('-')[2]);
            }else{
            	this._date = new Date();
            	this._year = this._date.getFullYear();
	            this._month = this._date.getMonth() + 1;
	            this._day = this._date.getDate();
	            this.before_date = new Date();
	            this.before_year = this._date.getFullYear();
	            this.before_month = this._date.getMonth() + 1;
	            this.before_day = this._date.getDate();
            }
            this.today_date = new Date();
        	this.today_year = this.today_date.getFullYear();
            this.today_month = this.today_date.getMonth() + 1;
            this.today_day = this.today_date.getDate();
            //this._formatDate();
        },  
        bind: function(){  
            this._picker = (function(){  
                var arr = [];  
                arr.push('<div class="datepicker-box">');  
                arr.push('  <div class="datepicker-header">');  
                arr.push('      <span class="datepicker-pre"><b></b></span>');   
                arr.push('      <h4></h4>');
                arr.push('      <span class="datepicker-next"><b></b></span>'); 
                arr.push('  </div>');  
                arr.push('  <table class="datepicker-body">');  
                arr.push('      <thead>');  
                arr.push('          <tr>');  
                arr.push('              <th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="datepicker-weekend">六</th><th class="datepicker-weekend">日</th>');  
                arr.push('          </tr>');  
                arr.push('      </thead>');  
                arr.push('      <tbody>');  
                arr.push('      </tbody>');  
                arr.push('  </table>');  
                arr.push('</div>');  
                return $(arr.join(''));  
            })();  
            this._generateDays();  
      
            var p = this;  
            this._picker.find('span').on('touchstart', function(){  
                $(this).addClass('hover');  
            }).on('touchend', function(){  
                $(this).removeClass('hover');  
            }).click(function(){  
                if($(this).hasClass('datepicker-pre')){  
                    p._month = (p._month - 1);  
                } else {  
                    p._month = (p._month + 1);  
                }        
                console.log(p._month, this._month)         
                p._generateDays();  
            });           
              
            this._picker.click(function(e){  
                e.preventDefault();  
                e.stopPropagation();  
            });  
              
            $(document).click(function(e){
            	if($(e.target).parents(p._target.selector).length == 0){
            		if(e.target != p._picker[0] && e.target != p._target[0]){  
	                    p._picker.hide();  
	                    $('.datepicker-all').hide();
	                } 
            	}
            });  
            return this;  
        },  
        insert : function(){  
            //this._picker.insertAfter(this._target);  
            $('.datepicker-bottom').html(this._picker);
            //this._picker.insertAfter($('#datepicker-bottom'));
        },  
        show : function(){  
            this._picker.show();  
        },  
        hide : function(){  
            this._picker.hide();  
            $('.datepicker-all').hide();
        },  
        _generateDays : function(){  
            var year = this._year  
                , month = this._month  
                , day = this._day
                , days = new Date(new Date(year, month, 1) - 24*60*60*1000).getDate()  
                , week = (function(){  
                        var tDate = new Date(year, month-1, 1);  
                        var week = tDate.getDay();  
                        if(week == 0){  
                            week = 7;  
                        }  
                        return week;  
                    })();  
            var fullYear = new Date(year, month, 1).getFullYear();
            var fullDay = new Date(year, month, 1).getMonth();
            if(fullDay == 0){
                fullDay = 12;
                fullYear = fullYear - 1;
            }
            this._picker.find('h4').html(fullYear + '-' + fullDay);  
      
            var arr = []  
                , d = 1;  
                  
            arr.push('<tr>');  
            for(var j = 1; j < week; j ++){  
                arr.push('<td>&nbsp;</td>');  
            }  
            for(var j = week; j < 8; j ++, d ++){  
                arr.push('<td class="datepicker-td'); 
                console.log(this.before_month)
                if((d == this._day) && (month == this.before_month) && (year == this.before_year)){  
                    arr.push(' cur');  
                }else if((d == this.today_day) && (month == this.today_month) && (year == this.today_year)){  
	                arr.push(' today');  
                } 
                if(j >= 6){  
                    arr.push(' datepicker-weekend');  
                }  
                arr.push('">');  
                arr.push(d);  
                arr.push('</td>');  
            }  
            arr.push('</tr>');  
              
            for(var i = 0, l = Math.ceil((days + week) / 7) - 2; i < l; i ++){             
                arr.push('<tr>');  
                for(var j = 1; j < 8; j ++, d ++){  
                    arr.push('<td class="datepicker-td'); 
                    console.log(this.before_month)
                    if((d == this._day) && (month == this.before_month) && (year == this.before_year)){  
	                    arr.push(' cur');  
	                }else if((d == this.today_day) && (month == this.today_month) && (year == this.today_year)){  
		                arr.push(' today');  
	                } 
                    if(j >= 6){  
                        arr.push(' datepicker-weekend');  
                    }  
                    arr.push('">');  
                    arr.push(d);  
                    arr.push('</td>');  
                }  
                arr.push('</tr>');  
            }  
              
            var l = days - d + 1;  
            if(l != 0){  
                arr.push('<tr>');  
                for(var i = 0; i < l; i ++, d ++){  
                    arr.push('<td class="datepicker-td');
                    console.log(this.before_month)
                    console.log(d, this._month, this._year, this.before_day, this.before_month, this.before_year) 
                    if((d == this._day) && (month == this.before_month) && (year == this.before_year)){  
	                    arr.push(' cur');  
	                }else if((d == this.today_day) && (month == this.today_month) && (year == this.today_year)){  
		                arr.push(' today');  
	                } 
                    if(i >= 6){  
                        arr.push(' datepicker-weekend');  
                    }  
                    arr.push('">');  
                    arr.push(d);  
                    arr.push('</td>');  
                }  
                for(var i = l + 1; i < 8; i ++){  
                    arr.push('<td>&nbsp;</td>');  
                }  
                arr.push('</tr>');  
            }  
            this._picker.find('tbody')[0].innerHTML = arr.join('');  
              
            var p = this;  
            this._picker.find('.datepicker-td').unbind().on('touchstart', function(){  
                $(this).addClass('hover');  
            }).on('touchend', function(){  
                $(this).removeClass('hover');  
            }).click(function(){  
                p._picker.find('.datepicker-td').removeClass('cur');  
                $(this).addClass('cur');  
                var day = parseInt($(this).text(), 10);  
                p._date = new Date(year, month - 1, day);
                p._year = p._date.getFullYear();
	            p._month = p._date.getMonth() + 1;
	            p._day = p._date.getDate(); 
                p.hide();  
                $('.datepicker-all').hide();
                p._formatDate();  
            });  
        },  
        _formatDate: function(){  
            var weekDays = ['日', '一', '二', '三', '四', '五', '六'];  
            var $t = this._target.find('.value-span');
            //this._target.find('.value-span').text(this._date.getFullYear() + '年' + (this._date.getMonth() + 1) + '月' + this._date.getDate() + '日（周' + weekDays[this._date.getDay()] + '）');
            if($t.is('input')){
                $t.val(this._date.getFullYear() + '年' + (this._date.getMonth() + 1) + '月' + this._date.getDate() + '日');  
            }else{
                $t.text(this._year + '-' + this._month + '-' + this._day); 
                this._target.attr('value', this._year + '-' + this._month + '-' + this._day);  
            }

        }  
    };  
      
    //datepicker.init();  
      
    var initialised = false;  
      
    var self = this;  
    target.click(function(){
        datepicker.init(); 
        if(!initialised){
            datepicker.bind().insert();  
            initialised = true;  
        }  
        $('.datepicker-all').show();
        datepicker.show();  
    });  
};  
  
$.fn.datepicker = function(options){  
    $.datepicker(this);  
}; 