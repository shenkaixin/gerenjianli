// 管理第一个块 loading
function loading() {
    // 要操作的DOM进度条  整个盒子
    // 控制进度条的长度:根据已经加载的图片个数
    // 进度条加载完成之后，让盒子消失
    let $progressBar = $('.progressBar'),
        $loadingBox = $('.loadingBox'),
        $phoneBox = $('.phoneBox');
    // 这个数组里放的都是本项目要用到的所有图片
    let ary = ['phone-bg.jpg', 'phone-listen.png', 'phone-key.png', 'phone-logo.png', 'phone-name.png', 'message-head1.png', 'message-head2.png', 'message-keyboard.png', 'cube-bg.jpg', 'cube-img1.png', 'cube-img2.png', 'cube-img3.png', 'cube-img4.png', 'cube-img5.png', 'cube-img6.png', 'cube-tip.png', 'menu-icon.png', 'concat-address.png', 'concat-icon1.png', 'concat-icon2.png', 'course-icon1.png', 'course-icon2.png', 'course-icon3.png', 'course-icon4.png', 'course-icon5.png', 'course-icon6.png', 'course-icon7.png', 'course-pocket.png', 'school-bot1.png', 'school-bot2.png', 'school-img1.jpg', 'school-img2.jpg', 'school-img3.jpg', 'teacher-title.png', 'zf-detailsReturn.png', 'zf-jobTable.png', 'zf-teacher1.png', 'zf-teacher2.png', 'zf-teacher3.jpg', 'zf-teacher4.png', 'zf-teacher5.png', 'zf-teacher6.png'];
    // 计数器  onload
    let n = 0;

    ary.forEach(item => {
        let temp = new Image(); // 创造一个临时图片
        temp.src = `./images/${item}`; // 图片的地址
        temp.onload = load; // 该图加载完成之后
    })

    function load() {
        n++;
        if (n === ary.length) {
            // 所有图片加载完成
            $progressBar.css({
                width: '100%'
            })
            $loadingBox.css({
                opacity: 0
            })
            let timer = setInterval(() => {
                clearInterval(timer)
                $loadingBox.css({
                    display: 'none'
                })
                phone();
            }, 1800) // 让盒子变透明一共用了1s+0.8s
        } else {
            $progressBar.css({
                width: 'n / ary.length * 100%'
            })
        }
    }
}
loading();
// 管理第二个块 phoneBox
function phone() {
    let bell = $('#bell')[0],
        music = $('#music')[0],
        say = $('#say')[0];
    bell.play();
    // 当音频能播放时做的事
    bell.addEventListener('canplay', function () {})
    // 点击接听按钮，让接听盒子消失；挂机盒子升上来，时间盒子显示
    let $phoneBox = $('.phoneBox'),
        $listenBox = $phoneBox.find('.listenBox'),
        $listenBtn = $listenBox.find('.listenBtn'),
        $noBox = $phoneBox.find('.no_listenBox'),
        $noBtn = $noBox.find('.no_listenBtn'),
        $timeBox = $phoneBox.find('.timeBox');
    let timer = null;
    $listenBox.tap(function () {
        $listenBox.hide();
        $noBox.css({
            transform: 'translateY(0)'
        });
        bell.pause();
        say.play();
        // 控制音频播放时间的显示
        $timeBox.show();
        say.oncanplay = function () {
            timer = setInterval(() => {
                // 音频 currentTime  当前的播放时间
                //      ended  音频是否播放完毕  true  完毕
                //      paused 音频是否处于暂停状态  true 暂停
                let x = say.currentTime.toFixed(0);
                let str = '00:' + (x < 10 ? '0' + x : x);
                $timeBox.html(str);
                if (say.ended) {
                    // 音频被暂停
                    clearInterval(timer);
                    next();
                }
            }, 1000)
        }
    })

    function next() {
        $phoneBox.css({
            transform: 'translateY(100%)'
        });
        msg();
    }
    $noBtn.tap(function () {
        next();
        clearInterval(timer);
        say.pause();
    });
}
// 管理消息模块
function msg() {
    music.play();
    let $msgBox = $('.msgBox'),
        $lis = $msgBox.find('li'),
        $keyBoard = $msgBox.find('.keyBoard'),
        $textBox = $keyBoard.find('.textBox'),
        $btn = $keyBoard.find('.btn'),
        $ul = $msgBox.find('ul');
    // 设置每条：用CSS先把他们都向下挪动并且是透明的
    // 通过JS设置，让他们回到原位即可
    let moveTimer = null;
    let n = 0; // 出现条的索引
    let h = 0; // ul的上移高度
    // 通过定时器实现一条一条的出现
    function move() {
        moveTimer = setInterval(() => {
            if (n === $lis.length) {
                clearInterval(moveTimer);
                return;
            }
            $lis.eq(n).css({
                opacity: 1,
                transform: 'translateY(0)'
            });
            if (n == 2) {
                clearInterval(moveTimer);
                // 让键盘升上来
                $keyBoard.css({
                    transform: 'translateY(0)'
                });
                let timer = setInterval(() => {
                    // 让键盘停稳之后再让字体出现
                    clearInterval(timer);
                    input();
                }, 1800)
            }
            // 让整个ul上移，每次移动出现的li的高度
            if (n >= 3) {
                h += $lis[n].offsetHeight; // 获取到的就是以px为单位;
                $ul.css({
                    transform: `translateY(-${h}px)`
                })
            }
            n++;
        }, 1400)
    }
    move();

    function input() {
        let str = '我们现在使用的是VUE和REACT';
        let str2 = ''; // 用来存储拼接好的字符串
        let m = 0;
        let timer = null;
        timer = setInterval(() => {
            if (m === str.length) {
                // 字体输入完成
                $btn.show();
                clearInterval(timer);
                return;
            }
            str2 += str[m];
            m++;
            $textBox.html(str2);
        }, 100)
    }
    // 点击发送按钮 重启定时器；发送该条数据
    $btn.tap(function () {
        $lis.eq(n).css({
            opacity: 1,
            transform: 'translateY(0)'
        })
        // 让发送当前这条数据时ul上移
        h += $lis[n].offsetHeight;
        $ul.css({
            transform: 'translateY(-${h+40}px)'
        })
        n++;
        $textBox.html('');
        $keyBoard.css({
            transform: 'translateY(4.1rem)',
            transition: 'all 0.8s' // 去除过渡效果的延迟效应
        })
        move(); // 重启定时器
    })
}