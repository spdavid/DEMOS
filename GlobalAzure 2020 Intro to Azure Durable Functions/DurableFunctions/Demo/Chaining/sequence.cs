using DurableFunctions.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DurableFunctions.Demo.Chaining
{
    public class sequence
    {
        [FunctionName("DemoSequence")]
        public static async Task<List<string>> Run([OrchestrationTrigger] IDurableOrchestrationContext context)
        {

            List<string> names = new List<string>();

            context.SetCustomStatus("Getting fullname for person 1");
            Person p1 = new Person() { FirstName = "David", LastName = "Opdendries" };
           var fullName1 = await context.CallActivityAsync<string>("GetFullName", p1);

            context.SetCustomStatus("Getting fullname for person 2");
            Person p2 = new Person() { FirstName = "John", LastName = "Doh" };
            var fullName2 = await context.CallActivityAsync<string>("GetFullName", p2);

            names.Add(fullName1);
            names.Add(fullName2);

            return names;


        }
    }
}
