using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;

namespace DurableFunctions.PreBuilt.FanInOut
{
    public static class FanInOutExample
    {
        [FunctionName("FanInOutExample")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log, [DurableClient] IDurableOrchestrationClient starter)
        {
            var instanceId = await starter.StartNewAsync("FanInOutSequence");
            return starter.CreateCheckStatusResponse(req, instanceId);
        }
    }
}
