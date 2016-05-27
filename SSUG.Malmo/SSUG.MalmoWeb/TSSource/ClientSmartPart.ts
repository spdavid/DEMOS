/// <reference path="../scripts/typings/sharepoint/sharepoint.d.ts" />
namespace ClientSmartParts {
    export class AnouncementsPart {
        static Init() {
            // script needed to suppor promises in IE
            Zalo.Utilities.loadScript("https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.2.1/es6-promise.min.js", function () {
                ClientSmartParts.AnouncementsPart.RenderAnnouncements();
            });
        }

        static RenderAnnouncements() {
            var restUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('SpecialAnnouncemet')/Items?$select=Title,Body";
            Zalo.Utilities.getJSON(restUrl).then((data : string) => {
               var jsonData  = JSON.parse(data);
               console.log(jsonData);

               var resultsElement = document.getElementById("showResults");
               var newHtml : string = "";
               for (var i = 0; i < jsonData.value.length; i++) {
                   var announcementItem = jsonData.value[i];
                
                   newHtml += "<div>";
                   newHtml += "<span style='font-weight:bold;'>" + announcementItem.Title + "</span>";
                   newHtml += "<span>" + announcementItem.Body + "</span>";
                   newHtml += "</div>";
               }

               resultsElement.innerHTML = newHtml;
            });
        }

    }

    export class ViewListsPart {

        static Init() {
          

            SP.SOD.executeOrDelayUntilScriptLoaded(function () {
                var ctx = SP.ClientContext.get_current();
                var lists = ctx.get_web().get_lists();

                ctx.load(lists);
                ctx.executeQueryAsync(function () {
                    // success
                    console.log(lists);
                });
            }, "sp.js");
          
        }
    }
}