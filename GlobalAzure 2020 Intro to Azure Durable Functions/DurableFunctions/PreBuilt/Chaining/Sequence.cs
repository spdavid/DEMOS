using DurableFunctions.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DurableFunctions.PreBuilt.Chaining
{
    public class Sequence
    {
        [FunctionName("ChaningSequence")]
        public static async Task<List<string>> Run([OrchestrationTrigger] IDurableOrchestrationContext context)
        {
            RetryOptions options = new RetryOptions(TimeSpan.FromSeconds(60), 1);

            List<string> people = new List<string>();

            context.SetCustomStatus("Getting User 1");
            var person1 = new Person() { FirstName = "David", LastName = "Opdendries" };
            
            var person1FullName = await context.CallActivityWithRetryAsync<string>("GetFullName", options, person1);
            people.Add(person1FullName);

            context.SetCustomStatus("Getting User 2");
            var person2 = new Person() { FirstName = "John", LastName = "Doh" };
            var person2FullName = await context.CallActivityWithRetryAsync<string>("GetFullName", options, person2);
            people.Add(person2FullName);


            return people;


        }

    }
}
