var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
today.setDate(today.getDate());
var day = today.getDate();
console.log(day);
var week = today.getDay();
var youbi = new Array("日", "月", "火", "水", "木", "金", "土");
var timelist = ['10:00～', '11:00～', '12:00～']
var x = 0;
var daylist = [];
const dwlist = [];
for (var i = 0; i < 7; i++) {
  today.setDate(day + i);
  var dw = today.getDay();
  dwlist[i] = youbi[dw];
  var d = today.getDate();
  daylist[i] = d;
}
console.log(daylist);
var key_today=new Date();
var last_date=new Date();

var day1_year=key_today.getFullYear()+'';
var day1_month=key_today.getMonth()+1+'';
var day1_day=key_today.getDate()+'';
var day1_key='_'+day1_year+day1_month+day1_day;
var start_time='_10';
console.log(day1_key);
var day1_10;
var day1_12;
var day2_10;
var day2_11;
var day2_12;
var day3_10;
var day3_11;
var day3_12;
var day4_10;
var day4_11;
var day4_12;
var day5_10;
var day5_11;
var day5_12;
var day6_10;
var day6_11;
var day6_12;
var day7_10;
var day7_11;
var day7_12;

var items={
  _201914:{
    _10:{
      description:'20191410',
      start_time: 10,
    },
    _12:{
      description:'20191412',
      start_time: 12,
    },
  },
  _20190116:{
    description:'test2',
    user:'nouchi',
    start_time: 12,
  },
  _2019110:{
    _10:{
      description:'201911010',
      start_time: 10,
    },
    _11:{
      description:'201911011',
      start_time: 11,
    },
  },

};

Object.keys(items[day1_key]).forEach(function(key) {
  if(key=='_10'){
    day1_10=items[day1_key][key].description;
  }else if(key=='_11'){
    day1_11=items[day1_key][key].description;
  }else if(key=='_12'){
    day1_12=items[day1_key][key].description;

  }

});

var day1_11;
var day1_11=items[day1_key][start_time].description;
export default {
  name: 'main',
  data() {
    return {
      year: year,
      month: month,
      daylist: daylist,
      dwlist: dwlist,
      timelist: timelist,
      items: items,
      day1_10: day1_10,
      day1_11: day1_11,
      day1_12: day1_12,
      day2_10: day2_10,
      day2_11: day2_11,
      day2_12: day2_12,
      day3_10: day3_10,
      day3_11: day3_11,
      day3_12: day3_12,
      day4_10: day4_10,
      day4_11: day4_11,
      day4_12: day4_12,
      day5_10: day5_10,
      day5_11: day5_11,
      day5_12: day5_12,
      day6_10: day6_10,
      day6_11: day6_11,
      day6_12: day6_12,
      day7_10: day7_10,
      day7_11: day7_11,
      day7_12: day7_12,
    }
  },

  methods: {
    nextWeek: function() {

      last_date.setDate(last_date.getDate() + 6);

      for (var y = 0; y < 7; y++) {
        last_date.setDate(last_date.getDate() + 1);
        var x = last_date.getDate();
        this.daylist.splice(y, 1, x);

      };
      key_today.setDate(key_today.getDate() + 6);

       day1_year=key_today.getFullYear()+'';
       day1_month=key_today.getMonth()+1+'';
       day1_day=key_today.getDate()+'';
       day1_key='_'+day1_year+day1_month+day1_day;
       console.log(day1_key);

      Object.keys(items[day1_key]).forEach(function(key) {
        if(key=='_10'){
          day1_10=items[day1_key][key].description;
        }else if(key=='_11'){
          day1_11=items[day1_key][key].description;
        }else if(key=='_12'){
          day1_12=items[day1_key][key].description;
        }

      });

    },
    lastweek: function(){
      for (var y = 6; y > -1; y--) {
        last_date.setDate(last_date.getDate() - 1);
        console.log(today);
        var x = last_date.getDate();
        console.log(x);
        this.daylist.splice(y, 1, x);
      }
      console.log(daylist);
    }
  },

  created: function() {

  }

}
