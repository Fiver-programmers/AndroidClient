/**
 * Created by ideabobo on 14-6-28.
 */

/***************************************用户模块*******************************************/
$(function(){
    var uinfo = localStorage['userinfo'];
    var f = localStorage['welcomed'];
    //if(f){
        if(uinfo && $.trim(uinfo)!=""){
            uinfo  = JSON.parse(uinfo);
            $("#lusername").val(uinfo.username);
            $("#lpasswd").val(uinfo.passwd);
            uinfo.remember = "1";
            login(uinfo);
        }
    //}else{
    //    changePage("welcomepage1","none");
    //}

    //$("#welcome1").bind("swipeleft tap",function(){
    //    changePage("welcomepage2");
    //});
    //$("#welcome2").bind("swipeleft tap",function(){
    //    changePage("welcomepage3");
    //});
    //$("#welcome3").bind("swipeleft tap",function(){
    //    changePage("welcomepage4");
    //});
    //$("#welcome4").bind("swipeleft tap",function(){
    //    changePage("welcomepage5");
    //});
    //$("#welcome5").bind("swipeleft tap",function(){
    //    changePage("welcomepage6");
    //});
    //$("#welcome6").bind("swipeleft tap",function(){
    //    changePage("loginpage");
    //    localStorage['welcomed'] = "yes";
    //});


});
var userinfo = null;
function login(uinfo){
    var fdata = uinfo || serializeObject($("#loginform"));
    if($.trim(fdata.username)=="" || $.trim(fdata.passwd) == ""){
        showLoader("请输入用户名或密码！",true);
        return;
    }
    ajaxCallback("login",fdata,function(data){
       if(data.info && data.info=="fail"){
           showLoader("用户名或密码错误",true);
           changePage("loginpage");
       }else{
           showLoader("登陆成功!",true);
           userinfo = data;
           if(fdata.remember == "1"){
                localStorage["userinfo"] = JSON.stringify(data);
           }else{
               localStorage["userinfo"] = "";
           }
           toMain();
       }
    });
}




function logout(){
    userinfo = null;
    localStorage['userinfo'] = "";
    toLogin();
}

function toRegister(){
    changePage("registerpage");
}

function toLogin(){
    $($(':input','#loginform').get(1)).val("");
    changePage("loginpage");
}

function register(){

    var fdata = serializeObject($("#registerform"));
    if($.trim(fdata.username) == "" || $.trim(fdata.passwd) == "" || $.trim(fdata.tel) == "" || $.trim(fdata.address) == ""){
        showLoader("请填写完整信息!",true);
        return;
    }
    if(fdata.tel.length<11){
        showLoader("电话号码格式不对!",true);
        return;
    }
    if(fdata.passwd != fdata.passwd2){
        showLoader("两次密码不一致!",true);
        return;
    }
    /*if(uploadFileUrl){
        uplaodImg(function(r){
            fdata.img = r;
            commitRegiesterInfo(fdata);
        });
    }else{*/
        commitRegiesterInfo(fdata);
    //}


}

function commitRegiesterInfo(fdata){
    ajaxCallback("checkUser",fdata,function(d){
        if(d.info == "success"){
            ajaxCallback("register",fdata,function(r){
                if(r.info){
                    showLoader("注册成功!",true);
                    userinfo = fdata;
                    userinfo.id = r.info;
                    toLogin();
                }else{
                    showLoader("注册失败请稍候再试!",true);
                }
                uploadFileUrl = null;
            });
        }else{
            showLoader("用户名已存在!",true);
        }
    });
}

function myinfo(){
    if(!userinfo){
        changePage("loginpage");
        return;
    }
    changePage("userinfopage");
    $("#editbutton").hide();
    $("#vusername").text(userinfo.username);
    $("#vtel").val(userinfo.tel);
    $("#vqq").val(userinfo.qq);
    $("#vwechat").val(userinfo.wechat);
    $("#vsex").val(userinfo.sex);
    $("#vbirth").val(userinfo.birth);
    $("#vemail").val(userinfo.email);
    $("#vaddress").val(userinfo.address);
    $("#vimg").val(userinfo.img);
    $("#rmyImage2").attr("src",fileurl+userinfo.img);
}

function editUserInfo(){
    $("#editbutton").show();
}

function updateUserInfo(){
    var fdata = serializeObject($("#userform"));
    fdata.id = userinfo.id;
    /*if(uploadFileUrl){
        uplaodImg(function(r){
            fdata.img = r;
            commitUpdateUserInfo(fdata);
        });
    }else{*/
        commitUpdateUserInfo(fdata);
    //}
}

function commitUpdateUserInfo(fdata){
    ajaxCallback("updateUser",fdata,function(user){
        if(user.username){
            showLoader("保存成功!",true);
            userinfo = user;
            uploadFileUrl = null;
        }else{
            showLoader("保存失败,请稍候再试!",true);
        }
    });
}

function toChangePasswd(){
    $("#pusername").text("用户名:"+userinfo.username);
    changePage("passwdpage");
}

function changePasswd(){
    var fdata = serializeObject($("#passwdform"));
    fdata.id = userinfo.id;
    if(fdata.oldpasswd != userinfo.passwd){
        showLoader("原始密码错误！",true);
        return;
    }
    if($.trim(fdata.passwd) == ""){
        showLoader("密码不能为空！",true);
        return;
    }
    if(fdata.passwd != fdata.passwd2){
        showLoader("两次密码不一致！",true);
        return;
    }
    ajaxCallback("changePasswd",fdata,function(r){
        if(r.info == "success"){
            showLoader("保存成功!",true);
            setTimeout(function(){
                toLogin();
            },2000);
        }else{
            showLoader("保存失败,请稍候再试!",true);
        }
    });
}

/***************************************用户模块*******************************************/




