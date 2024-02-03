class CharStatusXenon {
    constructor(mainV, subV, subV2, weapon, att, att_p, boss_a, defense, base_ig,  ctri_a,
                p_main = 0, p_sub = 0, p_sub2 = 0, p_ctri = 0, p_ignore = 0, p_harm = 0, p_Bharm = 0, p_atk = 0, ignore = -1) {

        this.mainV = mainV;
        this.subV = subV;
        this.subV2 = subV2;
        this.weapon = weapon;
        this.att = att;
        this.att_p = att_p;
        this.boss_a = boss_a;
        this.defense = defense;
        this.base_ig = base_ig;
        if(ignore == -1)
            this.ignore = base_ig;
        else
            this.ignore = ignore;
        this.ctri_a = ctri_a;

        this.p_main = p_main
        this.p_sub = p_sub
        this.p_sub2 = p_sub2
        this.p_ctri = p_ctri
        this.p_ignore = p_ignore
        this.p_harm = p_harm
        this.p_Bharm = p_Bharm
        this.p_atk = p_atk

    }

    base() {
        return 4 * 1.5 * (this.mainV + this.subV + this.subV2) * this.weapon * (this.att * (1 + this.att_p) ) * 0.01
    }
    defense_c() {
        var ret = 1 - this.defense * ( 1 - this.ignore) // (1-0.86) * (1-ignore)
        if (ret < 0) return 0
        return ret
    }
    realAtk() {
        return this.base() * (1 + this.boss_a) * this.defense_c() * (1 + this.ctri_a)
    }
    add_ignore(ignore) {
        this.ignore = 1 - ((1 - this.base_ig) * (1 - ignore))
        return this.ignore
    }

    clone() {
        return new CharStatusXenon(this.mainV, this.subV, this.subV2, this.weapon, this.att, this.att_p, this.boss_a, this.defense, this.base_ig, this.ctri_a,
            this.p_main, this.p_sub, this.p_sub2, this.p_ctri, this.p_ignore, this.p_harm, this.p_Bharm, this.p_atk, this.ignore)
    }
    get_points(){
        return "" + this.p_main + this.p_sub + this.p_sub2 + this.p_ctri + this.p_ignore + this.p_harm + this.p_Bharm + this.p_atk
    }
}



function dfsXenon(charStatus, points){
    if(  set.has(charStatus.get_points() )) 
        return;
    var new_atk = charStatus.realAtk();
    if( new_atk > max_v ){
        max_v = new_atk;
        max_left = points
        max_status = charStatus.clone();
       // console.log(">>", charStatus.p_main, charStatus.p_sub, charStatus.p_ctri, charStatus.p_ignore, charStatus.p_harm, charStatus.p_Bharm, charStatus.p_atk)
    }
 //  console.log(charStatus.p_main, charStatus.p_sub, charStatus.p_sub2, charStatus.p_ctri, charStatus.p_ignore, charStatus.p_harm, charStatus.p_Bharm, charStatus.p_atk)

    document.getElementById("output").innerHTML = "計算中>< <br> 目前推演至：" ;
    document.getElementById("output").innerHTML += "" + charStatus.p_main + " " + charStatus.p_sub + " " +charStatus.p_sub2 + " " +charStatus.p_ctri + " "  + charStatus.p_ignore  + " "  + charStatus.p_harm + " "  + charStatus.p_Bharm + " "  + charStatus.p_atk

    set.add( charStatus.get_points() )

    // 主屬
    point_next = pointNeed(charStatus.p_main+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.p_main += 1
        tmp.mainV += 30
        dfsXenon(tmp, points -  point_next )
    }
    // 副屬1
    point_next = pointNeed(charStatus.p_sub+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.p_sub += 1
        tmp.subV += 30
        dfsXenon(tmp, points -  point_next )
    }
    // 副屬2
    point_next = pointNeed(charStatus.p_sub2+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.p_sub2 += 1
        tmp.subV2 += 30
        dfsXenon(tmp, points -  point_next )
    }

    // 爆傷
    point_next = pointNeed(charStatus.p_ctri+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.p_ctri += 1
        tmp.ctri_a += 0.01
        dfsXenon(tmp, points -  point_next )
    }
    // 無視
    point_next = pointNeed(charStatus.p_ignore+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.ignore = tmp.base_ig
        tmp.p_ignore += 1
        tmp.add_ignore( tmp.p_ignore * 0.03 )
        dfsXenon(tmp, points -  point_next )

    }
    // 傷害
    point_next = pointNeed(charStatus.p_harm+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.p_harm += 1
        tmp.boss_a += 0.03
        dfsXenon(tmp, points -  point_next )
    }
    // B傷
    point_next = pointNeed(charStatus.p_Bharm+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.p_Bharm += 1
        if(tmp.p_Bharm <= 5)
            tmp.boss_a += 0.03
        else
            tmp.boss_a += 0.04
        dfsXenon(tmp, points - point_next )

    }
    // 攻擊
    point_next = pointNeed(charStatus.p_atk+1)
    if(points >= point_next ){
        var tmp = charStatus.clone();
        tmp.p_atk += 1
        tmp.att += 3
        dfsXenon(tmp, points - point_next )
    }
    
}
function optim_GreddyXenon(charStatus, points){
    last_point = -1

    while(last_point != points && points > 0){
        based_atk = charStatus.realAtk()
        // find best solution for now
        max_up = 0
        max_point = 0
        last_point = points


        // 主屬
        point_next = pointNeed(charStatus.p_main+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.p_main += 1
            tmp.mainV += 30
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }
        }
        // 副屬1
        point_next = pointNeed(charStatus.p_sub+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.p_sub += 1
            tmp.subV += 30
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }
        }
        // 副屬2
        point_next = pointNeed(charStatus.p_sub2+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.p_sub2 += 1
            tmp.subV2 += 30
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }
        }
        // 爆傷
        point_next = pointNeed(charStatus.p_ctri+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.p_ctri += 1
            tmp.ctri_a += 0.01
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }
        }
        // 無視
        point_next = pointNeed(charStatus.p_ignore+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.ignore = tmp.base_ig
            tmp.p_ignore += 1
            tmp.add_ignore( tmp.p_ignore * 0.03 )
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }

        }
        // 傷害
        point_next = pointNeed(charStatus.p_harm+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.p_harm += 1
            tmp.boss_a += 0.03
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }
        }
        // B傷
        point_next = pointNeed(charStatus.p_Bharm+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.p_Bharm += 1
            if(tmp.p_Bharm <= 5)
                tmp.boss_a += 0.03
            else
                tmp.boss_a += 0.04
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }

        }
        // 攻擊
        point_next = pointNeed(charStatus.p_atk+1)
        if(points >= point_next ){
            var tmp = charStatus.clone();
            tmp.p_atk += 1
            tmp.att += 3
            tmp_rAtk = (tmp.realAtk() - based_atk) / point_next;
            if(tmp_rAtk > max_up){
                max_up = tmp_rAtk;
                max_point = point_next;
            }
        }
        set = new Set()
        dfsXenon(charStatus, max_point)
        max_v = 0
        point_used = max_point - max_left
        charStatus = max_status.clone()
        points -= point_used

    }
    return [charStatus, points]
}




/**
 *     constructor(mainV, subV, weapon, att, att_p, boss_a,   defense, base_ig, ctri_a,
                p_main = 0, p_sub = 0, p_ctri = 0, p_ignore = 0, p_harm = 0, p_Bharm = 0, p_atk = 0) {
 */
// my = new CharStatusXenon( 49760, 6475,  1.2,    3318, 0.97, 3.93+0.57, 3.8,    0.9658, 0.864 )


// best_status = optim_GreddyXenon(my, 1287)
// console.log(my.realAtk())






function exampleXenon(){
    document.getElementById("mainV").value = 20000;
    document.getElementById("subV").value = 17600;
    document.getElementById("subV2").value = 20000;
    document.getElementById("att").value = 3318;

    document.getElementById("tot_a").value = 57;
    document.getElementById("boss_a").value = 393;
    document.getElementById("base_ig").value = 96.58;
    document.getElementById("ctri_a").value = 86.4;
    document.getElementById("defense").value = 380;
    document.getElementById("points").value = 1287;

}
  //  document.getElementById("att_p").value = 97;

function calculateXenon(){
    allBlack();
    document.getElementById("output").innerHTML = "計算中><";
    mainV = parseFloat( document.getElementById("mainV").value );
    subV = parseFloat( document.getElementById("subV").value );
    subV2 = parseFloat( document.getElementById("subV2").value );
    att = parseFloat( document.getElementById("att").value );
    att_p = 1 // parseFloat( document.getElementById("att_p").value ) / 100;
    tot_a = parseFloat( document.getElementById("tot_a").value ) / 100;
    boss_a = parseFloat( document.getElementById("boss_a").value ) / 100;
    base_ig = parseFloat( document.getElementById("base_ig").value ) / 100;
    ctri_a = parseFloat( document.getElementById("ctri_a").value ) / 100+0.35;
    defense = parseFloat( document.getElementById("defense").value ) / 100;
    points = parseInt( document.getElementById("points").value );

    console.log(mainV, subV, att, att_p, tot_a, boss_a, base_ig, ctri_a, defense)
    if(isNaN(mainV+ subV + subV2 + att+ att_p+ tot_a+ boss_a+ base_ig+ ctri_a + defense) || att <= 0 || mainV <= 0 || subV<= 0 || subV2 <= 0 ){
        document.getElementById("output").innerHTML = "輸入有錯！請檢查一下紅色的項目><";
        if(isNaN(mainV) || mainV == 0) 
            document.querySelector('label[for="input1"]').style.color = 'red';
        if(isNaN(subV) || subV == 0) 
            document.querySelector('label[for="input2"]').style.color = 'red';
        if(isNaN(subV2) || subV2 == 0) 
            document.querySelector('label[for="input15"]').style.color = 'red';
        if(isNaN(att) || att == 0) 
            document.querySelector('label[for="input3"]').style.color = 'red';
        if(isNaN(att_p)) 
            document.querySelector('label[for="input4"]').style.color = 'red';
        if(isNaN(tot_a)) 
            document.querySelector('label[for="input5"]').style.color = 'red';
        if(isNaN(boss_a)) 
            document.querySelector('label[for="input6"]').style.color = 'red';
        if(isNaN(base_ig)) 
            document.querySelector('label[for="input7"]').style.color = 'red';
        if(isNaN(ctri_a)) 
            document.querySelector('label[for="input8"]').style.color = 'red';
        if(isNaN(defense)) 
            document.querySelector('label[for="input9"]').style.color = 'red';
        if(isNaN(points)) 
            document.querySelector('label[for="input10"]').style.color = 'red';
    }else{
        allBlack();
        document.getElementById("output").innerHTML = "計算中>< <br> 目前推演至：" ;
        my = new CharStatusXenon( mainV, subV, subV2, 1, att, att_p, boss_a+tot_a, defense, base_ig, ctri_a )
        best_status = optim_GreddyXenon(my, points)
        document.getElementById("output").innerHTML  = '力量　　應升至：' + best_status[0].p_main + " 等<br><br>敏捷　　應升至：" + best_status[0].p_sub
        document.getElementById("output").innerHTML += ' 等<br><br>幸運　　應升至：' + best_status[0].p_sub2;
        document.getElementById("output").innerHTML += ' 等<br><br>爆擊傷害應升至：' + best_status[0].p_ctri + " 等<br><br>無視防禦應升至：" + best_status[0].p_ignore
        document.getElementById("output").innerHTML += ' 等<br><br>Boss傷害應升至：' + best_status[0].p_Bharm + " 等<br><br>傷害　　應升至：" + best_status[0].p_harm
        document.getElementById("output").innerHTML += ' 等<br><br>攻擊力　應升至：' + best_status[0].p_atk + " 等<br><br><br>剩餘點數：" + best_status[1]
        document.getElementById("output").innerHTML += "<br>提升幅度：" +  Math.round( best_status[0].realAtk() / my.realAtk() * 1000 ) / 1000
    }
}


