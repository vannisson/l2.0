function analyze(){
    var txt = $("#text_box").val();
    $.ajax({
        url: 'http://127.0.0.1:5000/analyze/',
        contentType: 'application/json',
        cache: false,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            text: txt
        }),
        success: function(data) {
            var pos = data.pos;
            document.getElementById("POS").innerHTML=data.pos;
            document.getElementById("Dil").innerHTML=data.dil;
            document.getElementById("Del").innerHTML=data.del;
            document.getElementById("N_words").innerHTML=data.n_words;
            document.getElementById("N_lines").innerHTML=data.n_lines + " linhas";
        }
    });
    
}

