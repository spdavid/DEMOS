using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace SSUG.MalmoWeb.Helpers
{
    public class ScriptEditorDeployment
    {

        const string SCRIPTEDITORXML = @"<webParts>
            <webPart xmlns=""http://schemas.microsoft.com/WebPart/v3"">
            <metaData>
                <type name=""Microsoft.SharePoint.WebPartPages.ScriptEditorWebPart, Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"" />
                <importErrorMessage>Cannot import this Web Part.</importErrorMessage>
            </metaData>
            <data>
                <properties>
                <property name=""Title"" type=""string"">{0}</property>
                <property name=""Description"" type=""string"">{1}</property>
                <property name=""Content"" type=""string"">{2}</property>
                <property name=""ChromeState"" type=""chromestate"">Normal</property>
                </properties>
            </data>
            </webPart>
        </webParts>";


        public static void DeploySmartPart(Site site, string Title, string Desc, string Filename, string Group)
        {
            ClientContext ctx = site.Context as ClientContext;

            var folder = site.RootWeb.Lists.GetByTitle("Web Part Gallery").RootFolder;
            ctx.Load(folder);
            ctx.ExecuteQuery();

            //get the local webpart and upload to web part gallery
            using (FileStream fileStream = System.IO.File.OpenRead(HostingEnvironment.MapPath("/PartHtml") + @"\" + Filename))
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string scriptContents = reader.ReadToEnd();
                    string encodedScript = HttpContext.Current.Server.HtmlEncode(scriptContents);

                    string wpXml = string.Format(SCRIPTEDITORXML, Title, Desc, encodedScript);

                    MemoryStream stream = new MemoryStream();
                    StreamWriter writer = new StreamWriter(stream);
                    writer.Write(wpXml);
                    writer.Flush();
                    stream.Position = 0;

                    FileCreationInformation fileInfo = new FileCreationInformation();
                    fileInfo.ContentStream = stream;
                    fileInfo.Overwrite = true;
                    fileInfo.Url = Title + ".Webpart";
                    Microsoft.SharePoint.Client.File file =  folder.Files.Add(fileInfo);
                   ListItem item = file.ListItemAllFields; ;
                    item["Title"] = Title;
                    item["Group"] = Group;
                    item.Update();
                    ctx.ExecuteQuery();
                }
            }

        }

    }
}