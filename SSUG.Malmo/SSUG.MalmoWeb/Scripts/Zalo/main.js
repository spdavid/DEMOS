/// <reference path="../scripts/typings/es6-promise/es6-promise.d.ts" />
var Zalo;
(function (Zalo) {
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.getJSON = function (url) {
            var prom = new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', url);
                request.setRequestHeader("Accept", "application/json");
                request.send();
                request.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(this.response);
                    }
                    else {
                        // Performs the function "reject" when this.status is different than 2xx
                        reject(this.statusText);
                    }
                };
                request.onerror = function () {
                    reject(this.statusText);
                };
            });
            return prom;
        };
        Utilities.postJSON = function (url, data) {
            var prom = new Promise(function (resolve, reject) {
                console.log("gonna post");
                var request = new XMLHttpRequest();
                request.open('POST', url);
                request.setRequestHeader("X-RequestDigest", document.getElementById("__REQUESTDIGEST").getAttribute("value"));
                request.setRequestHeader("Accept", "application/json");
                request.setRequestHeader("content-type", "application/json;odata=verbose");
                request.send(JSON.stringify(data));
                request.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(this.response);
                    }
                    else {
                        // Performs the function "reject" when this.status is different than 2xx
                        console.log(JSON.parse(this.response));
                        reject(this.response);
                    }
                };
                request.onerror = function () {
                    console.log(JSON.stringify(this.response));
                    reject(this.response);
                };
            });
            return prom;
        };
        Utilities.loadScript = function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            }
            else {
                script.onload = function () {
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        };
        Utilities.loadCss = function (path) {
            var head = document.getElementsByTagName("head");
            var e = document.createElement("link");
            head[0].appendChild(e);
            e.setAttribute("type", "text/css");
            e.setAttribute("rel", "stylesheet");
            e.setAttribute("href", path);
        };
        return Utilities;
    }());
    Zalo.Utilities = Utilities;
})(Zalo || (Zalo = {}));
/// <reference path="../scripts/typings/sharepoint/sharepoint.d.ts" />
var ClientSmartParts;
(function (ClientSmartParts) {
    var AnouncementsPart = (function () {
        function AnouncementsPart() {
        }
        AnouncementsPart.Init = function () {
            // script needed to suppor promises in IE
            Zalo.Utilities.loadScript("https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.2.1/es6-promise.min.js", function () {
                ClientSmartParts.AnouncementsPart.RenderAnnouncements();
            });
        };
        AnouncementsPart.RenderAnnouncements = function () {
            var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('SpecialAnnouncemet')/Items?$select=Title,Body";
            Zalo.Utilities.getJSON(restUrl).then(function (data) {
                var jsonData = JSON.parse(data);
                console.log(jsonData);
                var resultsElement = document.getElementById("showResults");
                var newHtml = "";
                for (var i = 0; i < jsonData.value.length; i++) {
                    var announcementItem = jsonData.value[i];
                    newHtml += "<div>";
                    newHtml += "<span style='font-weight:bold;'>" + announcementItem.Title + "</span>";
                    newHtml += "<span>" + announcementItem.Body + "</span>";
                    newHtml += "</div>";
                }
                resultsElement.innerHTML = newHtml;
            });
        };
        return AnouncementsPart;
    }());
    ClientSmartParts.AnouncementsPart = AnouncementsPart;
})(ClientSmartParts || (ClientSmartParts = {}));
//# sourceMappingURL=main.js.map