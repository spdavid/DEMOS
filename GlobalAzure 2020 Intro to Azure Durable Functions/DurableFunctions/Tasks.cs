using DurableFunctions.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace DurableFunctions
{
    public class Tasks
    {

        [FunctionName("GetFullName")]
        public static string GetFullName([ActivityTrigger] Person info)
        {
            Thread.Sleep(5000);
            return info.FirstName + " " + info.LastName;
        }

        [FunctionName("Example2")]
        public static string Example2([ActivityTrigger] string something)
        {
            //Thread.Sleep(1000);
            return something + " more text";
        }

    }
}
