function analyze(){
    clean();

    // Makes results div visible
    $(function() {
        $("#loading").css("visibility", "visible");
    });
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
            //document.getElementById("POS").innerHTML = data.pos;
            document.getElementById("dil").value = data.dil.toFixed(2);
            document.getElementById("del").value = data.del.toFixed(2);
            document.getElementById("n_words").value = data.n_words;
            document.getElementById("types").value = data.types;

            
            var frequencies = data.frequencies;
            var tbodyRef = document.getElementById('details_table').getElementsByTagName('tbody')[0];

            var cnt = 1

            var subs = 0;
            var verbs = 0;
            var adj = 0;
            var adv = 0;
            var others = 0;

            for(var wd in frequencies) {
                // wd - word
                // data.pos[wd] - word category
                // frequencies[wd] - word count

                var pos_tag = '';
                
                if (data.pos[wd] == 'N' || data.pos[wd] == 'NPROP') {
                    pos_tag = 'SUBSTANTIVO';
                    subs += frequencies[wd];
                } else if (data.pos[wd] == 'V' || data.pos[wd] == 'VAUX') {
                    pos_tag = 'VERBO';
                    verbs += frequencies[wd];
                } else if (data.pos[wd] == 'ADJ') {
                    pos_tag = 'ADJETIVO';
                    adj += frequencies[wd];
                } else if (data.pos[wd] == 'ADV' || data.pos[wd] == 'ADV-KS' || data.pos[wd] == 'ADV-KS-REL') {
                    pos_tag = 'ADVÉRBIO';
                    adv += frequencies[wd];
                } else if (data.pos[wd] == 'ART') {
                    pos_tag = 'ARTIGO';
                    others += frequencies[wd];
                } else if (data.pos[wd] == 'PROADJ' || data.pos[wd] == 'PROPESS' || data.pos[wd] == 'PROSUB' || data.pos[wd] == 'PRO-KS' || data.pos[wd] == 'PRO-KS-REL') {
                    pos_tag = 'PRONOME';
                    others += frequencies[wd];
                } else if (data.pos[wd] == 'PREP') {
                    pos_tag = 'PREPOSIÇÃO';
                    others += frequencies[wd];
                } else if (data.pos[wd] == 'KC' || data.pos[wd] == 'KS') {
                    pos_tag = 'CONJUNÇÃO';
                    others += frequencies[wd];
                } else {
                    pos_tag = 'OUTROS';
                    others += frequencies[wd];
                }

                tbodyRef.innerHTML += '<tr><th scope="row">' + cnt + '</th><td>' + wd + '</td><td>' + pos_tag + '</td><td>' + frequencies[wd] + '</td></tr>'
                cnt++
            }

            document.getElementById("subs_count").value = subs;
            document.getElementById("verbs_count").value = verbs;
            document.getElementById("adj_count").value = adj;
            document.getElementById("adv_count").value = adv;
            document.getElementById("others_count").value = others;

            // Makes results div visible
            $(function() {
                $("#results").css("visibility", "visible");
            });

            $(function() {
                $("#loading").css("visibility", "hidden");
            });
        }
    });
    
}

function clean() {

    $(function() {
        $("#results").css("visibility", "hidden");
    });

    document.getElementById("dil").value = '';
    document.getElementById("del").value = '';
    document.getElementById("n_words").value = '';
    document.getElementById("types").value = '';

    document.getElementById("subs_count").value = '';
    document.getElementById("verbs_count").value = '';
    document.getElementById("adj_count").value = '';
    document.getElementById("adv_count").value = '';
    document.getElementById("others_count").value = '';

    var tbodyRef = document.getElementById('details_table').getElementsByTagName('tbody')[0];
    tbodyRef.innerHTML = '';
}