var doc = document.querySelector.bind(document);
var docAll = document.querySelectorAll.bind(document);
var log = console.log;
var gamecontent = doc('.gamecontent');
//创建游戏背景
function creatbg() {
  var divstr = ''
  for (var i = 0; i < 400; i++) {
    divstr += '<div>' + (i + 1) + '</div>'
  }
  return divstr
}
gamecontent.innerHTML = creatbg()

var timer; //蛇移动的定时器
var reddiv = []; //记录除蛇的身体外剩余的方块,根据此数组来随机生成红块
var bgdiv = []; //获取当前所有方块数组

gamecontent.querySelectorAll('div').forEach(item => {
  bgdiv.push(item)
});
//点击开始
doc('.start').onclick = function () {
  clearTimeout(timer)
  gamestart.currentdirection = 'R' //当前移动方向
  gamestart.currentrednum = 0//当前渲染出的红块序列号
  gamestart.snakebody = [0, 1, 2] //蛇的身体数组
  gamestart.movenum=1
  gamestart.init()
}
doc('.pause').onclick = function () {
  if (doc('.pause').value=='暂停'){
      doc('.pause').value='继续'
      clearTimeout(timer)
  }else{
      doc('.pause').value = '暂停'
       gamestart.move()
  }
}

//游戏主要方法
var gamestart = {
  movenum: 1, //移动标量
  currentdirection: 'R', //当前移动方向
  currentrednum: 0, //当前渲染出的红块序列号
  snakebody: [0, 1, 2], //蛇的身体数组
  //当前蛇的身体长度
  bodylen: function () {
    return this.snakebody.length
  },
  //游戏开始
  init: function () {
    $(document).on('keydown', this.keydown.bind(this))
    this.getbodycolor();
    this.move()
    this.getrandom()
  },
  //重置背景色
  resetbgcolor: function () {
    bgdiv.forEach(item => {
      item.style.background = '#333'
    })
  },
  //绘制当前蛇的身体颜色
  getbodycolor: function () {
    this.resetbgcolor();
    this.snakebody.forEach(item => {
      if (item > 0 && item < 400) {
        bgdiv[item].style.background = 'green'
      }
    })
bgdiv[this.snakebody[this.bodylen() - 1]].style.background = 'Lime'
  },
  //移动方法
  move: function () {
    let num = 0
    timer = setInterval(() => {
      this.snakebody.push(this.snakebody[this.bodylen() - 1] + this.movenum)
      this.snakebody.splice(0, 1)
      //判断是否吃到红块
      if (this.snakebody[this.bodylen() - 1] + 1 == this.currentrednum) {
        if (this.currentdirection == 'R') this.snakebody.push((this.currentrednum - 1) + 1)
        if (this.currentdirection == 'L') this.snakebody.push((this.currentrednum - 1) - 1)
        if (this.currentdirection == 'U') this.snakebody.push((this.currentrednum - 1) - 20)
        if (this.currentdirection == 'D') this.snakebody.push((this.currentrednum - 1) + 20)
        this.getrandom()
      }
      //判断上下是否出界
      if (this.snakebody[this.bodylen() - 1] > 400 || this.snakebody[this.bodylen() - 1] < 0) {
        this.resetbgcolor()
        alert('游戏失败!')
        clearInterval(timer)
      }
      //判断左右是否出界
      else if (
        (this.snakebody[this.bodylen() - 1] % 20 == 0 && this.currentdirection == 'R') ||
        ((this.snakebody[this.bodylen() - 1] + 1) % 20 == 0 && this.currentdirection == 'L')) {
        this.resetbgcolor()
        clearInterval(timer)
        alert('游戏失败!')
      } else {

        this.getbodycolor();
        this.randomred()
      }
    }, 200)
  },
  //判断按下的方向键并进行移动
  keydown: function (e) {
    switch (e.keyCode) {
      case 37:
        //左
        if (this.currentdirection == 'R') break;
        this.movenum = -1
        this.currentdirection = 'L'
        break;
      case 38:
        //上
        if (this.currentdirection == 'D') break;
        this.movenum = -20
        this.currentdirection = 'U'
        break;
      case 39:
        //右
        if (this.currentdirection == 'L') break;
        this.movenum = 1
        this.currentdirection = 'R'
        break;
      case 40:
        //下
        if (this.currentdirection == 'U') break;
        this.movenum = 20
        this.currentdirection = 'D'
        break;
    }

  },
  //获取出蛇身体外的红块出现随机数
  getrandom: function () {
    reddiv = bgdiv.filter(item => this.snakebody.indexOf(Number(item.innerHTML - 1)) == -1);
    this.redrandom = Math.ceil(Math.random() * reddiv.length)
    this.currentrednum = Number(reddiv[this.redrandom].innerHTML)
  },
  //渲染红块
  randomred: function () {
    reddiv[this.redrandom].style.background = 'red'
  },
  //重新开始游戏
  restart: function () {
    this.snakebody = [0, 1, 2];
    this.currentdirection = 'R';
    this.getrandom()
    this.randomred()
    this.move()
  },
  //暂停游戏
  pausegame: function () {
    clearInterval(timer)
  }

}
