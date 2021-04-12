let pos_prod_pie;
let general_line_chart;

function analyze(){
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
            
            $("#num_texts").text(parseInt($("#num_texts").text()) + 1);

            $(function() {
                $("#loading").css("visibility", "hidden");
            });
        
            $("#text_box").val('');
        }
    });
    
}

function get_stats() {
    // Makes results div visible
    $(function() {
        $("#loading").css("visibility", "visible");
    });
    $.getJSON({
        url: 'http://127.0.0.1:5000/stats/',
        success: function(data) {            
            
            let datasets = [];

            if ($("#n_words_switch").is(':checked')) {
                datasets.push({
                    label: 'Número de Palavras',
                    data: data.n_words,
                    backgroundColor: 'rgb(255, 99, 132)',
                    hoverOffset: 4
                })
            } 

            if ($("#types_switch").is(':checked')) {
                datasets.push({
                    label: 'Vocabulário',
                    data: data.types,
                    backgroundColor: 'rgb(54, 162, 235)',
                    hoverOffset: 4
                })
            }

            if ($("#dil_switch").is(':checked')) {
                datasets.push({
                    label: 'Diversidade Lexical',
                    data: data.lexicalDiversity,
                    backgroundColor: 'rgb(255, 205, 86)',
                    hoverOffset: 4
                })
            }

            if ($("#del_switch").is(':checked')) {
                datasets.push({
                    label: 'Densidade Lexical',
                    data: data.lexicalDensity,
                    backgroundColor: 'rgb(50, 205, 50)',
                    hoverOffset: 4
                })
            }

            labels = []
            for (var i = 1; i <= data.types.length; i++) {
                labels.push('P' + i);
            }

            const data_chart = {
                labels: labels,
                datasets: datasets
            };
            const config = {
                type: 'line',
                data: data_chart,
            };

            if (general_line_chart == undefined) {
                general_line_chart = new Chart(
                    document.getElementById('general_chart'),
                    config
                );
            } else {
                general_line_chart.data = data_chart;
                general_line_chart.update();
            }
            
            $(function() {
                $("#loading").css("visibility", "hidden");
            });
        }
    });
}

function switch_production() {

    $(function() {
        $("#loading").css("visibility", "visible");
    });

    $.ajax({
        url: 'http://127.0.0.1:5000/prod_info/',
        contentType: 'application/json',
        cache: false,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            production: document.getElementById("production").value
        }),
        success: function(data) {            
            //document.getElementById("POS").innerHTML = data.pos;
            document.getElementById("dil").value = data.dil.toFixed(2);
            document.getElementById("del").value = data.del.toFixed(2);
            document.getElementById("n_words").value = data.n_words;
            document.getElementById("types").value = data.types;
            $("#text_box").val(data.text);

            
            var frequencies = data.frequencies;
            var tbodyRef = document.getElementById('details_table').getElementsByTagName('tbody')[0];
            tbodyRef.innerHTML = '';

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

            // pie_chart
            const data_chart = {
                labels: [
                  'Substantivos',
                  'Verbos',
                  'Adjetivos',
                  'Advérbios',
                  'Outros'
                ],
                datasets: [{
                  label: 'Comparativo itens gramaticais',
                  data: [subs, verbs, adj, adv, others],
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(50, 205, 50)',
                    'rgb(0, 0, 0)'
                  ],
                  hoverOffset: 4
                }]
            };
            const config = {
                type: 'pie',
                data: data_chart,
            };

            if (pos_prod_pie == undefined) {
                pos_prod_pie = new Chart(
                    document.getElementById('pos_prod_chart'),
                    config
                );
            } else {
                pos_prod_pie.data = data_chart;
                pos_prod_pie.update();
            }
            
            $(function() {
                $("#loading").css("visibility", "hidden");
            });
        }
    });

}