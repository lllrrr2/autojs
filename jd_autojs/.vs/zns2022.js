var appName = "com.jingdong.app.mall";
//var huodong_indexInParent_num = 9;
//var headerXY;
// 需要完成的任务列表
var TASK_LIST = ["早起", "城城", "浏览领", "浏览并关注8s", "浏览8秒", "浏览8s", "累计浏览", "浏览并关注可得2000", "浏览可得", "入会", "浏览并关注可得", "去首页浮层进入", "浏览5个品牌墙店铺", "小程序", "浏览5个品牌墙店铺", "浏览活动"];
// 过渡操作
var PASS_LIST = ['请选择要使用的应用', '我知道了', '取消', "京口令已复制"];
// 判断停留时间
var JUDGE_TIME = 0;
// 定时器
var interval;
// 已完成序号
var finished_task_num = new Array();
// 当前序号
var current_task_num = 0;
// 浏览就返回标记
var isBackFlag = false;
// 小程序标记
var isXcx = false;
//var appName = "com.jingdong.app.mall";
var huodong_indexInParent_num = 9;
// 记录活动页面头部坐标
var headerXY;
var ruhui_enable = 0
var ruhui_errtime = 0
var AppType = 0; //1: 京东APP  2:京东金融
/**
 * 启动京东app
 */
function start() 
{
    auto.waitFor()
    if (launch(appName)) 
    {
        console.info("作者:Cool-baby");
        console.info("时间:2022-1-15");
        console.info("GitHub:https://github.com/Cool-baby")
        console.info("启动京东APP");
    }
    console.show();
}
start();
sleep(3000);


/**
 * 点击
 * @param {横坐标} x
 * @param {纵坐标} y
 */
function randomClick(x, y) 
{
    var rx = random(0, 5);
    var ry = random(0, 5);
 
    click(x + rx, y + ry);
    sleep(2000);
    return true;
}


/**
 * 进入做任务界面
 */
function enterActivity() 
{
    console.info("准备进入任务界面");
    if (!textContains("累计任务奖励").exists()) 
    {
        sleep(1000);
        if (textContains("累计任务奖励").exists()) 
        {
            console.info("已经在任务界面");
            sleep(300);
            headerXY = id("a96").findOne().bounds();
        } 
        else 
        {
            if (desc("浮层活动").exists()) 
            {
                console.info("点击浮层活动");
                var huodong = desc("浮层活动").findOne().bounds();
                randomClick(huodong.centerX(), huodong.centerY());
                sleep(500);
                if (desc("浮层活动").exists()) 
                {
                    console.info("点击浮层活动");
                    var huodong = desc("浮层活动").findOne().bounds();
                    randomClick(huodong.centerX(), huodong.centerY());
                    sleep(1500);
                }
            }
            
            // 获取进入做任务界面的控件
            var button = className('android.view.View')
                .depth(14)
                .indexInParent(huodong_indexInParent_num)
                .drawingOrder(0)
                .clickable();
            if (button.exists()) {
                console.info("点击进入做任务界面")
                //var rect = button.findOne().bounds();
                //var rect = [831,1416,1062,1635];
                //console.info(rect)
                //console.info(rect.centerX(), rect.centerY())
                randomClick(946, 1525);//此处我根据荣耀v20找的点
                sleep(500);
                headerXY = id("a96").findOne().bounds();
            } 
            else 
            {
                console.info("找不到任务界面按钮")
                console.info("无法自动进入做任务界面，请手动进入！");
            }
            
            if (textContains("累计任务奖励").exists()) 
            {
                console.info("已成功进入任务界面");
                sleep(500);
                headerXY = id("a96").findOne().bounds();
            } 
            else 
            {
                console.info("找不到任务界面按钮")
                console.info("无法自动进入做任务界面，请手动进入！");
            }
        }
        sleep(1000);
    }
}


/**
 * 关键调用在此
 */
while (true) {

    enterActivity();//进入做任务界面，防走丢

    recoverApp();//检测是否卡顿

    var flag = getNeedSelector();//找任务

    if(viewTask(flag) == 0)
        addMarketCar();//加购物车
 

}


/**
 * 获取需要进行的控件
 * @returns
 */
 function getNeedSelector() {
    sleep(2000)
     
    try{

        {
            // console.info("判断是否是金融")
            allSelector = textContains("每邀1个好友").findOne()
            console.info(allSelector.text())
            allSelector = allSelector.parent()
            allSelector = allSelector.parent()
            allSelector = allSelector.children()
            console.info(allSelector.length)
 
            for (let index = 0; index < allSelector.length - 1; index++) {
                for (var i = 0; i < TASK_LIST.length; i++) {
                    // if(AppType == 0)
                    // {
                    //     AppType = 2; //标记为京东金融APP
                    //     console.info("京东金融")
                    // }
                    // 获取具有需要完成任务字符串的控件集合
                    lab = allSelector[index].children()[2].text()
 
                    var list = allSelector[index].children()[2].findByText(TASK_LIST[i]);
                    // 如果长度大于0则表示存在该控件
                    if (list.size() > 0) {
                        // 获取不在序列中的序号
                        if (finished_task_num.indexOf(index) < 0) {
                            console.info("当前已完成序列：", finished_task_num)
                            current_task_num = index;
                        } else {
                            continue;
                        }
         
                        // 如果是浏览就返回的任务，将标记设为true
                        isBackFlag = (TASK_LIST[i].indexOf("浏览可得") >= 0 || TASK_LIST[i].indexOf("浏览并关注可得") >= 0 || TASK_LIST[i].indexOf("浏览领") >= 0 ) ? true : false;
                        // 如果是小程序任务，将小程序标记设为true
                        isXcx = (TASK_LIST[i].indexOf("小程序") >= 0) ? true : false;
                        var rect = allSelector[index].children()[3].bounds();
                        if (textContains("当前进度").exists()) {
                            console.info("去完成任务，当前任务序列：", current_task_num,TASK_LIST[i])
                            if(TASK_LIST[i] == "浏览可得")
                            {
                                console.info("看下就回来")
                                isBackFlag = true;
                            }
                            randomClick(rect.centerX(), rect.centerY());
                            sleep(1000)
 
                            if (TASK_LIST[i].indexOf("早起") >= 0){
                                log("早上好！！那么早就跑脚本")
                                break;
                            }
                             
                            for(i = 0; i < 5; i++)
                            {
                                if (textContains("当前进度").exists()) {
                                    log("点了没反应？我再点！")
                                    sleep(2000)
                                    randomClick(rect.centerX(), rect.centerY());
                                }else{
                                    //console.info("开始任务:", allSelector[current_task_num].parent().findByText(TASK_LIST[i]).get(0).text());
                                    return true;
                                }
                            }
                            //试了那么多次，屏蔽了这个任务吧
                            if (textContains("当前进度").exists()) {
                                finished_task_num[finished_task_num.length] = current_task_num;
                                log("任务没有跳转，应该任务完成了，屏蔽当前任务序列，如果是误操作，请结束后重新运行脚本")
                                break;
                            }
                    }
                    }
                }
            }
            console.log("完成")
 
        }
         
    }catch(e){
        log("getNeedSelector")
        log(e)
    }
}


/**
 * 去完成任务
 * [url=home.php?mod=space&uid=952169]@Param[/url] {是否点击任务标识} flag
 */
 function viewTask(flag) {
    var res = 0;
    // 根据坐标点击任务，判断哪些需要进行
    sleep(2000);
    var timeout = 15
    var timestart = new Date().getTime();
    console.info("开始时间:" + timestart)
    var timenow = new Date().getTime();
    while (true && flag) {
        timenow = new Date().getTime();
        if((timenow - timestart) / 1000 > timeout)
        {
            console.info("结束时间:" + timenow)
            break;
        }
         
        if (text("天天都能领").exists() || text("有机会得大额现金").exists() || text("邀请新朋友 更快赚现金").exists()) {
            console.info("进入城城领现金");
            if(text("天天都能领").exists()) {
                var btn = textContains('天天都能领').findOne().parent().children()[3].bounds()
                click(btn.centerX(),btn.centerY())
                sleep(1000);
                log("给钱就收");
            }
            if(text("邀请新朋友 更快赚现金").exists()) {
                var btn = className("android.view.View").text("邀请新朋友 更快赚现金").findOne().parent().children()[2].bounds()
                click(btn.centerX(),btn.centerY())
                sleep(1000);
                log("点掉浮窗");
            }
            sleep(1000);
            if( textContains("有机会得大额现金").exists()) {
                var btn = textContains('有机会得大额现金').findOne().parent().children()[1].bounds()
                click(btn.centerX(),btn.centerY())
                sleep(1000);
                log("城城邀请");
            }
 
            if( textContains("去微信粘贴给好友").exists()){
                var btn = textContains('去微信粘贴给好友').findOne().bounds()
                click(btn.centerX(),btn.centerY())
                sleep(1000);
                log("关闭邀请码");
            }
 
            viewAndFollow();
            sleep(500);
            // 重置计时
            JUDGE_TIME = 0;
        }else
        if ((textStartsWith("获得").exists() && textEndsWith("爆竹").exists()) || text("已浏览").exists() || text("浏览完成").exists()) {
            console.info("任务完成，返回");
            viewAndFollow();
            sleep(500);
            // 重置计时
            JUDGE_TIME = 0;
            break;
        } else if (text("已达上限").exists()) {
            console.info("任务已达上限,切换已完成按钮");
            // 将当前任务序号添加到列表中，防止后续点到
            finished_task_num[finished_task_num.length] = current_task_num;
            viewAndFollow();
            sleep(500);
            // 重置计时
            JUDGE_TIME = 0;
            res = 1;
            break;
        } else if (textContains('会员授权协议').exists()) {
            if(ruhui())
            {   //如果入会失败，则不再入会
                // 将当前任务序号添加到列表中，防止后续点到
                finished_task_num[finished_task_num.length] = current_task_num;
            }
            viewAndFollow();
            // 重置计时
            JUDGE_TIME = 0;
            break;
        } else if (textContains('当前页点击浏览4个').exists() || textContains('当前页浏览加购').exists()) {
            console.info("当前为加入购物车任务");
            // 重置计时
            JUDGE_TIME = 0;
            break;
        } else if (text("互动种草城").exists()) {
            console.info("当前为互动种草城任务");
            // 重置计时
            JUDGE_TIME = 0;
            if (interactionGrassPlanting()) {
                back();
                break;
            }
            break;
        } else if (text("到底了，没有更多了～").exists() && !text("消息").exists() && !text("扫啊扫").exists()
            && !(textStartsWith("当前进度").exists() && textEndsWith("10").exists())) {
            console.info("到底了，没有更多了～");
            sleep(1000);
            // 重置计时
            JUDGE_TIME = 0;
            var count = 0;
            while (count <= 5) {
                if (undefined === headerXY) {
                    headerXY = id("a96").findOne().bounds();
                }
                var rightx = headerXY.right;
                var righty = headerXY.bottom + 300;
                while (click(rightx, righty)) {
                    console.info("尝试点击坐标：", rightx, righty);
                    count = count + 1;
                    sleep(6000);
                    if (!text("到底了，没有更多了～").exists()) {
                        if (id("aqw").click()) {
                            sleep(2000);
                            console.info("尝试返回", count);
                            back();
                            break;
                        }
                    } else {
                        righty = righty + 50;
                    }
                    if(righty >= 1600) {
                        break;
                    }
                }
            }
            swipe(807, 314, 807, 414, 1);
            sleep(2000);
            break;
        } else if (text("消息").exists() && text("扫啊扫").exists()) {
            console.warn("因为某些原因回到首页，重新进入活动界面");
            enterActivity();
        } else if (text("天天都能领").exists()) {
            sleep(2000);
            console.info("天天都能领");
            // 重置计时
            JUDGE_TIME = 0;
            var button = className('android.view.View')
                .depth(16)
                .indexInParent(3)
                .drawingOrder(0)
                .clickable().findOne().bounds();
            if (randomClick(button.centerX(), button.centerY())) {
                sleep(1000);
                console.log("点我收下");
                if (back()) {
                    break;
                }
            }
        } else if (text('京东11.11热爱环...').exists()) {
            console.info("下单任务，跳过");
            back();
        } else if (isBackFlag) {
            console.info("进入浏览就返回任务");
            //sleep(1000);
            viewAndFollow();
            isBackFlag = false;
            break;
        } else if (isXcx) {
            console.info("进入小程序任务");
            // 重置计时
            JUDGE_TIME = 0;
            sleep(2000);
            back();
            sleep(2000);
            let trytime = 0;
            if(textContains("确定").exists())
            {
                print("小程序签名未通过")
                textContains("确定").click()
                sleep(1000);
            }
            while (!textContains("当前进度").exists() && trytime < 5) {
                back();
                sleep(1000);
                trytime++;
            }
 
            isXcx = false;
            break;
        } else {
            if (recoverApp()) {
                break;
            }
        }
    }
 
    if ((timenow - timestart) > (timeout * 1000)) {
        console.info("界面超时了")
        viewAndFollow();
    }
    return res;
}


/**
 * 加入购物车
 */
 function addMarketCar() {
    if (textContains('当前页点击浏览4个').exists() || textContains('当前页浏览加购').exists()) {
        console.info("在加购页面");
        // for(idx = 0; idx < 10; idx++)
        // {
        //     console.info("i:" + idx);
        const productList = textContains('￥').find()
        console.info(productList.length);
        // }
        //const productList = className('android.widget.Button').depth(19).clickable().find()
        var count = 0;
        for (index = 0; index < productList.length; index++) {
            if (count >= 4) {
                if (back()) {
                    sleep(3000)
                    count = 0;
                    break;
                }
            }
            if (productList[index].parent().parent().children()[4].click()) {
                // 重置计时
                JUDGE_TIME = 0;
                log("加购浏览任务:正在添加第" + (index + 1) + "个商品");
                sleep(2000);
                while (true) {
                    if (back()) {
                        count = count + 1;
                        sleep(2000);
                        if (textContains("当前页").exists()) {
                            break;
                        }
                    }
                }
            }
        }
    }
 
}


/**
//做任务
 function execTask() {
    while(true) {
        if(text("浏览并关注8s可得8000爆竹").exists() || text("浏览8s可得8000爆竹").exists()) 
        {
            console.info("存在可浏览任务")

        }
        else
        {
            console.info("没有可浏览任务")
            break
        }
    }
}
execTask();
*/

/**
 * 自动判断程序是否卡顿，恢复方法
 * 判断依据：1.不在活动界面 2.停留某个界面长达30s
 * @returns
 */
 function recoverApp() {
    if (!text("当前进度").exists() && JUDGE_TIME > 30) {
        if (back()) {
            // 计时器重置
            JUDGE_TIME = 0;
            console.warn("停留某个页面超过30s,自动返回，重置定时器。");
            return true;
        }
    } else {
        return false;
    }
}


/**
 * 返回
 */
function viewAndFollow() {
    trytime = 0;
    while (!textContains("当前进度").exists() && trytime < 10) {
        back();
        sleep(1000);
        trytime++;
    }
}