let pos_prod_pie;
let general_line_chart;
let pos_general_pie;

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

            // General statistics info
            $('#mean_n_words').text(mean(data.n_words).toFixed(2));
            $('#mean_types').text(mean(data.types).toFixed(2));
            $('#mean_dil').text(mean(data.lexicalDiversity).toFixed(2));
            $('#mean_del').text(mean(data.lexicalDensity).toFixed(2));
            $('#mean_subs').text(mean(data.pos_subs).toFixed(2));
            $('#mean_verbs').text(mean(data.pos_verbs).toFixed(2));
            $('#mean_adj').text(mean(data.pos_adj).toFixed(2));
            $('#mean_adv').text(mean(data.pos_adv).toFixed(2));

            $('#median_n_words').text(mean(data.n_words).toFixed(2));
            $('#median_types').text(mean(data.types).toFixed(2));
            $('#median_dil').text(mean(data.lexicalDiversity).toFixed(2));
            $('#median_del').text(mean(data.lexicalDensity).toFixed(2));
            $('#median_subs').text(mean(data.pos_subs).toFixed(2));
            $('#median_verbs').text(mean(data.pos_verbs).toFixed(2));
            $('#median_adj').text(mean(data.pos_adj).toFixed(2));
            $('#median_adv').text(mean(data.pos_adv).toFixed(2));

            $('#mode_n_words').text(mode(data.n_words)[0]);
            $('#mode_types').text(mode(data.types)[0]);
            $('#mode_dil').text(mode(data.lexicalDiversity)[0].toFixed(2));
            $('#mode_del').text(mode(data.lexicalDensity)[0].toFixed(2));
            $('#mode_subs').text(mode(data.pos_subs)[0]);
            $('#mode_verbs').text(mode(data.pos_verbs)[0]);
            $('#mode_adj').text(mode(data.pos_adj)[0]);
            $('#mode_adv').text(mode(data.pos_adv)[0]);

            $('#sd_n_words').text(sd(data.n_words).toFixed(2));
            $('#sd_types').text(sd(data.types).toFixed(2));
            $('#sd_dil').text(sd(data.lexicalDiversity).toFixed(2));
            $('#sd_del').text(sd(data.lexicalDensity).toFixed(2));
            $('#sd_subs').text(sd(data.pos_subs).toFixed(2));
            $('#sd_verbs').text(sd(data.pos_verbs).toFixed(2));
            $('#sd_adj').text(sd(data.pos_adj).toFixed(2));
            $('#sd_adv').text(sd(data.pos_adv).toFixed(2));

            var lowest_idx = 0;
            lowest_idx = lowest(data.n_words);
            $('#lowest_n_words').text(data.n_words[lowest_idx] + ' (T' + (lowest_idx+1) + ')');
            lowest_idx = lowest(data.types);
            $('#lowest_types').text(data.types[lowest_idx] + ' (T' + (lowest_idx+1) + ')');
            lowest_idx = lowest(data.lexicalDiversity);
            $('#lowest_dil').text(data.lexicalDiversity[lowest_idx].toFixed(2) + ' (T' + (lowest_idx+1) + ')');
            lowest_idx = lowest(data.lexicalDensity);
            $('#lowest_del').text(data.lexicalDensity[lowest_idx].toFixed(2) + ' (T' + (lowest_idx+1) + ')');
            lowest_idx = lowest(data.pos_subs);
            $('#lowest_subs').text(data.pos_subs[lowest_idx] + ' (T' + (lowest_idx+1) + ')');
            lowest_idx = lowest(data.pos_verbs);
            $('#lowest_verbs').text(data.pos_verbs[lowest_idx] + ' (T' + (lowest_idx+1) + ')');
            lowest_idx = lowest(data.pos_adj);
            $('#lowest_adj').text(data.pos_adj[lowest_idx] + ' (T' + (lowest_idx+1) + ')');
            lowest_idx = lowest(data.pos_adv);
            $('#lowest_adv').text(data.pos_adv[lowest_idx] + ' (T' + (lowest_idx+1) + ')');

            var highest_idx = 0;
            highest_idx = lowest(data.n_words);
            $('#highest_n_words').text(data.n_words[highest_idx] + ' (T' + (highest_idx+1) + ')');
            highest_idx = lowest(data.types);
            $('#highest_types').text(data.types[highest_idx] + ' (T' + (highest_idx+1) + ')');
            highest_idx = lowest(data.lexicalDiversity);
            $('#highest_dil').text(data.lexicalDiversity[highest_idx].toFixed(2) + ' (T' + (highest_idx+1) + ')');
            highest_idx = lowest(data.lexicalDensity);
            $('#highest_del').text(data.lexicalDensity[highest_idx].toFixed(2) + ' (T' + (highest_idx+1) + ')');
            highest_idx = lowest(data.pos_subs);
            $('#highest_subs').text(data.pos_subs[highest_idx] + ' (T' + (highest_idx+1) + ')');
            highest_idx = lowest(data.pos_verbs);
            $('#highest_verbs').text(data.pos_verbs[highest_idx] + ' (T' + (highest_idx+1) + ')');
            highest_idx = lowest(data.pos_adj);
            $('#highest_adj').text(data.pos_adj[highest_idx] + ' (T' + (highest_idx+1) + ')');
            highest_idx = lowest(data.pos_adv);
            $('#highest_adv').text(data.pos_adv[highest_idx] + ' (T' + (highest_idx+1) + ')');


            // Line Chart
            let datasets = [];

            if ($("#n_words_switch").is(':checked')) {
                datasets.push({
                    label: 'Número de Palavras',
                    data: data.n_words,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)'
                })
            } 

            if ($("#types_switch").is(':checked')) {
                datasets.push({
                    label: 'Vocabulário',
                    data: data.types,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)'
                })
            }

            if ($("#dil_switch").is(':checked')) {
                datasets.push({
                    label: 'Diversidade Lexical',
                    data: data.lexicalDiversity,
                    backgroundColor: 'rgb(255, 205, 86)',
                    borderColor: 'rgb(255, 205, 86)'
                })
            }

            if ($("#del_switch").is(':checked')) {
                datasets.push({
                    label: 'Densidade Lexical',
                    data: data.lexicalDensity,
                    backgroundColor: 'rgb(50, 205, 50)',
                    borderColor: 'rgb(50, 205, 50)'
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
                options: {
                    tension: 0.1,
                    hoverOffset: 4,
                    borderWidth: 4,
                    pointHoverRadius: 10
                }
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

            // Pie Chart
            var total_subs = data.pos_subs.reduce((a, b) => a + b, 0);
            var total_verbs = data.pos_verbs.reduce((a, b) => a + b, 0);
            var total_adj = data.pos_adj.reduce((a, b) => a + b, 0);
            var total_adv = data.pos_adv.reduce((a, b) => a + b, 0);
            var total_others = data.pos_others.reduce((a, b) => a + b, 0);

            const data_pie = {
                labels: [
                  'Substantivos',
                  'Verbos',
                  'Adjetivos',
                  'Advérbios',
                  'Outros'
                ],
                datasets: [{
                  label: 'Comparativo total de itens gramaticais',
                  data: [total_subs, total_verbs, total_adj, total_adv, total_others],
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(50, 205, 50)',
                    'rgb(125, 125, 125)'
                  ],
                  hoverOffset: 4
                }]
            };
            const config_pie = {
                type: 'pie',
                data: data_pie,
            };

            if (pos_general_pie == undefined) {
                pos_general_pie = new Chart(
                    document.getElementById('general_pie_chart'),
                    config_pie
                );
            } else {
                pos_general_pie.data = data_pie;
                pos_general_pie.update();
            }

            // Hide loading
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
                    'rgb(125, 125, 125)'
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

// UTILS
//
// Calculating the average/mean
// https://www.sitepoint.com/community/t/calculating-the-average-mean/7302/3
//
 
/**
 * The "mean" is the "average" you're used to, where you add up all the numbers
 * and then divide by the number of numbers.
 *
 * For example, the "mean" of [3, 5, 4, 4, 1, 1, 2, 3] is 2.875.
 *
 * @param {Array} numbers An array of numbers.
 * @return {Number} The calculated average (or mean) value from the specified
 *     numbers.
 */
 function mean(numbers) {
    var total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}
 

/**
 * The "median" is the "middle" value in the list of numbers.
 *
 * @param {Array} numbers An array of numbers.
 * @return {Number} The calculated median value from the specified numbers.
 */
function median(numbers) {
    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    var median = 0, numsLen = numbers.length;
    numbers.sort();
 
    if (
        numsLen % 2 === 0 // is even
    ) {
        // average of two middle numbers
        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else { // is odd
        // middle number only
        median = numbers[(numsLen - 1) / 2];
    }
 
    return median;
}
 
/**
 * The "mode" is the number that is repeated most often.
 *
 * For example, the "mode" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 3, 4].
 *
 * @param {Array} numbers An array of numbers.
 * @return {Array} The mode of the specified numbers.
 */
function mode(numbers) {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    var modes = [], count = [], i, number, maxIndex = 0;
 
    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }
 
    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }
 
    return modes;
}

function sd(numbers) {
    //return index;
    return 0;
}

function highest(numbers) {
    //return index;
    return [].reduce.call(numbers, (m, c, i, arr) => c > arr[m] ? i : m, 0);
}

function lowest(numbers) {
    //return index;
    return [].reduce.call(numbers, (m, c, i, arr) => c < arr[m] ? i : m, 0);
}