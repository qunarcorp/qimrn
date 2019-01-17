import {Platform} from "react-native";
import HttpTools from "../common/HttpTools";

var SpiltMessage = {};

SpiltMessage.spiltContent = function (content, k) {

    console.log("SpiltMessage.spiltContent : " + content + ' k : ' + k);
    let wnm = {};
    if (k == null || k == '') {
        wnm["left"] = content;
        wnm["middle"] = "";
        wnm["right"] = "";
        return wnm;
    }
    let index = content.indexOf(k);
    let length = content.length;

    let defaultLength = 15;
    if (index==-1) {
        //Content中不存在关键字k
        wnm["left"] = content;
        wnm["middle"] = "";
        wnm["right"] = "";
    } else {
        if(k.length >= defaultLength){
            wnm["left"] = "";
            wnm["right"] = "";
        }else {
            let subLength = k.length;
            if(length > defaultLength){
                let temp = defaultLength - k.length;
                if(index - temp/2 <= 0){
                    wnm["left"] = content.substring(0,index);
                    wnm["right"] = content.substring(index + subLength);
                }else {
                    if(index + k.length + temp/2 >= length){
                        wnm["left"] = "..." + content.substring(index - temp/2,index);
                        wnm["right"] = content.substring(index + subLength);
                    }else {
                        wnm["left"] = "..." + content.substring(index - temp/2,index);
                        wnm["right"] = content.substring(index + subLength,index + k.length + temp/2 ) + "...";
                    }
                }
            }else {
                if(index == 0){
                    wnm["left"] = "";
                    wnm["right"] = content.substring(k.length);
                }else if(index == length - k.length){
                    wnm["left"] = content.substring(0,index);
                    wnm["right"] = "";
                }else {
                    wnm["left"] = content.substring(0,index);
                    wnm["right"] = content.substring(index + subLength);
                }
            }
        }
        wnm["middle"] = k;
    }
    return wnm;
};

export default SpiltMessage;