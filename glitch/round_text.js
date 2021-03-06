/**
挿入点を基準に文字をよせてまわす
"twisting characters against the insertion point"

使い方：
テキストフレーム内のどこかにカーソルで挿入点入れる、または文字列を選択して
基準点を決めて実行。選んだ基準点を中心に文字回転をします。

動作確認：OS10.4.11 InDesign CS3

milligramme
www.milligramme.cc
*/

var docObj = app.documents[0];
var selObj = docObj.selection[0];
var pi     = Math.PI/180; //degree to radian

var impLeft, impTop, tfObj, theta;

//選択オブジェクトを基準点として座標をおさえておく
switch (selObj.constructor.name){
	case "InsertionPoint" :
	case "Character" :
		impLeft = selObj.horizontalOffset;
		impTop  = selObj.baseline-selObj.ascent;
		//基準点のガイドを作成
		//var guid_VaHo=docObj.guides.add ({orientation: HorizontalOrVertical.VERTICAL, location: selObj.horizontalOffset});
		//var guid_HoAs=docObj.guides.add ({orientation: HorizontalOrVertical.HORIZONTAL, location: selObj.baseline-selObj.ascent});
		break;
	case "Word" :
	case "TextStyleRange" :
	case "Line" :
	case "Paragraph" :
	case "Text" :
	case "TextColumn" :
		impLeft = selObj.characters[0].horizontalOffset;
		impTop  = selObj.characters[0].baseline-selObj.characters[0].ascent;
		//基準点のガイドを作成
		//var guid_VaHo=docObj.guides.add ({orientation: HorizontalOrVertical.VERTICAL, location: selObj.characters[0].horizontalOffset});
		//var guid_HoAs=docObj.guides.add ({orientation: HorizontalOrVertical.HORIZONTAL, location: selObj.characters[0].baseline-selObj.characters[0].ascent});
		break;
	default:
		alert("out of selection range");
		exit();
		}
//親テキストフレーム
tfObj = selObj.parentTextFrames[0]; 
//ツメを100%
tfObj.parentStory.texts[0].tsume=1;

for(var i=0; i < tfObj.parentStory.characters.length ; i++){
	var tfGBon   = tfObj.geometricBounds;
	var growFram = selObj.parentStory.characters[0].ascent*1.05;
	
	//オーバーフローしたらテキストフレームを伸ばす。たてよこ
	if(tfObj.overflows == true && tfObj.parentStory.storyPreferences.storyOrientation==StoryHorizontalOrVertical.HORIZONTAL){
		tfObj.geometricBounds=[tfGBon[0], tfGBon[1], tfGBon[2]+growFram, tfGBon[3]];
		}
	if(tfObj.overflows == true && tfObj.parentStory.storyPreferences.storyOrientation==StoryHorizontalOrVertical.VERTICAL){
		tfObj.geometricBounds=[tfGBon[0], tfGBon[1]-growFram, tfGBon[2], tfGBon[3]];
		}
	//各文字の座標
	var charLeft=tfObj.parentStory.characters[i].horizontalOffset;
	var charTop=tfObj.parentStory.characters[i].baseline-tfObj.parentStory.characters[i].ascent;
	//基準点との角度を求める
	if(impLeft!=charLeft){
		theta=Math.atan2(charTop-impTop, charLeft-impLeft)/pi;
		}
	else{theta=0;}
		//基準点に向かって振る
		tfObj.parentStory.characters[i].characterRotation=theta;
		}
