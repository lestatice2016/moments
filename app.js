var userName = '阿信';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '怪兽',
    avatar: './img/avatar2.png'
  }, 
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  }, 
  reply: {
    hasLiked: false,
    likes: ['石头', '玛莎'],
    comments: [{
      author: '石头',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '冠佑',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '林宥嘉',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '好听哦!',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['怪兽'],
    comments: []
  }
}, {
  user: {
    name: '周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '冠佑',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  }, 
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];
// var index;//点击项索引
var mark=false;//是否弹出点赞面板

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param  likes 点赞人列表
 * @return  返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param  likes 点赞人列表
 * @return  返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param  replyData 消息的评论点赞数据
 * @return  返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param  pics 多图片消息的图片列表
 * @return  返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 分享消息模板
 */
function shareTpl(share) {
 var htmlText = [];
 htmlText.push('<div class="item-share">');
 htmlText.push('<img class="share-img" src="'+ share.pic+'">');
 htmlText.push('<p class="share-tt">'+share.text+'</p></div>');
 return htmlText.join('');
}
/**
* 单张图片模板
*/
function onlyImgTpl(pic) {
  var htmlText=[];
  htmlText.push('<img class="item-only-img" src="'+pic[0]+'">');
  return htmlText;
}
/**
 * 回复按钮模板
 */
function replyBtnTpl(node) {
    node.before('<div class="operPanel"></div>');
    var name = node.parents('.item-right').find('.item-name').text();
    var index = findIndex(name);
    node.parents('.moments-item').attr('data-index',index);
    var like = data[index].reply.hasLiked ? '取消' : '点赞';
    var htmlText = [];
    htmlText.push('<div class="oper-like">');
    htmlText.push('<img class="icon-like"><span class="oper-font">' + like + '</span></div>');
    htmlText.push('<div class="oper-reply">');
    htmlText.push('<img class="icon-comment"><span class="oper-font">评论</span></div>');
    $('.operPanel').html(htmlText.join(''));
}


/**
 * 消息
 * @param {Object} messageData 对象
 */ 
function messageTpl(messageData) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="0">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  htmlText.push('<div class="item-right">');
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
      // 分享消息
    case 1:
      contentHtml = shareTpl(content.share);
      break;
      // 单张图片消息
    case 2:
      contentHtml =onlyImgTpl(content.pics);
      break;
      // 文本消息
    case 3:
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  var messageHtml='';
  for(var i=0,len=data.length;i<len;i++){
      messageHtml += messageTpl(data[i]);
  }
  $momentsList.html(messageHtml);
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  bindOper();
  bindImg();
}

/**
 * 回复按钮绑定事件函数：bindOper
 */
function bindOper() {
    $('.item-reply-btn').on('click',function (event) {
        event.stopPropagation();
        if (!mark) {
            mark=true;
            replyBtnTpl($(this));
            bindLike($(this));
            bindReply($(this));
        }else {
            mark=false;
            $('.operPanel').remove();
        }
    });
    $(document.body).on('click',function (event) {
        if (mark){
            mark = false;
            var name=event.target.className;//可能获得一个数组
            if (name.indexOf('item-reply-btn')=== -1)
                $('.operPanel').remove();
        }
    });
}
/**
 * 点赞事件函数:bindLike
 * @param node 即item-reply-btn
 */
function bindLike(node) {
  $('.oper-like').on('click',function (event) {
      event.stopPropagation();
      var index = node.parents('.moments-item').attr('data-index');
      data[index].reply.hasLiked = !data[index].reply.hasLiked;
      var hasLiked = data[index].reply.hasLiked;
      var str = hasLiked ? '取消' : '点赞';
      node.parents('.item-ft').find('.oper-like .oper-font').text(str);
      var len = data[index].reply.likes.length;
      var reply_like = node.parents('.item-right').find('.reply-like');
      var reply_zone = node.parents('.item-right').find('.reply-zone');

      if (hasLiked) {
          data[index].reply.likes.push(userName);
          //根据原来是否有人点赞,来判断是新建节点还是追加内容
          if (len > 0) {
              reply_like.append(',<a class="reply-who" href="#">' + userName + '</a>');
          } else {
              reply_zone.prepend(likesHtmlTpl(data[index].reply.likes));
          }
      }else {
          for(var i=0;i<len;i++){
              if (data[index].reply.likes[i] === userName)
              {
                  data[index].reply.likes.splice(i,1);
                  break;
              }
          }
            if (len > 1){
                reply_like.remove();
                reply_zone.prepend(likesHtmlTpl(data[index].reply.likes));
            }else {
                reply_like.remove();
            }
      }
      //隐藏点赞面板
      mark = false;
      $('.operPanel').remove();
  });
}
/**
 * 评论回复事件函数:bindReply
 * @param node 即item-reply-btn
 */
function bindReply(node) {
    $('.oper-reply').on('click',function(){
         event.stopPropagation();
        //隐藏点赞面板
         mark = false;
        var index = node.parents('.moments-item').attr('data-index');
         $('.operPanel').remove();
         $(document.body).append('<div class="inputPanel"></div>');
         $('.inputPanel').html('<input class="input" type="text"/><button class="send">发送</button>');
         //检测到键盘输入,改变样式
         $('.input').on('keydown',function () {
             $('.send').css({
                 'color':'white',
                 'background-color':'green',
                 'disabled':'false'
             });
         });
        $('.send').on('click',function () {
            event.stopPropagation();
            var str=$('.input').val();
            if (str !== ''){
                var comments={
                    author: userName,
                    text: str
                };
                data[index].reply.comments.push(comments);
                var len = data[index].reply.comments.length;
                //通过判断原来是否已有评论,来决定从哪个节点插入子节点
                if (len >1){
                    node.parents('.item-right').find('.reply-comment').append('<div class="comment-item"><a class="reply-who" href="#">' + comments.author + '</a>：' + comments.text + '</div>');
                }else {
                    node.parents('.item-right').find('.reply-zone').append(commentsHtmlTpl(data[index].reply.comments));
                }
                $('.inputPanel').remove();
            }
        });
    });
}
/**
 * 点击图片放大事件函数:bindImg
 */
function bindImg(){
  $('img').on('click',function(event){
      event.stopPropagation();
    var src = $(this).context.src;
    $('body').append('<div class="big-picture"></div>');
    $('.big-picture').html('<img src="'+src+'">');
        Helper.after();
    $('.big-picture').on('click',function(){
        $('.big-picture').remove();
        Helper.before();
    });
  });
}

/**
 *获取当前item的index
 */
function findIndex(str) {
  var index;
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].user.name === str) {
            index = i;
            break;
        }
    }
    return index;
}
/**
 * 消除遮罩层滑动引起的背景层滑动
 */
var Helper = (function(ele) {
    var scrollTop;
    return {
        after: function() {
            scrollTop = document.scrollingElement.scrollTop;
            document.body.classList.add(ele);
            document.body.style.top = -scrollTop + 'px';
        },
        before: function() {
            document.body.classList.remove(ele);
            document.scrollingElement.scrollTop = scrollTop;
        }
    };
})('fix');

/**
 * 页面入口函数：init
 * 渲染页面
 * 绑定事件
 */
function init() {
  render();
  bindEvent();
}

init();