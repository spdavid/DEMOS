using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SSUG.MalmoWeb.Controllers
{
    public class HomeController : Controller
    {
        [SharePointContextFilter]
        public ActionResult Index()
        {
            User spUser = null;

            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

            using (var ctx = spContext.CreateUserClientContextForSPHost())
            {
                if (ctx != null)
                {
                    Uri appUrl = Request.Url;

                    string rootAppUrl = appUrl.Scheme + "://" + appUrl.Authority;
                    ctx.Site.AddJsLink("mainjs", rootAppUrl + "/scripts/zalo/main.js", 0);

                    Helpers.ScriptEditorDeployment.DeploySmartPart(ctx.Site, "Announcements", "", "Announcements.html", "Zalo");
                    Helpers.ScriptEditorDeployment.DeploySmartPart(ctx.Site, "ViewLists", "", "ViewLists.html", "Zalo");

                    spUser = ctx.Web.CurrentUser;

                    ctx.Load(spUser, user => user.Title);

                    ctx.ExecuteQuery();

                    ViewBag.UserName = spUser.Title;
                }
            }

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
