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

function wm_rx_live_update(j) {
    if (!Array.isArray(j)) { return; }
    var ul = document.querySelector("#webmentions ul");
    ul.innerHTML = "";
    var likes_reposts = [];
    j.forEach(function(wm) {
        var imgsrc;
        if (wm.author && wm.author.photo && wm.author.photo != "null") {
            imgsrc = wm.author.photo;
        } else {
            imgsrc = "http://www.gravatar.com/avatar/no?d=mm";
        }
        var wmaname;
        if (wm.author && wm.author.name && wm.author.name != "null") {
            wmaname = wm.author.name;
        }

        if (wm.type == "like" || wm.type == "repost") {
            likes_reposts.push({imgsrc: imgsrc, name: wmaname, url: wm.url});
            return;
        }

        var li = document.createElement("li");
        
        var img = document.createElement("img"); 
        img.src = imgsrc;

        var tn;
        if (wmaname) {
            tn = " " + wmaname + " responded at ";
        } else {
            tn = " A response was written at ";
        }

        var a = document.createElement("a");
        a.href = wm.url;
        var netloc = wm.url.match(/:\/\/([^\/]+)/)[1];
        if (netloc.length > 20) {
            netloc = netloc.substr(0,20) + "...";
        }
        var wm_name = wm.name || "null";
        if (wm_name.length > 20) {
            wm_name = wm_name.substr(0,20) + "...";
        }
        if (netloc == "twitter.com") {
            li.className += " twitter";
            var twimg = document.createElement("img");
            twimg.src = "../../../../theme/twitter24.png";
            a.appendChild(twimg);
            a.appendChild(img);
            a.appendChild(document.createTextNode(wmaname));
            li.appendChild(a);
        } else {
            li.appendChild(img);
            li.appendChild(document.createTextNode(tn));
            if (wm.name && wm.name != "null") {
                a.appendChild(document.createTextNode(wm_name));
                li.appendChild(a);
                li.appendChild(document.createTextNode(" (" + netloc + ") "));
            } else {
                a.appendChild(document.createTextNode(netloc));
                li.appendChild(a);
            }
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
    if (likes_reposts.length > 0) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode("Liked/reposted by: "));
        likes_reposts.forEach(function(lr) {
            var a = document.createElement("a");
            a.href = lr.url;
            var img = document.createElement("img");
            img.src = lr.imgsrc;
            a.appendChild(img);
            a.setAttribute("title", lr.name);
            li.appendChild(a);
            li.appendChild(document.createTextNode(" "));
        });
        ul.appendChild(li);
    }
}
function live_update_wm(cb) {
    var x = new XMLHttpRequest();
    var pageURL = location.href;
    // localhost debugging
    pageURL = pageURL.replace(/localhost:[0-9]+\//, "www.kryogenix.org/days/");
    pageURL = pageURL.replace(/file:\/\/.*githubrepo\/output\//, "https://www.kryogenix.org/days/");
    pageURL = pageURL.replace("?" + location.search, "");
    x.open("GET", "https://www.kryogenix.org/days/theme/wmproxy.php?url=" + pageURL, true);
    x.onreadystatechange = function() {
        if (x.readyState == 4) {
            var j;
            try {
                j = JSON.parse(x.responseText);
            } catch(e) {
                return;
            }
            cb(j);
        }
    };
    x.send();
}
live_update_wm(wm_rx_live_update);
