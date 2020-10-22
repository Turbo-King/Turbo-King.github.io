

'use strict';

         window.onload = function(){
            myGame.init();
         }

         var myGame = {

            data : {  //�ɻ�����

                BULLET : {
                    p:{name:'b1',speed:30},
                    e:{name:'b2',speed:30}
                },

                PLANE : {},

                eArr : [2,1,1,3,3,1,1,3,3,0,
                        0,0,0,0,0,0,0,0,0,0,
                        0,0,0,0,0,0,0,0,0,0,
                        0,0,0,0,0,0,0,0,0,0,
                        0,0,0,0,1,2,0,0,0,0,
                        3,3,2,3,3,1,1,3,3,2],

                ENEMY : {

                    blood : [2,10,20,5],
                    score : [2,20,50,10],
                    speed : [1,3,1,2],
                    bullet : [false,false,false,true],
                    _width : [126,108,126,120],
                    _height : [81,81,87,101]

                }

            },

            init : function(){ //��ʼ��

                var layout = document.getElementById('layout'),
                    mystart = document.getElementById('start'),
                    score = document.getElementById('score'),
                    That = this;

                this.layout = layout;
                this.mystart = mystart;
                this.score = score;

                document.getElementById('startBtn').onclick = function() {
                    mystart.style.display = 'none';
                    That.createPlane();
                    document.getElementsByClassName('score')[0].style.display = 'block';
                    document.getElementById("fire").play();

                };

            },

            createPlane : function(){  //�����ɻ�

                var That = this;

                var plane = document.createElement('div');
                plane.className = 'plane';
                plane.style.width = '110px';
                plane.style.left = (this.layout.offsetWidth - plane.offsetWidth) / 2 + 'px';
                this.layout.append( plane );

                this.plane = plane;

                plane.itimer1 = setInterval(function(){
                    That.createBullet(That.data.BULLET.p.name,plane, 0, 1);
                },150);

                this.bindPlane(plane);

                plane.itimer2 = setInterval(function(){
                    That.createEnemy();
                },1000)
            },

            createEnemy : function(){   //�����л�

                var e = this.data.eArr[~~(Math.random()*60)];

                var ey = document.createElement('div');
                ey.className = 'enemy enemy' + e;

                ey.style.cssText = 'width:' + this.data.ENEMY._width[e] + 'px; height:' + this.data.ENEMY._height[e] + 'px';

                ey.style.left = ~~(Math.random()*(this.layout.offsetWidth - this.data.ENEMY._width[e])) + 'px';
                ey.setAttribute('blood', this.data.ENEMY.blood[e]);
                ey.setAttribute('score', this.data.ENEMY.score[e]);
                ey.setAttribute('speed', this.data.ENEMY.speed[e]);
                ey.setAttribute('bullet', this.data.ENEMY.bullet[e]);

                this.layout.append(ey);

                //�ӵ���ײ
                if(this.data.ENEMY.bullet[e]){
                    var That = this;
                    ey.timer1  = setInterval(function(){
                        That.createBullet(That.data.BULLET.e.name,ey, ey.offsetHeight, -1);
                    },2000);

                }

                this.runEnemy(ey);
            },

            runEnemy : function(obj){   //�л��˶�
                var That = this;
                obj.timer = setInterval(function(){

                    obj.style.top = (obj.offsetTop + parseInt(obj.getAttribute('speed'))) + 'px';

                    if(obj.offsetTop > That.layout.offsetHeight){
                        clearInterval(obj.timer);
                        obj.parentNode.removeChild(obj);
                    };

                    for(var i = 0, e = document.getElementsByClassName('enemy') ,len = e.length; i<len; i++){
                        if(That.TC(e[i],That.plane) ){  //��л���ײ]

                            clearInterval(obj.timer);
                            That.gameOver();
                            That.plane.parentNode.removeChild(That.plane);
                            That.plane = null;
                            e[i].parentNode.removeChild(e);

                        }
                    }

                },30)
            },

            createBullet : function(name, obj, h, direction){  //�����ӵ�

                var bt = document.createElement('div');
                bt.className = name;

                var _p = obj;

                bt.style.top = (_p.offsetTop + h - bt.offsetHeight * direction) - 10 + 'px';
                bt.style.left = (_p.offsetLeft + _p.offsetWidth/2) - 4 + 'px';

                this.layout.append(bt);

                if(bt.classList.contains('b1')){
                   this.runBullet(bt,0,-30);
                }else{

                    this.speedDecomposition(this.plane,bt);
                    this.runBullet(bt,this.vx,this.vy);

                }
            },

            speedDecomposition : function(pl,bt){   //����л��ӵ����򣬻���ɻ�

                var plleft = pl.offsetLeft,
                    pltop = pl.offsetTop,
                    btleft = bt.offsetLeft,
                    bttop = bt.offsetTop,

                    s = Math.sqrt((plleft - btleft)*(plleft - btleft) + (pltop - bttop)*(pltop - bttop)),
                    sin = (pltop - bttop) / s,
                    vy = 5*sin,
                    vx = Math.sqrt(5*5 - vy * vy);

                this.vy = vy;
                plleft > btleft ? this.vx = vx : this.vx = -vx;

            },

            runBullet : function(b,x,y){   //�ӵ��˶�

                var That = this;

                b.timer = setInterval(function(){

                    if(b.offsetTop <= 30 || b.offsetTop >= That.layout.offsetHeight || b.offsetLeft <= 0 || b.offsetLeft >= That.layout.offsetWidth){   //�߽��ж�

                        clearInterval(b.timer);
                        That.layout.removeChild(b);

                    }else{

                       b.style.cssText = 'top : ' + (b.offsetTop + y) + 'px; left : ' + (b.offsetLeft + x) + 'px';

                    }

                    for(var i = 0, EN = document.getElementsByClassName('enemy'), len = EN.length ; i < len ; i++ ){

                        if(That.TC(EN[i],b) && b.classList.contains('b1')){

                            clearInterval(b.timer);
                            That.layout.removeChild(b);
                            var Blood = EN[i].getAttribute('blood') - 1;

                            if(Blood){
                                EN[i].setAttribute('blood',Blood);
                            }else{

                                document.getElementById("boom").play();
                                That.score.innerHTML = (parseInt(That.score.innerHTML) + parseInt(EN[i].getAttribute('score')));
                                EN[i].style.background = 'url(img/qw.png) center no-repeat / cover';
                                var pare = EN[i];
                                EN[i].classList.remove("enemy");
                                EN[i].timer = setTimeout(function(){That.layout.removeChild(pare)},400);
                            }

                        }

                    }

                    if(That.TC(That.plane,b) && b.classList.contains('b2')){

                        clearInterval(b.timer);
                        That.layout.removeChild(b);
                        That.layout.removeChild(That.plane);
                        That.gameOver();

                    }

                },30)
            },

            bindPlane : function(p){   //���Ʒɻ�����¼�

                var lagoutx = this.layout.offsetLeft,
                    lagouty = this.layout.offsetTop,

                    lagoutw = this.layout.offsetWidth,
                    lagouth = this.layout.offsetHeight;

                p.onmousedown = function(event){

                    var px = p.offsetLeft,
                        py = p.offsetTop,

                        dx = event.clientX - lagoutx - p.offsetWidth/2,
                        dy = event.clientY - lagouty - p.offsetHeight/2;

                    document.onmousemove = function(event){

                        dx = event.clientX - lagoutx - p.offsetWidth / 2;
                        dy = event.clientY - lagouty - p.offsetHeight / 2;

                        if( dx <= 0 ){
                            dx = 0 ;
                        }else if( dx >= lagoutw - p.offsetWidth){
                            dx = lagoutw - p.offsetWidth;
                        }

                        if( dy <= 0 ){
                            dy = 0;
                        }else if( dy >= lagouth - p.offsetHeight){
                            dy =  lagouth - p.offsetHeight;
                        }

                        p.style.cssText = 'left :' + dx +'px; top :' + dy + 'px';

                    }

                    document.onmouseup = function(event){

                        document.onmousemove = null;

                    }

                }
            },

            gameOver : function(){

                document.getElementById("fire").pause();
                document.getElementById('bigboom').play();

                clearInterval(this.plane.itimer2);
                clearInterval(this.plane.itimer1);

                this.mystart.style.display = 'block';
                document.getElementsByClassName('score')[0].style.display = 'none';
                document.getElementById('name-over').getElementsByTagName('i')[0].innerHTML = 'GAME OVER!';
                document.getElementById('name-over').getElementsByTagName('p')[0].innerHTML = this.score.innerHTML;
                document.getElementById('startBtn').value = 'AGAIN';

                while(this.layout.hasChildNodes()){
                    this.layout.removeChild(this.layout.firstChild);
                };

                this.score.innerHTML = '0';

            },

            TC : function(obj1,obj2){   //��ײ���

                var t1 = obj1.offsetTop,                      //��
                    r1 = obj1.offsetLeft + obj1.offsetWidth,  //��
                    b1 = obj1.offsetTop + obj1.offsetHeight,  //��
                    l1 = obj1.offsetLeft,                     //��

                    t2 = obj2.offsetTop,                      //��
                    r2 = obj2.offsetLeft + obj2.offsetWidth,  //��
                    b2 = obj2.offsetTop + obj2.offsetHeight,  //��
                    l2 = obj2.offsetLeft;                     //��

                if(t1 > b2 || b1 < t2 || r1 < l2 || l1 > r2){
                    return false;
                }else{
                    return true;
                }
            },
         }