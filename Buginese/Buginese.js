// NativeScribe - Buginese
//
// Copyright (c) 2013-2020 Bennylin (@bennylin)
// Copyright (c) 2020 Syafiq Hadzir ((蟻颜慧))
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var vowelPrev = false;
/***************************
Function SuperTrim, findstr
trim string, menemukan karakter di dalam string
****************************/
function SuperTrim(str) {
    str = str || '';
    return str.replace(/^\s*|\s*$/g, '').replace(/\s+/g, ' ');
}
function findstr(str, tofind) {
    for (var i = 0; i < str.length; i++)
        if (str[i] == tofind)
            return true;
    return false;
}
/***************************
Function isDigit, isPunct, isVowel
cek apakah digit, tanda baca, atau huruf vokal (a, e/è/é, i, o, u, ě/ê, ô, ā/ī/ū/ō)
****************************/
function isDigit(a) {
    var str = "0123456789";
    return findstr(str, a);
}
function isPunct(a) {
    var str = ",.><?/+=-_}{[]*&^%$#@!~`\"\\|:;()";
    return findstr(str, a);
}
function isVowel(a) {
    var str = "AaEeÈèÉéIiOoUuÊêĚěXxôāīūō";
    return findstr(str, a);
}
function isLCVowel(a) {
    var str = "aeèéiouêěxāūō";
    return findstr(str, a);
}
function isConsonant(a) {
    var str = "BCDfGHJKLMNPRSTVWYZbcdfghjklmnpqrstvwxyzḌḍṆṇṢṣṬṭŊŋÑñɲ";
    //QXqx are special chars, add engma & enye
    return findstr(str, a);
}
/***************************
Function isSpecial, isHR, isLW
cek apakah karakter spesial (bikonsonan/cakra-pengkal/layar-cecak-wignyan/panjingan)
****************************/
function isSpecial(a) {
    var str = "KkPpGgHhRrYy";
    //untuk bikonsonan nga, nka, mpa, nra, nya, nca
    return findstr(str, a);
}
/***************************
Function GetMatra
apabila huruf vokal, return matra (sandhangan swara)
****************************/
function GetMatra(str) {
    var i = 0;
    if (str.length < 1) {
        return "ᨛ";
    }
    while (str[i] == 'h') {
        i++;
        if (i >= str.length) {
            break;
        }
    }
    if (i < str.length) {
        str = str.substring(i);
    }
    var matramap1 = {
        "e": 'ᨛ', "è": ' ᨙ', "é": ' ᨙ', "x": ' ᨙ', "i": 'ᨗ', "o": 'ᨚ', "u": 'ᨘ',
        "A": 'ᨕ', "E": 'ᨕᨛ', "È": 'ᨕ ᨙ', "É": 'ᨕ ᨙ', "X": 'ᨕ ᨙ', "I": 'ᨕᨗ', "O": 'ᨕᨚ', "U": 'ᨕᨘ'
    }
    var matramap2 = {
        "e": 'ᨛ', "è": ' ᨙ', "é": ' ᨙ', "x": ' ᨙ', "i": 'ᨗ', "o": 'ᨚ', "u": 'ᨘ',
        "A": 'ᨕ', "E": 'ᨕᨛ', "È": 'ᨕ ᨙ', "É": 'ᨕ ᨙ', "X": 'ᨕ ᨙ', "I": 'ᨕᨗ', "O": 'ᨕᨚ', "U": 'ᨕᨘ'
    }
    var matramap, mode;
    var modeTranslit = document.getElementsByName("mode");
    for (var rad in modeTranslit) {
        if (modeTranslit[rad].checked)
            mode = modeTranslit[rad].value;
    }
    if (mode == "kopas")
        matramap = matramap2; else //if(mode == "ketik")
        matramap = matramap1;
    if (matramap[str] !== undefined) {
        return matramap[str];
    }
    return "";
}
/***************************
Function GetShift
apabila huruf bikonsonan, return karakter khusus
****************************/
function GetShift(str) {
    str = str.toLowerCase();
    if (str.indexOf("nk") == 0) {
        //suku kata diawali 'nk'
        return {
            "CoreSound": "ᨃ", "len": 2
        }
            ;
    } else if (str.indexOf("k") == 1) {
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᨛᨀ", "len": 2
        }
            ;
    } else if (str.indexOf("k") > 1) {
        //suku kata memiliki konsonan 'h' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        }
            ;
    }
    if (str.indexOf("mp") == 0) {
        //suku kata diawali 'mp'
        return {
            "CoreSound": "ᨇ", "len": 2
        }
            ;
    } else if (str.indexOf("p") == 1) {
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᨛᨄ", "len": 2
        }
            ;
    } else if (str.indexOf("p") > 1) {
        //suku kata memiliki konsonan 'p' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        }
            ;
    }
    //nga
    if (str.indexOf("ng") == 0) {
        //suku kata diawali 'ng'
        return {
            "CoreSound": "ᨂ", "len": 2
        }
            ;
    } else if (str.indexOf("g") == 1) {
        //g
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᨛᨁ", "len": 2
        }
            ;
    } else if (str.indexOf("g") > 1) {
        //suku kata memiliki konsonan 'g' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        }
            ;
    }
    //nya
    if (str.indexOf("ny") == 0) {
        //suku kata diawali 'ny'
        return {
            "CoreSound": "ᨎ", "len": 2
        }
            ;
    } else if (str.indexOf("y") == 1) {
        //pengkal
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᨛᨐ", "len": 2
        }
            ;
    } else if (str.indexOf("y") > 1) {
        //suku kata memiliki konsonan 'y' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound += ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        }
            ;
    }
    if (str.indexOf("nr") == 0) {
        //hr-
        return {
            "CoreSound": "ᨋ", "len": 2
        }
            ;
    } else if (str.indexOf("r") == 1) {
        //cakra
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᨛᨑ", "len": 2
        }
            ;
    } else if (str.indexOf("r") > 1) {
        //suku kata memiliki konsonan 'r' yang tidak di awal suku
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound += ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        }
            ;
    }
    if (str.indexOf("nc") == 0) {
        //nc
        return {
            "CoreSound": "ᨏ", "len": 2
        }
            ;
    } else if (str.indexOf("c") == 1) {
        //c
        return {
            "CoreSound": "" + GetCoreSound(str[0]).CoreSound + "ᨛᨌ", "len": 2
        }
            ;
    } else if (str.indexOf("c") > 1) {
        var sound = "";
        var len = 0;
        var index = 0;
        for (index = 0; index < str.length; index++) {
            var c = str[index];
            if (!isVowel(c)) {
                sound = sound + ResolveCharacterSound(c);
                len++;
            } else {
                break;
            }
        }
        return {
            "CoreSound": sound, "len": len
        }
            ;
    }
    return {
        "CoreSound": null, "len": 1
    }
        ;
}
/***************************
Function GetCoreSound
return aksara nglegana
****************************/
function GetCoreSound(str) {
    var consonantMap1 = {
        "A": "ᨕ", //A
        "B": "ᨅ", //B
        "C": "ᨌ", //C
        "D": "ᨉ", //D
        "E": "ᨕᨛ", //E
        "F": "ᨄ", //F
        "G": "ᨁ", //G
        "H": "ᨖ", //H
        "I": "ᨕᨗ", //I
        "J": "ᨍ", //J
        "K": "ᨀ", //K
        "L": "ᨒ", //L
        "M": "ᨆ", //M
        "N": "ᨊ", //N
        "O": "ᨕᨚ", //O
        "P": "ᨄ", //P
        "Q": "ᨀ", //Q
        "R": "ᨑ", //R
        "S": "ᨔ", //S
        "T": "ᨈ", //T
        "U": "ᨕᨘ", //U
        "V": "ᨄ", //V
        "W": "ᨓ", //W
        "X": "ᨕ ᨙ", //X
        "Y": "ᨐ", //Y
        "Z": "ᨍ", //Z
        '​': "ᨕ", //zws zero-width space
        "a": "ᨕ", //a
        "b": "ᨅ", //b
        "c": "ᨌ", //c
        "d": "ᨉ", //d
        "e": "ᨕᨛ", //e
        "f": "ᨄ", //f
        "g": "ᨁ", //g
        "h": "ᨖ", //h
        "i": "ᨕᨗ", //i
        "j": "ᨍ", //j
        "k": "ᨀ", //k
        "l": "ᨒ", //l
        "m": "ᨆ", //m
        "n": "ᨊ", //n
        "o": "ᨕᨚ", //o
        "p": "ᨄ", //p
        "q": "ᨀ", //q
        "r": "ᨑ", //r
        "s": "ᨔ", //s
        "t": "ᨈ", //t
        "u": "ᨕᨘ", //u
        "v": "ᨄ", //v
        "w": "ᨓ", //w
        "x": "ᨕ ᨙ", //x
        "y": "ᨐ", //y
        "z": "ᨍ", //z
        "È": "ᨕ ᨙ", //È
        "É": "ᨕ ᨙ", //É
        "è": "ᨕ ᨙ", //è
        "é": "ᨕ ᨙ" //é
    }
    var consonantMap2 = {
        "A": "ᨕ", //A
        "B": "ᨅ", //B
        "C": "ᨌ", //C
        "D": "ᨉ", //D
        "E": "ᨕᨛ", //E
        "F": "ᨄ", //F
        "G": "ᨁ", //G
        "H": "ᨖ", //H
        "I": "ᨕᨗ", //I
        "J": "ᨍ", //J
        "K": "ᨀ", //K
        "L": "ᨒ", //L
        "M": "ᨆ", //M
        "N": "ᨊ", //N
        "O": "ᨕᨚ", //O
        "P": "ᨄ", //P
        "Q": "ᨀ", //Q
        "R": "ᨑ", //R
        "S": "ᨔ", //S
        "T": "ᨈ", //T
        "U": "ᨕᨘ", //U
        "V": "ᨄ", //V
        "W": "ᨓ", //W
        "X": "ᨕ ᨙ", //X
        "Y": "ᨐ", //Y
        "Z": "ᨍ", //Z
        '​': "ᨕ", //zws zero-width space
        "a": "ᨕ", //a
        "b": "ᨅ", //b
        "c": "ᨌ", //c
        "d": "ᨉ", //d
        "e": "ᨕᨛ", //e
        "f": "ᨄ", //f
        "g": "ᨁ", //g
        "h": "ᨖ", //h
        "i": "ᨕᨗ", //i
        "j": "ᨍ", //j
        "k": "ᨀ", //k
        "l": "ᨒ", //l
        "m": "ᨆ", //m
        "n": "ᨊ", //n
        "o": "ᨕᨚ", //o
        "p": "ᨄ", //p
        "q": "ᨀ", //q
        "r": "ᨑ", //r
        "s": "ᨔ", //s
        "t": "ᨈ", //t
        "u": "ᨕᨘ", //u
        "v": "ᨄ", //v
        "w": "ᨓ", //w
        "x": "ᨕ ᨙ", //x
        "y": "ᨐ", //y
        "z": "ᨍ", //z
        "È": "ᨕ ᨙ", //È
        "É": "ᨕ ᨙ", //É
        "è": "ᨕ ᨙ", //è
        "é": "ᨕ ᨙ" //é
    }
    var consonantMap, murda;
    var modeMurda = document.getElementsByName("murda");
    for (var rad in modeMurda) {
        if (modeMurda[rad].checked)
            murda = modeMurda[rad].value;
    }
    if (murda == "pakai")
        consonantMap = consonantMap2; else //if(murda == "tidak")
        consonantMap = consonantMap1;
    var h_shift = GetShift(str);
    var core = str;
    if (h_shift["CoreSound"] == null) {
        if (consonantMap[str.charAt(0)]) core = consonantMap[str.charAt(0)];
        return {
            "CoreSound": core,
            "len": 1
        }
            ;
    } else {
        return h_shift;
    }
}
/***************************
Function ResolveCharacterSound
return tanda baca, digit, vokal, maupun nglegana+pangkon
****************************/
function ResolveCharacterSound(c) {
    var str = "" + c;
    var len = 0;
    if (isDigit(c)) {
        return "" + ('' + (c - '0'));
    } else if (isConsonant(str[0])) {
        return "" + GetCoreSound(str).CoreSound + "ᨛ";
    } else {
        //if (isVowel(str[0])) {
        return "" + GetCoreSound(str).CoreSound;
    }
    /**/
}
/***************************
Function GetSound
fungsi yang mentransliterasi masing-masing suku kata
****************************/
function GetSound(str) {
    var len = 0;
    str = SuperTrim(str);
    if (str == null || str == "") {
        return "";
    }
    if (str.length == 1) {
        return ResolveCharacterSound(str[0]);
    } else {
        var core_sound = GetCoreSound(str);
        //return "1"+core_sound.CoreSound+"2";
        var matra = "";
        var konsonan = "";
        if (core_sound.len >= 1) {
            matra = GetMatra(str.substring(core_sound.len));
            //aeiou (suku, wulu, pepet, taling, taling tarung, dll.)
			/*if () {
} else {
}*/
        } else {
            matra = "";
        }
        if (str.indexOf("nggr") == 0) {
            //nggr-
            if (vowelPrev) konsonan = "ᬂᬕ᭄ᬭ";
            //<vowel>nggr-, e.g. panggrahita else konsonan = "ᬗ᭄ᬕ᭄ᬭ";
            //<nonvowel>nggr-, i.e. nggronjal
        } else if (str.indexOf("ngg") == 0) {
            //ngg-
            if (vowelPrev) konsonan = "ᬂᬕ";
            //<vowel>ngg-, e.g. tunggal else konsonan = "ᬗ᭄ᬕ";
            //<nonvowel>ngg-, i.e. nggambar
        } else if (str.indexOf("njl") == 0) {
            //njl-
            konsonan = "ᬜ᭄ᬚ᭄ᬮ";
        } else if (str.indexOf("njr") == 0) {
            //njr-
            konsonan = "ᬜ᭄ᬚ᭄ᬭ";
        } else if (str.indexOf("ngg") == 0) {
            //njr-
            if (vowelPrev) konsonan = "ᬂᬕ";
            //<vowel>ngg-, e.g. tunggal else konsonan = "ᬗ᭄ᬕ";
            //<nonvowel>ngg-, i.e. nggambar
        } else if (core_sound.CoreSound == "ᬦᬜ᭄ᬘ") {
            // -nc-
            konsonan = "ᬜ᭄ᬘ";
            //-nyc-/*
        } else if (core_sound.CoreSound == "ᬦᬜ᭄ᬚ᭄ᬮ") {
            // -njl-
            konsonan = "ᬜ᭄ᬚ᭄ᬮ";
            //-njl-
        } else if (core_sound.CoreSound == "ᬦᬜ᭄ᬚ") {
            // -njr-
            konsonan = "ᬜ᭄ᬚ᭄ᬭ";
            //-njr-*/
        } else if (core_sound.CoreSound == "ᬦᬜ᭄ᬚ") {
            // -nj-
            konsonan = "ᬜ᭄ᬚ";
            //-nyj-
        } else if (core_sound.CoreSound == "ᬤᬟ᭄ᬯ") {
            // -dhw-
            konsonan = "ᬟ᭄ᬯ";
            //-dhw-
        } else if (core_sound.CoreSound == "ᬤᬟ") {
            // -dhy-
            konsonan = "ᬟ";
            //-dhy-
        } else if (core_sound.CoreSound == "ᬢᬝ᭄ᬯ") {
            // -thw-
            konsonan = "ᬝ᭄ᬯ";
            //-dhw-
        } else if (core_sound.CoreSound == "ᬢᬝ") {
            // -thy-
            konsonan = "ᬝ";
            //-dhy-
        } else if (findstr(core_sound.CoreSound, '') && matra == "᭄") {
            // pengkal
            konsonan = core_sound.CoreSound;
            matra = "";
            //-y-
        } else if (findstr(core_sound.CoreSound, '') && matra == "᭄") {
            // cakra
            konsonan = core_sound.CoreSound;
            matra = "᭄ᬭ";
            //-r-
        } else if (findstr(core_sound.CoreSound, '᭄ᬭ') && matra == "ᭂ") {
            // cakra keret
            if ((str[0] == "n" && str[1] == "y") || ((str[0] == "t" || str[0] == "d") && str[1] == "h")) {
                konsonan = GetCoreSound(str[0] + str[1]).CoreSound + "";
                matra = "";
                //nyrê-, thrê-, dhrê-
            } else if (str[0] == "n" && str[1] == "g") {
                if (str[2] == "g") konsonan = "ᬗ᭄ᬕ"; else konsonan = "ᬗ";
                matra = "";
                //nggrê-/ngrê-
            } else {
                konsonan = GetCoreSound(str[0]).CoreSound + "";
                matra = "";
                //-rê-
            }
        } else if (findstr(core_sound.CoreSound, 'ᬮ') && matra == "ᭂ") {
            // nga lelet
            if ((str[0] == "n" && str[1] == "y") || ((str[0] == "t" || str[0] == "d") && str[1] == "h")) {
                konsonan = GetCoreSound(str[0] + str[1]).CoreSound + "᭄ᬮᭂ";
                matra = "";
                //nylê-, thlê-, dhlê-
            } else if (str[0] == "n" && str[1] == "g") {
                if (str[2] == "g") konsonan = "ᬗ᭄ᬕ᭄ᬮᭂ"; else konsonan = "ᬗ᭄ᬮᭂ";
                matra = "";
                //ngglê-/nglê-
            } else if (str[0] == "l") {
                konsonan = "ᬍ";
                matra = "";
                //-lê-
            } else {
                konsonan = GetCoreSound(str[0]).CoreSound + "᭄ᬮᭂ";
                matra = "";
                //-lê-
            }
        } else if (core_sound.CoreSound == 'ᬝ᭄ᬭ' || core_sound.CoreSound == 'ᬟ᭄ᬭ' || core_sound.CoreSound == 'ᬗ᭄ᬭ' || core_sound.CoreSound == 'ᬜ᭄ᬭ') {
            // i.e. nyruput
            konsonan = core_sound.CoreSound;
            if (matra == "᭄") matra = "";
        } else if (core_sound.CoreSound == "ᬮᬮ᭄ᬮ") {
            // -ll-
            konsonan = "ᬮ᭄ᬮ";
            //double -l-
        } else if (core_sound.CoreSound == "ᬃᬃᬭ") {
            // -rr-
            konsonan = "ᬃᬭ";
            //double -r-
        } else if (core_sound.CoreSound == "ᬃᬃᬳ") {
            // -rh-
            konsonan = "ᬃᬳ";
            //-rh-
        } else if (core_sound.CoreSound == "ᬃᬃᬮ") {
            // -rl-
            konsonan = "ᬃᬮ";
            //-rl-
        } else if (core_sound.CoreSound == "ᬃᬃᬯ") {
            // -rw-
            if (vowelPrev) konsonan = "ᬃᬯ";
            //-rw- -- arwana else konsonan = "ᬭ᭄ᬯ";
            //rw- -- rwa/rwi/rwab
        } else if (core_sound.CoreSound == "ᬃᬃᬘ") {
            // -rc-
            konsonan = "ᬃᬘ";
            //-rc-
        } else if (core_sound.CoreSound == "ᬄᬄᬳ") {
            // -hh-
            konsonan = "ᬄᬳ";
            //double -h-
        } else if (core_sound.CoreSound == "ᬄᬄᬮ") {
            // -hl-
            if (vowelPrev) konsonan = "ᬄᬮ";
            //-hl- else konsonan = "ᬳ᭄ᬮ";
            //hlam
        } else if (core_sound.CoreSound == "ᬄᬄᬯ") {
            // -hw-
            if (vowelPrev) konsonan = "ᬄᬯ";
            //-hw- else konsonan = "ᬳ᭄ᬯ";
            //hwab,hwan
        } else if (core_sound.CoreSound == "ᬄᬳ") {
            // -hy-
            if (vowelPrev) konsonan = "ᬄᬬ";
            //sembahyang else konsonan = "ᬳ";
            //hyang/*
        } else if (core_sound.CoreSound == "ᬄᬄ") {
            // hrx-
            konsonan = "ᬳ᭄ᬭ";
            //hrx-
        } else if (core_sound.CoreSound == "ᬄᬄ᭄ᬭ") {
            // hr-
            if (matra == "ᭂ") konsonan = "ᬳ";
            //hr- else konsonan = "ᬳ᭄ᬭ";
            //hr-
        } else if (core_sound.CoreSound == "ᬄᬳ᭄ᬭ") {
            // hr-
            if (matra == "ᭂ") konsonan = "ᬳ";
            //hr- else konsonan = "ᬳ";
            //hr-
        } else if (core_sound.CoreSound == 'ᬄ' && matra == "᭄") {
            // wignyan - 12 April
            konsonan = "ᬳ";
            //ha
        } else if (core_sound.CoreSound == 'ᬄ' && matra != "᭄") {
            // wignyan
            konsonan = "ᬳ";
            //ha
        } else if (core_sound.CoreSound == 'ᬃ' && matra == "ᭂ") {
            // pa cerek
            konsonan = "ᬋ";
            matra = "";
            //rê
        } else if (core_sound.CoreSound == 'ᬃ' && matra != "᭄") {
            // layar
            konsonan = "ᬭ";
            //ra
        } else if (core_sound.CoreSound == 'ᬂ' && matra != "᭄") {
            // cecak
            konsonan = "ᬗ";
            //nga
        } else if (core_sound.CoreSound == 'ᬂ' && matra == "᭄") {
            // cecak
            konsonan = "ᬂ";
            matra = "";
            //cecak
        } else {
            konsonan = core_sound.CoreSound;
        }
        return "" + konsonan + matra;
    }
}
/***************************
Function DoTransliterate
fungsi utama yang dipanggil (main function)
****************************/
function DoTransliterate(str) {
    var i = 0;
    var ret = "";
    var pi = 0;
    var vowelFlag = false;
    startVowel = false;
    str = SuperTrim(str);
    while (i < str.length) {
        if (i > 0 && isVowel(str[i]) && isVowel(str[i - 1])) { //deal with words that start with multiple vocals
            str = str.substring(0, i) + '​' + str.substring(i, str.length);
        }
        if ((isSpecial(str[i])) && !vowelFlag) {
            //i++;
        } else if ((str[i] == 'h' && vowelFlag) || (!isVowel(str[i]) && i > 0) || (str[i] == ' ') || isPunct(str[i]) || isDigit(str[i]) || ((i - pi) > 5)) {
            ret += GetSound(str.substring(pi, i));
            if (str[i] == ' ') { ret += ' '; }
            if (isPunct(str[i])) {
                ret += str[i];
                pi = i + 1;
            } else {
                pi = i;
            }
            vowelFlag = false;
        } else if (isVowel(str[i]) && str[i] != 'h') {
            //ret += GetSound(str.substring(pi, i));
            vowelFlag = true;
        }
        if (pi > 0 && isVowel(str[pi - 1])) {
            //<vowel>ngg
            vowelPrev = true;
        } else vowelPrev = false;
        i++;
    }
    //endwhile
    if (pi < i) {
        ret += GetSound(str.substring(pi, i));
    }
    return SuperTrim(ret);
}