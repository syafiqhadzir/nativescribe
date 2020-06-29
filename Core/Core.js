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

function init_document() {
    var element = document.getElementById("ta");
    var jv = DoTransliterate(element.value);
    var pre_view_element = document.getElementById("prev_label");
    pre_view_element.innerHTML = jv;
}
function DoPreview() {
    var text = $("#inp_txt").val();
    var trans_text = DoTransliterate(text);
    $("#prev_label").text(trans_text);
}
function DoAppendTransliteration() {
    var currentText = $("#ta").val();

    var text = $("#inp_txt").val();
    if (text.toLowerCase() == 'clear') {
        /*typing clear in the inputbox is very tempting.. lets write a hack.*/
        $("#inp_txt").val('');
        $("#ta").val('');
        return;
    }
    var trans_text = DoTransliterate(text);
    var finalText = currentText + ' ' + trans_text;
    $("#ta").val(finalText);
    $("#inp_txt").val('');
}
$(document).ready(function () {
    $('#inp_txt').keydown(function (event) {
        if (event.keyCode == '13') {
            DoAppendTransliteration();
        }
    });

    $('#inp_txt').keyup(function () {
        DoPreview();
    });
    DoPreview();
});