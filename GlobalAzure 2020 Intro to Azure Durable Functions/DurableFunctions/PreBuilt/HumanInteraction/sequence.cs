using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DurableFunctions.PreBuilt.HumanInteraction
{
    public class sequence
    {
        [FunctionName("ApprovalWorkflow")]
        public static async Task<string> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
        {
            
            using (var timeoutCts = new CancellationTokenSource())
            {
                DateTime dueTime = context.CurrentUtcDateTime.AddHours(72);
                Task durableTimeout = context.CreateTimer(dueTime, timeoutCts.Token);

                context.SetCustomStatus("awaiting Approval");

                Task<bool> approvalEvent = context.WaitForExternalEvent<bool>("ApprovalEvent");
                if (approvalEvent == await Task.WhenAny(approvalEvent, durableTimeout))
                {
                    timeoutCts.Cancel();
                    return "Approved";
                }
                else
                {
                    timeoutCts.Cancel();
                    return "Denied";
                }
            }
        }
    }
}
