using DurableFunctions.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DurableFunctions.PreBuilt.FanInOut
{
    public class Sequence
    {
        [FunctionName("FanInOutSequence")]
        public static async Task<List<string>> Run([OrchestrationTrigger] IDurableOrchestrationContext context)
        {
            RetryOptions options = new RetryOptions(TimeSpan.FromSeconds(60), 5);

            var parallelTasks = new List<Task<string>>();

            foreach (var person in ListOfPeople)
            {
                Task<string> task = context.CallActivityWithRetryAsync<string>("GetFullName", options, person);
                parallelTasks.Add(task);
            }

            var result = await Task.WhenAll(parallelTasks);
            return result.ToList();
        }

        public static List<Person> ListOfPeople = new List<Person>() {
            new Person() {FirstName = "David", LastName = "Opdendries" },
            new Person() {FirstName = "John", LastName = "Doh" },
            new Person() {FirstName = "Stevy", LastName = "Wonder" },
            new Person() {FirstName = "Jane", LastName = "Doh" },
            new Person() {FirstName = "Steve", LastName = "Jobs" },
            new Person() {FirstName = "Bill", LastName = "Gates" },
            new Person() {FirstName = "Arnald", LastName = "Someone" }
        };

    }
}
