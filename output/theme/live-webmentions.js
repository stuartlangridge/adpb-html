var wmform = document.getElementById("wmform");
wmform.addEventListener("submit", function(e) {
    var sub = wmform.querySelector("input[type=submit]");
    sub.value = "Submitting link";
    sub.disabled = true;
    var randomstr = "ifr-name-" + Math.random();
    var ifr = document.createElement("iframe");
    ifr.style.display = "none";
    document.body.appendChild(ifr);
    ifr.contentWindow.name = randomstr;
    wmform.target = randomstr;
    setTimeout(function() {
        live_update_wm("wm_rx_live_update_prompted");
    }, 2000);
}, false);

function wm_rx_live_update_prompted(data) {
    var sub = wmform.querySelector("input[type=submit]");
    sub.value = "Add link";
    sub.disabled = false;
    wm_rx_live_update(data);
}

function wm_rx_live_update(data) {
    if (data && data.query && data.query.results && data.query.results.json) {
        var j = data.query.results.json;
        if (j.json) j = j.json;
        if (!Array.isArray(j)) {
            if (j.url) {
                j = [j];
            } else {
                return;
            }
        }
        var ul = document.querySelector("#webmentions ul");
        ul.innerHTML = "";
        j.forEach(function(wm) {
            /* bouncing the webmentions heroku response off YQL to avoid cross-origin problems
               seems to end up with null values being "null" instead. Tch, eh? */
            var li = document.createElement("li");
            
            var img = document.createElement("img"); 
            if (wm.author && wm.author.photo && wm.author.photo != "null") {
                img.src = wm.author.photo;
            } else {
                img.src = "http://www.gravatar.com/avatar/no?d=mm";
            }
            li.appendChild(img);

            var tn;
            if (wm.author && wm.author.name && wm.author.name != "null") {
                tn = " " + wm.author.name + " responded at ";
            } else {
                tn = " A response was written at ";
            }
            li.appendChild(document.createTextNode(tn));

            var a = document.createElement("a");
            a.href = wm.url;
            var netloc = wm.url.match(/:\/\/([^\/]+)/)[1];
            if (netloc.length > 20) {
                netloc = netloc.substr(0,20) + "...";
            }
            var wm_name = wm.name;
            if (wm_name.length > 20) {
                wm_name = wm_name.substr(0,20) + "...";
            }
            if (wm.name && wm.name != "null") {
                a.appendChild(document.createTextNode(wm_name));
                li.appendChild(a);
                li.appendChild(document.createTextNode(" (" + netloc + ") "));
            } else {
                a.appendChild(document.createTextNode(netloc));
                li.appendChild(a);
            }

            if (wm.summary && wm.summary !== "null") {
                var sp = document.createElement("span");
                sp.className = "wm-summary";
                if (wm.summary.length > 150) {
                    sp.appendChild(document.createTextNode(wm.summary.substr(0,150) + "..."));
                } else {
                    sp.appendChild(document.createTextNode(wm.summary));
                }
                li.appendChild(sp);
            }
            ul.appendChild(li);
        });
    }
}
function live_update_wm(cbname) {
    var s = document.createElement("script");
    s.src = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20" +
        "url%3D%22https%3A%2F%2Fwebmention.herokuapp.com%2Fapi%2Fmentions%3Furl%3D" +
        encodeURIComponent(location.href) +
        "%22%20&format=json&callback=" + cbname + "&rnd=" + Math.random();
    document.getElementsByTagName("head")[0].appendChild(s);
}
live_update_wm("wm_rx_live_update");
